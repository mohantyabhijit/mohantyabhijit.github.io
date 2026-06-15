const dimensions = [
  {
    id: "value",
    name: "Value Clarity",
    copy: "Clear business outcomes, users, and measures before tools.",
    icon: "target",
    score: 3,
    evidence: "med",
    lowMove: "Define the business moment AI must improve before choosing a tool.",
  },
  {
    id: "trust",
    name: "Trust & Safety",
    copy: "People understand allowed use, risks, and review paths.",
    icon: "shield",
    score: 2,
    evidence: "med",
    lowMove: "Publish usable guardrails and show examples of safe use.",
  },
  {
    id: "skills",
    name: "People & Skills",
    copy: "Role-based fluency, peer learning, and manager confidence.",
    icon: "users",
    score: 3,
    evidence: "high",
    lowMove: "Replace generic AI training with role-based practice.",
  },
  {
    id: "workflow",
    name: "Workflow Integration",
    copy: "AI is embedded into real handoffs, decisions, and tools.",
    icon: "nodes",
    score: 2,
    evidence: "med",
    lowMove: "Redesign one intact workflow with the people who run it.",
  },
  {
    id: "scale",
    name: "Scaling Engine",
    copy: "There is a repeatable path from pilot to production or retirement.",
    icon: "trend",
    score: 2,
    evidence: "low",
    lowMove: "Create a portfolio review that scales wins and kills weak pilots.",
  },
  {
    id: "govern",
    name: "Governance & Risk",
    copy: "Controls continue after launch and adapt as work changes.",
    icon: "lock",
    score: 3,
    evidence: "med",
    lowMove: "Move from approval meetings to lifecycle guardrails and monitoring.",
  },
];

const recommendations = {
  value: {
    title: "Anchor AI to a value pool",
    copy: "Pick one business outcome and define the before-state, user pain, target metric, and minimum credible proof.",
    signals: ["Asana transcript", "MIT Sloan AI spine", "McKinsey State of AI"],
    why: [
      "Stalled pilots often start with tools instead of a workflow or measurable business result.",
      "McKinsey reports stronger value capture where organizations track well-defined KPIs for gen AI solutions.",
      "MIT Sloan argues scaled value requires disciplined governance to improve, evolve, or abandon use cases.",
    ],
  },
  trust: {
    title: "Make trust operational",
    copy: "Give people a clear safe-use map: allowed data, review rules, escalation paths, and examples from their work.",
    signals: ["Asana transcript", "Pacific Life interview", "MIT CISR digital colleagues"],
    why: [
      "Employee hesitation often comes from fear of mistakes, policy violations, or unclear boundaries.",
      "Guidance must avoid becoming bureaucracy that prevents useful experimentation.",
      "Digital colleague models need transparent human oversight and defined escalation paths.",
    ],
  },
  skills: {
    title: "Build local champions, not generic training",
    copy: "Find credible practitioners, have them demo real work, then turn early adopters into the next cohort's coaches.",
    signals: ["Microsoft/DX transcript", "Google Cloud dojo model", "New York Life CHRO interview"],
    why: [
      "The Microsoft talk emphasizes leadership advocacy, formal training, peer demos, and local champions.",
      "Dojo-style cohorts scale by recruiting power users from each wave into the next wave.",
      "Mindset, skill set, and tool set need to move together for durable adoption.",
    ],
  },
  workflow: {
    title: "Run a workflow co-pilot pilot",
    copy: "Choose one high-friction process, map human and AI roles, run shadow mode, then move to advisory mode only when evidence improves.",
    signals: ["AWS transcript", "Accenture AI Engineer talk", "MIT Humans in the Loop"],
    why: [
      "Agentic work changes team structures and requires people who can orchestrate, evaluate, and overrule.",
      "Trust grows through shadow mode, advisory mode, and controlled autonomy gated by outcome evidence.",
      "Research on humans in the loop shows workers shift toward supervisory control tasks, not just faster execution.",
    ],
  },
  scale: {
    title: "Install a scaling engine",
    copy: "Treat AI as a portfolio: structured lifecycle, reuse rules, owner, adoption roadmap, and explicit kill criteria.",
    signals: ["Making AI deliver 2026", "McKinsey State of AI", "MIT CISR maturity"],
    why: [
      "Firms that escape pilot sprawl use a structured lifecycle, disciplined attrition, and design for reuse.",
      "Only a minority of organizations report scaling AI across the organization, despite broad AI usage.",
      "The financial step-change comes when enterprises move from pilots to scaled AI ways of working.",
    ],
  },
  govern: {
    title: "Govern the lifecycle, not the launch deck",
    copy: "Keep oversight alive after deployment: drift, data changes, user behavior, incident paths, and human accountability.",
    signals: ["AWS transcript", "GAIN practitioner panel", "MIT CISR digital colleagues"],
    why: [
      "AI systems fail when business drift, data drift, and edge cases are not observed after launch.",
      "Agent-to-agent coordination raises new escalation and accountability risks.",
      "Governance should clarify ownership without blocking useful local learning.",
    ],
  },
};

