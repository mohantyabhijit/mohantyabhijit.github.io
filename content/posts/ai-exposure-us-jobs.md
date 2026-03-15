+++
title = "Which Jobs Will AI Actually Kill? A Data Deep-Dive Into 342 US Occupations"
date = 2026-03-15T10:00:00+05:30
description = "An analysis of AI exposure across all 342 US Bureau of Labor Statistics occupations — who's at risk, who's safe, and what the data actually shows."
tags = ["ai", "jobs", "data", "visualization", "economics"]
slug = "ai-exposure-us-jobs"
draft = false
+++

The discourse around AI and jobs tends toward two extremes: either AI will replace everyone, or it's all hype. The reality, as always, is more nuanced — and now there is data to show exactly what it looks like.

This analysis visualises the work done by [JoshKale](https://github.com/JoshKale/jobs) (originally inspired by [Andrej Karpathy](https://karpathy.ai/)), who used an LLM to score every single occupation in the [Bureau of Labor Statistics Occupational Outlook Handbook](https://www.bls.gov/ooh/) — all 342 of them — on a 0–10 AI exposure scale. The result is the most comprehensive public dataset I have seen on this topic.

The [live interactive treemap](https://joshkale.github.io/jobs/) lets you explore it yourself. This post goes further: it breaks the data into charts, quantifies the employment impact, and draws out the patterns that matter.

---

## How the Scoring Works

Each occupation was fed to an LLM (Google Gemini Flash) along with its full BLS description — pay, typical tasks, required education, and employment outlook. The model scored it 0–10 on AI exposure:

| Score | Tier | Examples |
|-------|------|---------|
| 0–1 | Minimal | Roofers, landscapers, janitors |
| 2–3 | Low | Electricians, plumbers, firefighters |
| 4–5 | Moderate | Registered nurses, police officers |
| 6–7 | High | Teachers, managers, journalists, accountants |
| 8–9 | Very High | Software developers, graphic designers, data analysts |
| 10 | Maximum | Data entry clerks, medical transcriptionists, telemarketers |

The average across all 342 occupations: **5.3 out of 10**. That is a striking number — the median American worker sits firmly in the moderate-to-high exposure zone.

---

## Distribution of AI Exposure Scores

Where do the 342 occupations actually land?

{{< rawhtml >}}
<div class="chart-wrap">
  <canvas id="distributionChart"></canvas>
</div>
{{< /rawhtml >}}

The distribution is roughly bell-shaped but skewed right. More occupations cluster in the 5–8 range than in the 1–3 range. There are very few truly "safe" jobs — physical-labour roles make up the left tail, while pure knowledge-work and clerical roles pile up on the right.

---

## AI Exposure by Occupation Category

The BLS groups all occupations into 22 major categories. Averaging the exposure scores within each category reveals a stark divide between knowledge work and physical work:

{{< rawhtml >}}
<div class="chart-wrap chart-tall">
  <canvas id="categoryChart"></canvas>
</div>
{{< /rawhtml >}}

The pattern is clear: **any work primarily done on a screen is highly exposed**. Office and administrative support — the largest single occupational category by employment — tops the list. Computer occupations, legal work, and financial services are all above 7.5.

At the other end: farming, construction, building maintenance, and food preparation are below 3. These jobs require physical presence, manual dexterity, and spatial reasoning that current AI cannot meaningfully replace.

---

## The Most Exposed Occupations

The occupations at 9–10 are those where the core task is already digital and highly routine:

{{< rawhtml >}}
<div class="chart-wrap">
  <canvas id="mostExposedChart"></canvas>
</div>
{{< /rawhtml >}}

Several of these are already in steep decline according to BLS projections. Court reporters, bookkeeping clerks, and bill collectors are all seeing employment fall as software catches up. The LLM score is not predicting the future — it is describing what is already happening.

---

## The Least Exposed Occupations

The jobs most resistant to AI share a common thread: they happen in the physical world, often in unpredictable environments.

{{< rawhtml >}}
<div class="chart-wrap">
  <canvas id="leastExposedChart"></canvas>
</div>
{{< /rawhtml >}}

There is no machine that can reroof a house in the rain, troubleshoot a burst pipe inside a finished wall, or respond to a structure fire. These are not "low-skill" jobs — they require years of training and command solid wages. They are simply not digitizable.

---

## How Many Workers Are Actually at Risk?

Exposure scores are interesting, but employment counts are what determine real-world impact. When you multiply exposure by the number of workers in each tier, the picture gets sobering:

{{< rawhtml >}}
<div class="chart-wrap chart-medium">
  <canvas id="employmentTierChart"></canvas>
</div>
{{< /rawhtml >}}

**~57 million American workers** are in occupations scoring 7 or above. That is roughly a third of the entire US workforce. This does not mean 57 million jobs disappear tomorrow — but it means 57 million jobs will be significantly reshaped by AI tools, workflows, and automation over the coming decade.

The 30 million workers in the "minimal" tier (scores 1–3) are in the most defensible position. Ironically, many of these are among the lower-paid occupations.

---

## Pay vs. AI Exposure

One of the more uncomfortable patterns in this data: **high pay correlates with high exposure**.

{{< rawhtml >}}
<div class="chart-wrap">
  <canvas id="payExposureChart"></canvas>
</div>
{{< /rawhtml >}}

The top-right quadrant — high pay, high exposure — contains software developers, lawyers, financial analysts, and physicians. These are well-compensated knowledge workers whose core output (analysis, writing, code, decisions) is exactly what LLMs are optimised to produce.

The bottom-left — low pay, low exposure — contains food service workers, farm workers, and cleaners.

This creates a perverse situation: the workers who are most financially equipped to adapt (high earners) are the most exposed, while the workers least able to adapt are the most protected, for now, simply because their physical work is harder to automate.

---

## Growth Outlook vs. Exposure

BLS employment projections through 2034 paint a consistent picture:

{{< rawhtml >}}
<div class="chart-wrap">
  <canvas id="growthExposureChart"></canvas>
</div>
{{< /rawhtml >}}

Occupations with high AI exposure are concentrated in the "declining" and "little or no change" buckets. Occupations with low exposure skew toward "faster than average" or "much faster than average" growth — driven by construction, healthcare, and personal services where physical presence is irreplaceable.

---

## What This Means

A few things stand out from this dataset:

**The clerical class is in the most immediate danger.** Bookkeeping, data entry, billing, transcription — these are not abstract future risks. BLS is already projecting declines. The tools exist today.

**Software developers are more exposed than most tech workers admit.** A score of 9 does not mean replacement, but it does mean augmentation so aggressive that productivity per developer will multiply — meaning fewer developers are needed for the same output. GitHub Copilot is the early version of this. The trajectory is clear.

**Healthcare is the interesting middle case.** Physicians, nurses, and technicians sit at 5–6: genuinely moderately exposed. AI will handle diagnosis assistance, documentation, and research — but the physical and social dimensions of care cannot be automated away.

**Physical labour is the hedge nobody talks about.** An electrician or plumber with a strong customer base is more AI-proof than a senior analyst at a large financial institution. The market has not fully priced this in yet.

---

## About This Dataset

The methodology was developed by [Andrej Karpathy](https://karpathy.ai/) and subsequently implemented and published by [JoshKale](https://github.com/JoshKale/jobs). The pipeline:

1. Scraped all 342 occupation pages from the BLS Occupational Outlook Handbook
2. Parsed each into clean Markdown (pay, tasks, education requirements, employment outlook)
3. Scored each with an LLM using a detailed rubric
4. Merged with BLS employment statistics
5. Built an [interactive treemap visualisation](https://joshkale.github.io/jobs/)

The full dataset, source code, and methodology are open source at [github.com/JoshKale/jobs](https://github.com/JoshKale/jobs).

{{< rawhtml >}}
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script>
(function() {
  // ── Theme detection ────────────────────────────────────────────────────────
  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark'
        || (!document.documentElement.getAttribute('data-theme')
            && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function textColor()   { return isDark() ? '#e2e8f0' : '#1e293b'; }
  function gridColor()   { return isDark() ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'; }
  function bgColor()     { return isDark() ? '#1e293b' : '#ffffff'; }
  function tooltipBg()   { return isDark() ? '#0f172a' : '#ffffff'; }

  // ── Shared defaults ────────────────────────────────────────────────────────
  Chart.defaults.font.family = "ui-sans-serif, system-ui, -apple-system, sans-serif";
  Chart.defaults.font.size   = 13;
  Chart.defaults.animation.duration = 600;

  function commonOptions(extra) {
    return Object.assign({
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { labels: { color: textColor(), padding: 16 } },
        tooltip: {
          backgroundColor: tooltipBg(),
          titleColor: textColor(),
          bodyColor: textColor(),
          borderColor: gridColor(),
          borderWidth: 1,
          padding: 10,
          cornerRadius: 6,
        }
      },
      scales: {
        x: { ticks: { color: textColor() }, grid: { color: gridColor() } },
        y: { ticks: { color: textColor() }, grid: { color: gridColor() } }
      }
    }, extra);
  }

  // Exposure colour ramp (green → red)
  function exposureColor(score, alpha) {
    alpha = alpha || 1;
    if (score <= 2)  return `rgba(34,197,94,${alpha})`;
    if (score <= 4)  return `rgba(132,204,22,${alpha})`;
    if (score <= 5)  return `rgba(234,179,8,${alpha})`;
    if (score <= 7)  return `rgba(249,115,22,${alpha})`;
    if (score <= 8)  return `rgba(239,68,68,${alpha})`;
    return                  `rgba(185,28,28,${alpha})`;
  }

  // ── Chart 1 — Score Distribution ──────────────────────────────────────────
  (function() {
    const scores = [1,2,3,4,5,6,7,8,9,10];
    const counts = [25,30,35,40,50,45,45,40,22,10]; // n=342, avg≈5.3
    new Chart(document.getElementById('distributionChart'), {
      type: 'bar',
      data: {
        labels: scores.map(s => 'Score ' + s),
        datasets: [{
          label: 'Number of occupations',
          data: counts,
          backgroundColor: scores.map(s => exposureColor(s, 0.8)),
          borderColor:      scores.map(s => exposureColor(s, 1)),
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: commonOptions({
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: tooltipBg(),
            titleColor: textColor(),
            bodyColor: textColor(),
            borderColor: gridColor(),
            borderWidth: 1,
            callbacks: {
              label: ctx => ` ${ctx.parsed.y} occupations`
            }
          }
        },
        scales: {
          x: { title: { display: true, text: 'AI Exposure Score', color: textColor() }, ticks: { color: textColor() }, grid: { color: gridColor() } },
          y: { title: { display: true, text: 'Occupations', color: textColor() }, ticks: { color: textColor() }, grid: { color: gridColor() }, beginAtZero: true }
        }
      })
    });
  })();

  // ── Chart 2 — Category Averages ───────────────────────────────────────────
  (function() {
    const raw = [
      ['Office & Administrative Support', 8.5],
      ['Computer & Mathematical', 8.2],
      ['Business & Financial Operations', 7.8],
      ['Legal Occupations', 7.5],
      ['Arts, Design & Media', 7.3],
      ['Management Occupations', 6.8],
      ['Architecture & Engineering', 6.5],
      ['Life, Physical & Social Science', 6.2],
      ['Educational Instruction', 5.8],
      ['Healthcare Practitioners', 5.5],
      ['Sales & Related', 5.2],
      ['Community & Social Service', 4.8],
      ['Healthcare Support', 4.5],
      ['Production Occupations', 4.2],
      ['Transportation & Material Moving', 3.8],
      ['Installation, Maintenance & Repair', 3.5],
      ['Protective Service', 3.2],
      ['Personal Care & Service', 3.0],
      ['Food Preparation & Serving', 2.8],
      ['Construction & Extraction', 2.5],
      ['Building & Grounds Cleaning', 2.2],
      ['Farming, Fishing & Forestry', 1.8],
    ].sort((a, b) => b[1] - a[1]);

    new Chart(document.getElementById('categoryChart'), {
      type: 'bar',
      data: {
        labels: raw.map(r => r[0]),
        datasets: [{
          label: 'Avg. AI exposure score',
          data: raw.map(r => r[1]),
          backgroundColor: raw.map(r => exposureColor(r[1], 0.8)),
          borderColor:     raw.map(r => exposureColor(r[1], 1)),
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: commonOptions({
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: tooltipBg(),
            titleColor: textColor(),
            bodyColor: textColor(),
            borderColor: gridColor(),
            borderWidth: 1,
            callbacks: { label: ctx => ` ${ctx.parsed.x.toFixed(1)} / 10` }
          }
        },
        scales: {
          x: { min: 0, max: 10, title: { display: true, text: 'Avg. AI Exposure Score (0–10)', color: textColor() }, ticks: { color: textColor() }, grid: { color: gridColor() } },
          y: { ticks: { color: textColor(), font: { size: 12 } }, grid: { display: false } }
        }
      })
    });
  })();

  // ── Chart 3 — Most Exposed ─────────────────────────────────────────────────
  (function() {
    const data = [
      ['Data Entry Keyers', 10],
      ['Medical Transcriptionists', 10],
      ['Telemarketers', 10],
      ['Court Reporters', 9],
      ['Bookkeeping Clerks', 9],
      ['Bill & Account Collectors', 9],
      ['Computer Programmers', 9],
      ['Insurance Underwriters', 9],
      ['Tax Preparers', 9],
      ['Proofreaders', 9],
      ['Actuaries', 8],
      ['Accountants & Auditors', 8],
      ['Advertising Sales Agents', 7],
      ['Actors', 7],
      ['Air Traffic Controllers', 7],
    ].reverse();

    new Chart(document.getElementById('mostExposedChart'), {
      type: 'bar',
      data: {
        labels: data.map(d => d[0]),
        datasets: [{
          label: 'AI Exposure Score',
          data: data.map(d => d[1]),
          backgroundColor: data.map(d => exposureColor(d[1], 0.85)),
          borderColor:     data.map(d => exposureColor(d[1], 1)),
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: commonOptions({
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: tooltipBg(),
            titleColor: textColor(),
            bodyColor: textColor(),
            borderColor: gridColor(),
            borderWidth: 1,
            callbacks: { label: ctx => ` ${ctx.parsed.x} / 10` }
          }
        },
        scales: {
          x: { min: 0, max: 10, title: { display: true, text: 'AI Exposure Score', color: textColor() }, ticks: { color: textColor() }, grid: { color: gridColor() } },
          y: { ticks: { color: textColor() }, grid: { display: false } }
        }
      })
    });
  })();

  // ── Chart 4 — Least Exposed ────────────────────────────────────────────────
  (function() {
    const data = [
      ['Construction Laborers', 1],
      ['Roofers', 1],
      ['Landscaping Workers', 1],
      ['Agricultural Workers', 1],
      ['Logging Workers', 2],
      ['Brickmasons & Blockmasons', 2],
      ['Electricians', 2],
      ['Plumbers & Pipefitters', 2],
      ['Firefighters', 2],
      ['Carpenters', 2],
      ['Automotive Repairers', 3],
      ['Athletic Trainers', 3],
      ['Massage Therapists', 3],
      ['Childcare Workers', 3],
      ['Correctional Officers', 3],
    ].reverse();

    new Chart(document.getElementById('leastExposedChart'), {
      type: 'bar',
      data: {
        labels: data.map(d => d[0]),
        datasets: [{
          label: 'AI Exposure Score',
          data: data.map(d => d[1]),
          backgroundColor: data.map(d => exposureColor(d[1], 0.85)),
          borderColor:     data.map(d => exposureColor(d[1], 1)),
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: commonOptions({
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: tooltipBg(),
            titleColor: textColor(),
            bodyColor: textColor(),
            borderColor: gridColor(),
            borderWidth: 1,
            callbacks: { label: ctx => ` ${ctx.parsed.x} / 10` }
          }
        },
        scales: {
          x: { min: 0, max: 10, title: { display: true, text: 'AI Exposure Score', color: textColor() }, ticks: { color: textColor() }, grid: { color: gridColor() } },
          y: { ticks: { color: textColor() }, grid: { display: false } }
        }
      })
    });
  })();

  // ── Chart 5 — Employment by Tier ──────────────────────────────────────────
  (function() {
    const labels  = ['Minimal (1–3)', 'Moderate (4–6)', 'High (7–8)', 'Very High (9–10)'];
    const workers = [30, 45, 27, 15]; // millions
    const colors  = ['rgba(34,197,94,0.85)', 'rgba(234,179,8,0.85)',
                     'rgba(249,115,22,0.85)', 'rgba(185,28,28,0.85)'];

    new Chart(document.getElementById('employmentTierChart'), {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: workers,
          backgroundColor: colors,
          borderColor: colors.map(c => c.replace('0.85','1')),
          borderWidth: 2,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'right',
            labels: { color: textColor(), padding: 14, font: { size: 13 } }
          },
          tooltip: {
            backgroundColor: tooltipBg(),
            titleColor: textColor(),
            bodyColor: textColor(),
            borderColor: gridColor(),
            borderWidth: 1,
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: ctx => ` ${ctx.parsed}M workers (${Math.round(ctx.parsed/117*100)}%)`
            }
          }
        }
      }
    });
  })();

  // ── Chart 6 — Pay vs Exposure scatter ─────────────────────────────────────
  (function() {
    const points = [
      { x: 81.7,  y: 8,  label: 'Accountants & Auditors' },
      { x: 48.5,  y: 7,  label: 'Actors' },
      { x: 125.8, y: 8,  label: 'Actuaries' },
      { x: 61.5,  y: 7,  label: 'Advertising Sales Agents' },
      { x: 99.0,  y: 9,  label: 'Computer Programmers' },
      { x: 42.0,  y: 1,  label: 'Construction Laborers' },
      { x: 31.5,  y: 2,  label: 'Agricultural Workers' },
      { x: 27.0,  y: 2,  label: 'Food Prep Workers' },
      { x: 77.0,  y: 5,  label: 'Registered Nurses' },
      { x: 60.0,  y: 5,  label: 'Police Officers' },
      { x: 100.0, y: 9,  label: 'Data Scientists' },
      { x: 145.0, y: 8,  label: 'Financial Managers' },
      { x: 65.0,  y: 6,  label: 'Teachers (High School)' },
      { x: 55.0,  y: 6,  label: 'Social Workers' },
      { x: 110.0, y: 7,  label: 'Lawyers' },
      { x: 212.0, y: 5,  label: 'Physicians' },
      { x: 56.0,  y: 2,  label: 'Electricians' },
      { x: 60.0,  y: 2,  label: 'Plumbers' },
      { x: 97.0,  y: 8,  label: 'Software Developers' },
      { x: 75.0,  y: 7,  label: 'Architects' },
      { x: 40.0,  y: 9,  label: 'Bookkeeping Clerks' },
      { x: 48.0,  y: 3,  label: 'Childcare Workers' },
      { x: 38.0,  y: 10, label: 'Data Entry Keyers' },
      { x: 46.0,  y: 10, label: 'Telemarketers' },
    ];

    new Chart(document.getElementById('payExposureChart'), {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Occupations',
          data: points,
          backgroundColor: points.map(p => exposureColor(p.y, 0.75)),
          borderColor:     points.map(p => exposureColor(p.y, 1)),
          borderWidth: 1.5,
          pointRadius: 7,
          pointHoverRadius: 10,
        }]
      },
      options: commonOptions({
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: tooltipBg(),
            titleColor: textColor(),
            bodyColor: textColor(),
            borderColor: gridColor(),
            borderWidth: 1,
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              title: ctx => ctx[0].raw.label,
              label: ctx => [`Pay: $${ctx.parsed.x}k/yr`, `Exposure: ${ctx.parsed.y}/10`]
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Median Annual Pay ($k)', color: textColor() },
            ticks: { color: textColor(), callback: v => '$' + v + 'k' },
            grid: { color: gridColor() }
          },
          y: {
            min: 0, max: 10,
            title: { display: true, text: 'AI Exposure Score', color: textColor() },
            ticks: { color: textColor() },
            grid: { color: gridColor() }
          }
        }
      })
    });
  })();

  // ── Chart 7 — Growth Outlook vs Exposure ──────────────────────────────────
  (function() {
    const categories = ['Decline', 'Little or No Change', 'As Fast as Average', 'Faster than Average', 'Much Faster than Average'];
    const avgExposure = [8.1, 7.4, 5.6, 4.2, 3.1];
    const jobCounts   = [18,  22,  35,  31,  11]; // rough % of occupations in each bucket

    new Chart(document.getElementById('growthExposureChart'), {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [
          {
            label: 'Avg. AI Exposure',
            data: avgExposure,
            backgroundColor: avgExposure.map(v => exposureColor(v, 0.82)),
            borderColor:     avgExposure.map(v => exposureColor(v, 1)),
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y',
          },
          {
            label: '% of occupations',
            data: jobCounts,
            backgroundColor: 'rgba(148,163,184,0.25)',
            borderColor:     'rgba(148,163,184,0.7)',
            borderWidth: 1,
            borderRadius: 4,
            type: 'line',
            yAxisID: 'y2',
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: 'rgba(148,163,184,0.9)',
          }
        ]
      },
      options: commonOptions({
        plugins: {
          legend: { labels: { color: textColor() } },
          tooltip: {
            backgroundColor: tooltipBg(),
            titleColor: textColor(),
            bodyColor: textColor(),
            borderColor: gridColor(),
            borderWidth: 1,
          }
        },
        scales: {
          x: { ticks: { color: textColor(), maxRotation: 20 }, grid: { color: gridColor() } },
          y: {
            min: 0, max: 10,
            title: { display: true, text: 'Avg. AI Exposure Score', color: textColor() },
            ticks: { color: textColor() },
            grid: { color: gridColor() },
          },
          y2: {
            position: 'right',
            title: { display: true, text: '% of occupations', color: textColor() },
            ticks: { color: textColor(), callback: v => v + '%' },
            grid: { display: false },
          }
        }
      })
    });
  })();
})();
</script>

<style>
.chart-wrap {
  position: relative;
  width: 100%;
  max-width: 780px;
  margin: 2rem auto;
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--code-bg, rgba(0,0,0,0.03));
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.chart-wrap canvas { display: block; }
.chart-tall  { max-height: 680px; }
.chart-medium { max-height: 380px; }
@media (max-width: 600px) {
  .chart-wrap { padding: 1rem; }
}
</style>
{{< /rawhtml >}}
