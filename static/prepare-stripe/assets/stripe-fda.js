const body = document.body;
const storagePrefix = `fda-${body.dataset.page}-`;
const searchInput = document.querySelector(".search input");
const content = document.querySelector(".document-content");
const status = document.querySelector(".search-status");

const save = (key, value) => localStorage.setItem(storagePrefix + key, value);
const load = (key) => localStorage.getItem(storagePrefix + key);

document.querySelector(".print-button").addEventListener("click", () => window.print());
document.querySelector(".menu-button").addEventListener("click", () => body.classList.toggle("nav-open"));
document.querySelector(".theme-toggle").addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem("fda-theme", body.classList.contains("dark") ? "dark" : "light");
});

if (localStorage.getItem("fda-theme") === "dark") body.classList.add("dark");

document.querySelectorAll(".sidebar nav a[href^='#']").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".sidebar nav a").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    body.classList.remove("nav-open");
  });
});

document.querySelectorAll(".persist").forEach((field) => {
  const stored = load(field.dataset.key);
  if (stored !== null) field.value = stored;
  field.addEventListener("input", () => save(field.dataset.key, field.value));
});

document.querySelectorAll(".persist-check").forEach((field) => {
  const stored = load(field.dataset.key);
  if (stored !== null) field.checked = stored === "true";
  field.addEventListener("change", () => save(field.dataset.key, String(field.checked)));
});

document.querySelectorAll(".score-picker").forEach((picker) => {
  const stored = load(picker.dataset.key);
  if (stored) picker.querySelector(`[data-score="${stored}"]`)?.classList.add("selected");
  picker.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      picker.querySelectorAll("button").forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      save(picker.dataset.key, button.dataset.score);
    });
  });
});

function updateReadiness() {
  if (body.dataset.page !== "worksheet") return;
  const storyRows = [...document.querySelectorAll(".story-matrix tbody tr")];
  const columnFilled = (column) =>
    storyRows.filter((row) => row.querySelector(`td:nth-child(${column}) input`)?.value.trim()).length;
  const scored = [...document.querySelectorAll(".score-picker")].filter((picker) => picker.querySelector(".selected")).length;
  const gateChecks = [...document.querySelectorAll("#final-readiness-gate .persist-check")].filter((box) => box.checked).length;
  const values = {
    story: storyRows.filter((row) => [...row.querySelectorAll("input")].some((input) => input.value.trim())).length,
    user: columnFilled(3),
    impact: columnFilled(6),
    behavior: columnFilled(7),
    rehearsal: Math.min(6, scored),
    gate: Math.min(6, gateChecks),
  };

  document.querySelectorAll(".readiness-metric").forEach((metric) => {
    const value = values[metric.dataset.metric] || 0;
    metric.querySelector("strong").textContent = `${value} / 6`;
    metric.querySelector("i b").style.width = `${(value / 6) * 100}%`;
  });
}

document.addEventListener("input", updateReadiness);
document.addEventListener("change", updateReadiness);
document.addEventListener("click", (event) => {
  if (event.target.closest(".score-picker")) requestAnimationFrame(updateReadiness);
});
updateReadiness();

function showStatus(message) {
  status.textContent = message;
  status.classList.add("show");
  clearTimeout(showStatus.timer);
  showStatus.timer = setTimeout(() => status.classList.remove("show"), 1800);
}

function clearMarks() {
  content.querySelectorAll("mark").forEach((mark) => mark.replaceWith(mark.textContent));
}

function search(query) {
  clearMarks();
  const term = query.trim();
  if (!term) return;

  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  let count = 0;
  let first = null;

  nodes.forEach((node) => {
    if (["SCRIPT", "STYLE", "INPUT", "TEXTAREA", "OPTION"].includes(node.parentElement?.tagName)) return;
    const source = node.nodeValue;
    const index = source.toLowerCase().indexOf(term.toLowerCase());
    if (index < 0) return;
    const mark = document.createElement("mark");
    mark.textContent = source.slice(index, index + term.length);
    const fragment = document.createDocumentFragment();
    fragment.append(source.slice(0, index), mark, source.slice(index + term.length));
    node.replaceWith(fragment);
    count += 1;
    first ||= mark;
  });

  first?.scrollIntoView({ behavior: "smooth", block: "center" });
  showStatus(count ? `${count} section${count === 1 ? "" : "s"} matched “${term}”` : `No matches for “${term}”`);
}

searchInput.addEventListener("search", () => search(searchInput.value));
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") search(searchInput.value);
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});

const progress = document.querySelector(".reading-progress span");
const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${scrollable > 0 ? (scrollY / scrollable) * 100 : 0}%`;
};
addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const sections = [...document.querySelectorAll(".doc-section")];
const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const active = document.querySelector(`.sidebar nav a[href="#${visible.target.id}"]`);
    if (!active) return;
    document.querySelectorAll(".sidebar nav a").forEach((item) => item.classList.remove("active"));
    active.classList.add("active");
  },
  { rootMargin: "-20% 0px -65% 0px", threshold: [0.05, 0.2, 0.5] },
);
sections.forEach((section) => observer.observe(section));