const plays = [
  {
    id: "value",
    title: "Value Pool Sprint",
    copy: "One week to identify the workflow, user, metric, and AI behavior worth proving.",
    steps: ["Name the business pain", "Define the counterfactual", "Set a kill threshold"],
  },
  {
    id: "trust",
    title: "Trust Contract",
    copy: "A practical agreement for what teams can do, what must be reviewed, and where accountability sits.",
    steps: ["Allowed data map", "Review checklist", "Escalation path"],
  },
  {
    id: "skills",
    title: "Champion Dojo",
    copy: "Small cohorts where power users demonstrate real work, then become coaches for the next wave.",
    steps: ["Recruit credible peers", "Demo actual tasks", "Convert graduates into coaches"],
  },
  {
    id: "marketing",
    title: "Marketing AI Summit",
    copy: "A two-day internal adoption format: protect learning time, then have teams pitch customer-anchored AI use cases.",
    steps: ["Async learning day", "Pitch business problems", "Fund the strongest experiments"],
  },
  {
    id: "workflow",
    title: "Workflow Co-Pilot Pilot",
    copy: "Embed AI in one intact process and graduate from shadow to advisory to controlled autonomy.",
    steps: ["Map handoffs", "Run shadow mode", "Gate autonomy on evidence"],
  },
  {
    id: "scale",
    title: "Scaling Engine",
    copy: "Portfolio mechanics that make it easy to reuse, fund, and retire AI work without politics.",
    steps: ["Lifecycle stages", "Reuse patterns", "Monthly scale/kill review"],
  },
  {
    id: "govern",
    title: "Lifecycle Governance",
    copy: "Controls that continue after launch and track real-world behavior, drift, and user decisions.",
    steps: ["Post-launch owner", "Drift signals", "Human accountability"],
  },
];

const failures = [
  {
    tag: "Tech first",
    title: "Tool rollout without workflow redesign",
    copy: "Licenses create activity, but the actual work still has old handoffs, approvals, and incentives.",
    avoid: ["Start from a process map", "Measure cycle time and quality", "Redesign human-plus-AI roles"],
  },
  {
    tag: "Generic training",
    title: "Workshops that do not change daily behavior",
    copy: "People learn prompts in the abstract, then return to teams where nobody has modeled the new behavior.",
    avoid: ["Use role-specific examples", "Run peer demos", "Coach managers on follow-through"],
  },
  {
    tag: "No time carved out",
    title: "Expecting teams to learn AI on weekends",
    copy: "Marketing teams cannot absorb rapid AI change if adoption is treated as extra homework outside the operating rhythm.",
    avoid: ["Protect work time for learning", "Turn learning into team pitches", "Tie ideas to customer problems"],
  },
  {
    tag: "Pilot sprawl",
    title: "Experiments with no scaling or kill path",
    copy: "Pilots multiply because saying yes is easier than deciding which proof deserves production investment.",
    avoid: ["Set kill criteria early", "Fund a portfolio", "Design reusable capabilities"],
  },
  {
    tag: "Governance drag",
    title: "Committees that slow every decision",
    copy: "Controls matter, but if guidance is illegible, people either stop experimenting or route around the process.",
    avoid: ["Codify common approvals", "Publish examples", "Monitor after launch"],
  },
];

const sources = [
  {
    type: "Video transcript",
    title: "How to drive AI adoption across your marketing team",
    org: "Asana",
    url: "https://youtu.be/ih2eFFiJTe8",
    image: "https://i.ytimg.com/vi/ih2eFFiJTe8/hqdefault.jpg",
    insight: "Marketing adoption improves when leaders protect learning time, invite bottom-up ideas, run bimonthly training, build influencer councils, and start from customer or business problems rather than tools.",
    detail: {
      drive: [
        "Create a visible AI learning rhythm for the marketing org.",
        "Protect work time for learning, then have teams pitch AI use cases.",
        "Ask every team to start from a customer or business problem.",
        "Fund small experiments tied to measurable marketing outcomes.",
        "Build an internal influencer council of curious practitioners.",
      ],
      avoid: [
        "Do not start with 'here is a tool, go use it.'",
        "Do not expect people to learn AI outside work.",
        "Do not make adoption purely top-down.",
        "Do not measure success only by tool usage.",
      ],
      success: [
        "Marketers pitch AI use cases in terms of customer or business problems.",
        "Teams increase experiment velocity, content relevance, and campaign throughput.",
        "ICs become practical examples for peers.",
        "Regional marketers scale output while preserving strategic relationship work.",
      ],
      failures: [
        "AI remains a side activity disconnected from planning.",
        "People attend training but do not change campaign, content, or creative workflows.",
        "Leadership talks about AI but does not protect time or budget.",
        "Use cases are tool-led and impossible to evaluate.",
      ],
      stripe: [
        "Run AI workflow summits around launch planning, sales enablement, customer proof, lifecycle nurture, partner marketing, and localization.",
        "Ask teams to bring one workflow and one metric, not one tool request.",
        "Build a champion network across PMM, growth, lifecycle, field marketing, comms, and regions.",
        "Use AI to expose customer-question gaps around trust, compliance, pricing, onboarding, integrations, and global payments.",
      ],
    },
  },
  {
    type: "Video transcript",
    title: "How to overcome resistance and lead AI adoption in your organization",
    org: "Asana",
    url: "https://youtu.be/BnH-eewmbX4",
    image: "https://i.ytimg.com/vi/BnH-eewmbX4/hqdefault.jpg",
    insight: "Adoption is people readiness: nervous employees, generic training, unsupported leadership enthusiasm, pilot drift, and governance bottlenecks are the real blockers.",
    detail: {
      drive: [
        "Diagnose readiness across strategy, people, workflow, infrastructure, and governance.",
        "Communicate what is changing, why it matters, and how it affects daily work.",
        "Use role-specific training rather than generic AI education.",
        "Build trust through examples, boundaries, and repeatable support.",
        "Measure adoption progress and adjust the change plan.",
      ],
      avoid: [
        "Do not assume enthusiasm equals sponsorship.",
        "Do not run pilots without a backbone for scaling.",
        "Do not treat nervous employees as blockers.",
        "Do not bury teams in governance meetings before they can learn.",
      ],
      success: [
        "Teams understand how AI applies to their own work.",
        "Resistance turns into informed experimentation.",
        "Pilots either scale or are intentionally retired.",
        "AI becomes part of operations, culture, and business rhythm.",
      ],
      failures: [
        "Employees receive generic training and remain unsure how to act.",
        "Leaders announce AI priorities without budget, time, or decision support.",
        "Infrastructure cannot support workflow integration.",
        "Governance blocks movement or arrives after risky usage has spread.",
      ],
      stripe: [
        "Start with resistance mapping: fear, unclear policy, unclear workflow fit, missing data, and manager hesitation.",
        "Build adoption plans that include stakeholder feedback and progress measurement.",
        "Convert AI anxiety into role-specific stop, continue, and start behaviors.",
        "Make governance usable for fintech marketing: approved data, claims review, compliance, customer confidentiality, and escalation.",
      ],
    },
  },
  {
    type: "Video transcript",
    title: "The AI adoption playbook: Lessons from Microsoft's internal strategy",
    org: "DX",
    url: "https://youtu.be/c51ToE4pPpY",
    image: "https://i.ytimg.com/vi/c51ToE4pPpY/hqdefault.jpg",
    insight: "Microsoft's internal adoption story emphasizes executive advocacy, formal task-fit training, local champions, and peer demos over mandates alone.",
    detail: {
      drive: [
        "Have leaders visibly advocate for AI and explain why it matters.",
        "Teach people which tasks AI is good for and which tasks it is not.",
        "Identify local champions inside teams.",
        "Run peer-led demos using real work.",
        "Measure adoption patterns and target coaching.",
      ],
      avoid: [
        "Do not rely only on mandates.",
        "Do not let hype overpromise what AI can do.",
        "Do not assume skeptical expert teams will adopt without proof.",
        "Do not train on generic prompts without task-fit guidance.",
      ],
      success: [
        "Daily usage rises because people see concrete value.",
        "Team-level champions normalize AI in the flow of work.",
        "Users understand where AI helps and where it does not.",
        "Leaders reinforce adoption without brittle compliance.",
      ],
      failures: [
        "People try AI on bad-fit tasks and conclude it is useless.",
        "Hype creates disappointment.",
        "Dashboards show low usage but no one knows why.",
        "Training is disconnected from actual work.",
      ],
      stripe: [
        "Treat Stripe marketers like expert skeptics: show proof in their workflow, not generic demos.",
        "Build 'watch me work' sessions with PMM, lifecycle, and regional marketers.",
        "Create a task-fit guide for research synthesis, audience briefs, launch messaging, campaign variants, enablement, localization, competitive analysis, and compliance-sensitive copy review.",
        "Measure usage plus value: time to brief, campaign iteration velocity, content reuse, enablement quality, and sales/customer feedback.",
      ],
    },
  },
  {
    type: "Video transcript",
    title: "A leader's guide to advanced team structures in an agentic world",
    org: "AWS Events",
    url: "https://youtu.be/O7u6myBRsns",
    image: "https://i.ytimg.com/vi/O7u6myBRsns/hqdefault.jpg",
    insight: "Agentic work shifts value toward orchestration, outcome measurement, consume/compose/build choices, and governance that can handle multi-agent risk.",
    detail: {
      drive: [
        "Redesign teams around workflows, not narrow lanes.",
        "Train people to orchestrate, evaluate, and overrule AI output.",
        "Use consume, compose, build as an investment framework.",
        "Set outcomes and guardrails, then let teams discover the path.",
        "Build governance for agent interaction, escalation, and accountability.",
      ],
      avoid: [
        "Do not hire only for the framework or tool of the year.",
        "Do not assume specialist silos remain optimal in agentic workflows.",
        "Do not build custom models when managed or composed solutions are enough.",
        "Do not deploy agents without observability and escalation design.",
      ],
      success: [
        "Teams own workflows end to end.",
        "Agents fill specialist gaps while humans preserve judgment and accountability.",
        "Leaders loosen process control but tighten outcome measurement.",
        "Governance handles agent coordination before incidents occur.",
      ],
      failures: [
        "Operators cannot debug invisible behavior.",
        "Agents operate without clear escalation.",
        "Teams keep old handoffs and simply add AI tooling.",
        "The organization builds expensive AI where it should have composed or consumed.",
      ],
      stripe: [
        "Help Stripe marketers become expert generalist operators who orchestrate research, content, segmentation, compliance review, and launch workflows.",
        "Use consume for generic productivity, compose for Stripe-specific GTM workflows, and build only for durable differentiation or risk needs.",
        "Define human review points for regulated marketing claims.",
        "Measure launch cycle time, campaign quality, review latency, and customer-facing accuracy.",
      ],
    },
  },
  {
    type: "Research",
    title: "The State of AI: Global Survey 2025",
    org: "McKinsey",
    url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
    image: "",
    insight: "AI use is broad, but most organizations are still experimenting or piloting; scaling correlates with KPIs, roadmaps, communications, and role-based capability building.",
    detail: {
      drive: [
        "Move beyond experimentation into enterprise scaling practices.",
        "Set growth and innovation objectives, not just efficiency targets.",
        "Redesign individual workflows around AI.",
        "Have senior leaders demonstrate ownership and role model use.",
        "Track KPIs for AI solutions and define human validation rules.",
      ],
      avoid: [
        "Do not confuse regular AI use with scaled value.",
        "Do not run fragmented use cases without workflow integration.",
        "Do not set only cost-reduction goals.",
        "Do not ignore AI risks such as inaccuracy, privacy, explainability, regulatory compliance, and IP.",
      ],
      success: [
        "AI is scaled across functions and embedded in business processes.",
        "Workflows are redesigned, not merely accelerated.",
        "Business impact is visible in growth, innovation, customer satisfaction, differentiation, and efficiency.",
        "Human validation and risk mitigation are explicit.",
      ],
      failures: [
        "AI remains in pilots despite broad interest.",
        "Enterprise impact stays low because work has not changed.",
        "Adoption is measured by activity rather than business outcomes.",
        "Risks materialize faster than mitigation practices.",
      ],
      stripe: [
        "Frame marketing AI around growth, customer understanding, and GTM quality, not only productivity.",
        "Build KPI trees for lead quality, conversion, activation, launch velocity, content accuracy, localization speed, sales enablement reuse, and customer trust.",
        "Use senior marketing leaders as visible adopters and sponsors.",
        "Embed human validation where claims, compliance, pricing, financial services language, or customer data are involved.",
      ],
    },
  },
  {
    type: "Research",
    title: "Create Generative AI Value at Scale",
    org: "MIT Sloan Management Review",
    url: "https://sloanreview.mit.edu/article/create-generative-ai-value-at-scale/",
    image: "",
    insight: "The AI spine connects cross-functional expertise, user help, disciplined governance, and the ability to improve or abandon use cases.",
    detail: {
      drive: [
        "Build an AI spine connecting business users, technical experts, governance, and implementation.",
        "Focus on process-level improvements.",
        "Continuously improve use cases after launch.",
        "Share patterns across business units.",
        "Make abandon, continue, and scale decisions based on measurable value.",
      ],
      avoid: [
        "Do not distribute LLM access and assume strategy will emerge.",
        "Do not optimize isolated tasks while ignoring end-to-end process value.",
        "Do not let business units compete for AI resources without shared learning.",
        "Do not keep low-value use cases alive for political reasons.",
      ],
      success: [
        "AI use cases improve processes across teams.",
        "Reusable patterns emerge.",
        "Use cases evolve through feedback.",
        "Weak experiments are killed quickly.",
      ],
      failures: [
        "LLM usage remains personal productivity only.",
        "Process improvements are trapped in one unit.",
        "Teams duplicate similar AI work.",
        "No one owns portfolio focus.",
      ],
      stripe: [
        "Build a marketing AI spine across PMM, growth, lifecycle, sales, legal/compliance, data, design, and regional teams.",
        "Move learnings across campaign, launch, localization, partner, and lifecycle workflows.",
        "Create a shared library of workflow patterns, prompts, evaluation rubrics, approved claims, customer objections, and reusable GTM assets.",
        "Run monthly scale/kill reviews for marketing AI experiments.",
      ],
    },
  },
  {
    type: "Video research",
    title: "Most Enterprise Agentic Projects Are Doomed, Here's Why",
    org: "AI Engineer / Accenture",
    url: "https://www.youtube.com/watch?v=AGkzpxMdPn8",
    image: "https://i.ytimg.com/vi/AGkzpxMdPn8/hqdefault.jpg",
    insight: "Production takes alignment across security, infrastructure, data governance, finance, and delivery. Trust grows through evidence-gated autonomy.",
    detail: {
      drive: [
        "Start with hypotheses and define what evidence would increase confidence.",
        "Use small delivery loops with evaluation built in.",
        "Align security, data, infrastructure, product, and finance early.",
        "Use staged autonomy: shadow, advisory, controlled autonomy.",
        "Fund a portfolio and rebalance based on evidence.",
      ],
      avoid: [
        "Do not treat production blockers as code issues only.",
        "Do not wait until the end to involve security, governance, infrastructure, or finance.",
        "Do not graduate autonomy based on calendar milestones.",
        "Do not demand fixed ROI certainty from every early AI bet.",
      ],
      success: [
        "Teams move from prototype to production through clear evidence gates.",
        "Trust increases because the system proves itself in lower-risk modes first.",
        "Governance, security, and infrastructure are part of delivery.",
        "The organization learns faster because evaluations are part of every iteration.",
      ],
      failures: [
        "A two-week prototype takes a year to ship because stakeholders were not aligned.",
        "AI remains stuck in pilot because no one can approve production risk.",
        "Autonomy is either blocked forever or granted too quickly.",
        "Teams optimize demos instead of deployment paths.",
      ],
      stripe: [
        "Use staged autonomy for marketing AI: shadow drafts, advisory recommendations, then bounded internal workflows with audit trails.",
        "Bring legal, compliance, data, brand, and marketing ops into the workflow early.",
        "Define evidence gates for every marketing AI pilot.",
        "Treat each pilot as a portfolio bet: continue, scale, or stop.",
      ],
    },
  },
];

const iconPaths = {
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M16 8l4-4M16 4h4v4"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 7.8-8 9-4.5-1.2-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-5"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  nodes: '<circle cx="6" cy="7" r="3"/><circle cx="18" cy="7" r="3"/><circle cx="12" cy="17" r="3"/><path d="M8.5 9.2l2.2 4.1M15.5 9.2l-2.2 4.1"/>',
  trend: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16l3-4 3 2 5-7"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
};

let persona = "leader";

function renderDimensions() {
  const table = document.querySelector("#dimensionTable");
  table.innerHTML = dimensions.map((dim) => `
    <article class="dimension-row" data-id="${dim.id}">
      <div class="dimension-name">
        <span class="dim-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[dim.icon]}</svg></span>
        <div>
          <strong>${dim.name}</strong>
          <small>${dim.copy}</small>
        </div>
      </div>
      <label class="slider-wrap">
        <span class="scale-labels"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></span>
        <input type="range" min="1" max="5" value="${dim.score}" data-score="${dim.id}" aria-label="${dim.name} maturity" />
      </label>
      <div class="evidence">
        <div class="segmented" aria-label="${dim.name} evidence">
          ${["low", "med", "high"].map((level) => `<button type="button" data-evidence="${dim.id}:${level}" class="${dim.evidence === level ? "selected" : ""}">${level}</button>`).join("")}
        </div>
        <small>${dim.lowMove}</small>
      </div>
    </article>
  `).join("");

  table.querySelectorAll("input[type='range']").forEach((input) => {
    input.addEventListener("input", (event) => {
      const dim = dimensions.find((item) => item.id === event.target.dataset.score);
      dim.score = Number(event.target.value);
      updateState();
    });
  });

  table.querySelectorAll("[data-evidence]").forEach((button) => {
    button.addEventListener("click", () => {
      const [id, level] = button.dataset.evidence.split(":");
      const dim = dimensions.find((item) => item.id === id);
      dim.evidence = level;
      renderDimensions();
      updateState();
    });
  });
}

function weakestDimension() {
  return [...dimensions].sort((a, b) => a.score - b.score || evidenceWeight(a.evidence) - evidenceWeight(b.evidence))[0];
}

function evidenceWeight(level) {
  return { low: 0, med: 1, high: 2 }[level] ?? 1;
}

function updateState() {
  const avg = dimensions.reduce((sum, dim) => sum + dim.score, 0) / dimensions.length;
  const rounded = avg.toFixed(1);
  document.querySelector("#overallScore").value = rounded;
  document.querySelector("#overallScoreLarge").value = rounded;
  document.querySelector("#progressFill").style.width = `${avg * 20}%`;
  document.querySelector("#maturityLabel").textContent = avg < 2.2 ? "Early: scattered experiments, unclear ownership." : avg < 3.4 ? "Developing: usable pilots, uneven adoption." : "Scaling: repeatable ways of working are forming.";
  document.querySelector("#overallNarrative").textContent = avg < 2.2
    ? "Start with trust, value clarity, and one narrow workflow."
    : avg < 3.4
      ? "You have enough motion to learn, but not enough operating discipline to scale."
      : "The next constraint is portfolio discipline and lifecycle governance.";

  const weak = weakestDimension();
  const rec = recommendations[weak.id];
  document.querySelector("#bottleneckTitle").textContent = weak.name;
  document.querySelector("#bottleneckCopy").textContent = weak.lowMove;
  document.querySelector("#recommendationTitle").textContent = rec.title;
  document.querySelector("#recommendationCopy").textContent = personaCopy(rec.copy);
  document.querySelector("#whyList").innerHTML = rec.why.map((item) => `<li><span class="check">✓</span><span>${item}</span></li>`).join("");
  document.querySelector("#signalList").innerHTML = rec.signals.map((item) => `<li>${item}</li>`).join("");
  document.querySelectorAll(".play-card").forEach((card) => card.classList.toggle("selected", card.dataset.id === weak.id));
  renderBars();
}

function personaCopy(copy) {
  if (persona === "champion") return `${copy} Your job is to make the new behavior visible to peers.`;
  if (persona === "enablement") return `${copy} Package the learning loop so teams can repeat it without you in the room.`;
  return copy;
}

function renderBars() {
  const counts = [1, 2, 3, 4, 5].map((score) => dimensions.filter((dim) => dim.score === score).length);
  const max = Math.max(...counts, 1);
  document.querySelector("#bars").innerHTML = counts.map((count, index) => `
    <div class="bar"><span style="height:${Math.max(8, (count / max) * 62)}px"></span><small>${index + 1}</small></div>
  `).join("");
}

function renderCards() {
  document.querySelector("#playGrid").innerHTML = plays.map((play, index) => `
    <article class="play-card" data-id="${play.id}">
      <span class="num">${index + 1}</span>
      <h3>${play.title}</h3>
      <p>${play.copy}</p>
      <ul>${play.steps.map((step) => `<li>${step}</li>`).join("")}</ul>
    </article>
  `).join("");

  document.querySelector("#failureGrid").innerHTML = failures.map((failure) => `
    <article class="failure-card">
      <span class="tag">${failure.tag}</span>
      <strong>${failure.title}</strong>
      <p>${failure.copy}</p>
      <ul>${failure.avoid.map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
  `).join("");

  document.querySelector("#sourceGrid").innerHTML = sources.map((source, index) => `
    <article class="source-card source-clickable" data-source-index="${index}" tabindex="0" role="button" aria-label="Open source notes for ${source.title}">
      ${source.image ? `<img src="${source.image}" alt="">` : `<div class="source-placeholder" aria-hidden="true"></div>`}
      <div class="source-body">
        <span class="source-type">${source.type} · ${source.org}</span>
        <h3>${source.title}</h3>
        <p>${source.insight}</p>
        <span class="source-open">Open organized notes</span>
      </div>
    </article>
  `).join("");

  document.querySelector("#sourceQuickList").innerHTML = sources.map((source, index) => `
    <a class="source-quick-item" href="#" data-source-index="${index}">
      <span>${index + 1}</span>
      <div>
        <strong>${source.title}</strong>
        <small>${source.type} · ${source.org}</small>
      </div>
    </a>
  `).join("");
}

function openSourceDialog(index) {
  const source = sources[index];
  if (!source) return;
  const dialog = document.querySelector("#sourceDialog");
  const sections = [
    ["How to drive AI adoption", source.detail.drive],
    ["How not to do it", source.detail.avoid],
    ["Success", source.detail.success],
    ["Failures", source.detail.failures],
    ["Recommendations for Stripe role", source.detail.stripe],
  ];
  document.querySelector("#dialogMeta").textContent = `${source.type} · ${source.org}`;
  document.querySelector("#dialogTitle").textContent = source.title;
  document.querySelector("#dialogInsight").textContent = source.insight;
  document.querySelector("#dialogSourceLink").href = source.url;
  document.querySelector("#dialogContent").innerHTML = sections.map(([title, items]) => `
    <section class="dialog-section">
      <h3>${title}</h3>
      <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
    </section>
  `).join("");
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeSourceDialog() {
  const dialog = document.querySelector("#sourceDialog");
  if (dialog.open && typeof dialog.close === "function") {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }
}

function bindChrome() {
  document.querySelectorAll('.nav a[href^="#"], .brand[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "auto", block: "start" });
      history.replaceState(null, "", link.getAttribute("href"));
      document.querySelectorAll(".nav a").forEach((item) => item.classList.toggle("active", item === link));
    });
  });

  document.querySelectorAll(".tool").forEach((button) => {
    button.addEventListener("click", () => {
      persona = button.dataset.persona;
      document.querySelectorAll(".tool").forEach((item) => item.classList.toggle("active", item === button));
      updateState();
    });
  });

  document.querySelectorAll(".journey li").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".journey li").forEach((li) => li.classList.toggle("selected", li === item));
    });
  });

  document.querySelector("#jumpToPlay").addEventListener("click", () => {
    document.querySelector("#playbook").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.querySelector("#resetButton").addEventListener("click", () => {
    const defaults = { value: 3, trust: 2, skills: 3, workflow: 2, scale: 2, govern: 3 };
    dimensions.forEach((dim) => {
      dim.score = defaults[dim.id];
      dim.evidence = dim.id === "skills" ? "high" : dim.id === "scale" ? "low" : "med";
    });
    renderDimensions();
    updateState();
  });

  document.querySelectorAll("[data-source-index]").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      openSourceDialog(Number(item.dataset.sourceIndex));
    });
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSourceDialog(Number(item.dataset.sourceIndex));
      }
    });
  });

  document.querySelector("#closeSourceDialog").addEventListener("click", closeSourceDialog);
  document.querySelector("#closeSourceDialogFooter").addEventListener("click", closeSourceDialog);
  document.querySelector("#sourceDialog").addEventListener("click", (event) => {
    if (event.target.id === "sourceDialog") closeSourceDialog();
  });
}

renderDimensions();
renderCards();
bindChrome();
updateState();
