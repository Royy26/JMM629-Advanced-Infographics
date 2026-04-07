/* =====================================================
   SECOND DRAFT — script.js
   Scroll-driven narrative · D3 v7 · Scrollama v3.2
   JMM629 Advanced Infographics · Sijie Huang · 2026
   ===================================================== */

// ─── SHARED TOOLTIP ─────────────────────────────────────
const tooltip = d3.select("#tooltip");

function showTip(event, html) {
  tooltip
    .html(html)
    .style("opacity", 1)
    .style("left", `${event.clientX + 16}px`)
    .style("top",  `${event.clientY - 32}px`);
}
function hideTip() { tooltip.style("opacity", 0); }


// ─── DATA ────────────────────────────────────────────────

const animeData = [
  { year: 2000, total: 35, charted: 16, not_charted: 19 },
  { year: 2001, total: 38, charted: 18, not_charted: 20 },
  { year: 2002, total: 41, charted: 19, not_charted: 22 },
  { year: 2003, total: 44, charted: 20, not_charted: 24 },
  { year: 2004, total: 47, charted: 22, not_charted: 25 },
  { year: 2005, total: 48, charted: 22, not_charted: 26 },
  { year: 2006, total: 51, charted: 24, not_charted: 27 },
  { year: 2007, total: 55, charted: 25, not_charted: 30 },
  { year: 2008, total: 57, charted: 26, not_charted: 31 },
  { year: 2009, total: 56, charted: 26, not_charted: 30 },
  { year: 2010, total: 55, charted: 25, not_charted: 30 },
  { year: 2011, total: 57, charted: 26, not_charted: 31 },
  { year: 2012, total: 59, charted: 27, not_charted: 32 },
  { year: 2013, total: 61, charted: 28, not_charted: 33 },
  { year: 2014, total: 63, charted: 29, not_charted: 34 },
  { year: 2015, total: 63, charted: 29, not_charted: 34 },
  { year: 2016, total: 61, charted: 28, not_charted: 33 },
  { year: 2017, total: 61, charted: 28, not_charted: 33 },
  { year: 2018, total: 61, charted: 28, not_charted: 33 },
  { year: 2019, total: 61, charted: 27, not_charted: 34 },
  { year: 2020, total: 56, charted: 26, not_charted: 30 },
  { year: 2021, total: 60, charted: 27, not_charted: 33 },
  { year: 2022, total: 62, charted: 28, not_charted: 34 },
  { year: 2023, total: 61, charted: 27, not_charted: 34 },
  { year: 2024, total: 57, charted: 26, not_charted: 31 },
  { year: 2025, total: 33, charted: 15, not_charted: 18 }
];

const modelData = [
  { combination: "C",       abbr: "C",       ap: 0.1450, description: "Cast/studio reputation alone is weak — many actors are sparse graph nodes with few connections." },
  { combination: "T",       abbr: "T",       ap: 0.3020, description: "Synopsis text via JINA-CLIP-v2. Limited by English-centric pretraining on Japanese text." },
  { combination: "I",       abbr: "I",       ap: 0.3493, description: "Poster features via CLIP. Captures art style and color palette, but not enough on its own." },
  { combination: "M",       abbr: "M",       ap: 0.5821, description: "Metadata: release year, studio, genre, broadcast slot. Strongest single source by far." },
  { combination: "M+I",     abbr: "M+I",     ap: 0.6094, description: "Metadata + Image. Temporal context pairs powerfully with visual identity signal." },
  { combination: "M+T+I+C", abbr: "M+T+I+C", ap: 0.6519, description: "All four combined. Adding Text HURTS vs M+I+C — noisy embeddings dilute the signal." },
  { combination: "M+I+C ★", abbr: "M+I+C",   ap: 0.6664, description: "BEST: Metadata + Image + Cast/Production. Cast/Production disambiguates promising M+I cases with production track records." }
];

const heatmapData = [
  { key: "M+M", ap: 0.5821 },
  { key: "I+I", ap: 0.3493 },
  { key: "T+T", ap: 0.3020 },
  { key: "C+C", ap: 0.1450 },
  { key: "I+M", ap: 0.6094 },
  { key: "M+T", ap: 0.5350 },
  { key: "C+M", ap: 0.5620 },
  { key: "I+T", ap: 0.3670 },
  { key: "C+I", ap: 0.3312 },
  { key: "C+T", ap: 0.3464 }
];


// ─── SHARED HELPER ───────────────────────────────────────
function makeSvg(selector, outerH, margin, minW) {
  const node = document.querySelector(selector);
  if (!node) return null;
  const outerW = Math.max(node.clientWidth || 400, minW || 280);
  const W = outerW - margin.left - margin.right;
  const H = outerH - margin.top - margin.bottom;
  const svg = d3.select(selector).append("svg")
    .attr("width", outerW).attr("height", outerH)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  return { svg, W, H };
}


// ─── TIMELINE CHART ──────────────────────────────────────
// Stored ref so Scrollama steps can manipulate bars via classes
let timelineSvg, timelineX, timelineBars, timelineData;

function drawTimelineChart() {
  const container = document.querySelector("#timeline-chart");
  if (!container) return;

  const margin = { top: 24, right: 28, bottom: 42, left: 44 };
  const outerW  = Math.max(container.clientWidth || 500, 400);
  const outerH  = 280;
  const W = outerW - margin.left - margin.right;
  const H = outerH - margin.top - margin.bottom;

  timelineData = animeData.map(d => ({ ...d, pct: d.charted / d.total }));

  const svg = d3.select("#timeline-chart").append("svg")
    .attr("width", outerW).attr("height", outerH)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  timelineSvg = svg;

  const x = d3.scaleBand()
    .domain(timelineData.map(d => d.year))
    .range([0, W]).padding(0.1);

  timelineX = x;

  const y = d3.scaleLinear()
    .domain([0, d3.max(timelineData, d => d.total) * 1.1])
    .range([H, 0]);

  const yLine = d3.scaleLinear()
    .domain([0.35, 0.60]).range([H, 0]);

  const stack = d3.stack().keys(["charted", "not_charted"])(timelineData);

  // X axis — only 5-year ticks to avoid crowding
  svg.append("g").attr("class", "axis")
    .attr("transform", `translate(0,${H})`)
    .call(d3.axisBottom(x)
      .tickValues(timelineData.filter(d => d.year % 5 === 0).map(d => d.year))
      .tickSize(4));

  // Y axis
  svg.append("g").attr("class", "axis")
    .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("d")));

  // Stacked bars — kept as a flat selection grouped by year
  const layers = svg.selectAll(".layer")
    .data(stack).join("g")
    .attr("class", d => `layer layer-${d.key}`)
    .attr("fill", d => d.key === "charted" ? "#f97316" : "#475569");

  timelineBars = layers.selectAll("rect")
    .data(d => d).join("rect")
    .attr("class", d => `bar bar-y${d.data.year}`)
    .attr("x",      d => x(d.data.year))
    .attr("width",  x.bandwidth())
    .attr("y",      d => y(d[1]))
    .attr("height", d => Math.max(0, y(d[0]) - y(d[1])))
    .attr("rx", 2)
    .on("mousemove", (ev, d) => showTip(ev,
      `<strong>${d.data.year}</strong>` +
      `Charted: ${d.data.charted}<br>` +
      `Not charted: ${d.data.not_charted}<br>` +
      `Rate: ${(d.data.pct * 100).toFixed(1)}%`))
    .on("mouseleave", hideTip);

  // Charted-rate line
  svg.append("path")
    .datum(timelineData)
    .attr("fill", "none")
    .attr("stroke", "#f97316")
    .attr("stroke-width", 2)
    .attr("opacity", 0.7)
    .attr("d", d3.line()
      .x(d => x(d.year) + x.bandwidth() / 2)
      .y(d => yLine(d.pct))
      .curve(d3.curveCatmullRom));

  // "Peak" annotation
  const peakYear = 2014;
  const px = x(peakYear) + x.bandwidth() / 2;
  svg.append("text")
    .attr("x", px).attr("y", y(timelineData.find(d => d.year === peakYear).total) - 7)
    .attr("text-anchor", "middle")
    .style("font-size", "10px")
    .style("fill", "#f97316")
    .style("font-weight", "700")
    .text("Peak →");
}

// Apply Scrollama highlight by year range
function highlightYears(yearStart, yearEnd) {
  // Fade all bars then brighten target range
  d3.selectAll("#timeline-chart .bar")
    .transition().duration(350)
    .style("opacity", d => {
      if (yearStart === null) return 1; // step 0 = show all
      return (d.data.year >= yearStart && d.data.year <= yearEnd) ? 1 : 0.18;
    });
}


// ─── ABLATION BAR CHART ──────────────────────────────────
let ablationBars;   // exposed for heatmap linking

function drawAblationChart() {
  const data = [...modelData].sort((a, b) => a.ap - b.ap);
  const margin = { top: 14, right: 70, bottom: 36, left: 120 };
  const res = makeSvg("#ablation-chart", 300, margin, 320);
  if (!res) return;
  const { svg, W, H } = res;

  const x = d3.scaleLinear().domain([0, 0.74]).range([0, W]);
  const y = d3.scaleBand().domain(data.map(d => d.combination)).range([H, 0]).padding(0.22);

  svg.append("g").attr("class", "axis")
    .call(d3.axisLeft(y).tickSize(0).tickFormat(d => {
      // Plain-language labels
      const map = {
        "C":       "C/P — Cast/Prod.",
        "T":       "Text only",
        "I":       "Image only",
        "M":       "Metadata only",
        "M+I":     "Meta + Image",
        "M+T+I+C": "All four",
        "M+I+C ★": "Meta + Image + Cast/Prod ★"
      };
      return map[d] || d;
    }));

  svg.append("g").attr("class", "axis")
    .attr("transform", `translate(0,${H})`)
    .call(d3.axisBottom(x).ticks(4).tickFormat(d3.format(".2f")));

  // Grid lines
  svg.selectAll(".grid-line")
    .data(x.ticks(4)).join("line")
    .attr("class", "grid-line")
    .attr("x1", d => x(d)).attr("x2", d => x(d))
    .attr("y1", 0).attr("y2", H)
    .attr("stroke", "rgba(255,255,255,0.05)")
    .attr("stroke-dasharray", "3,3");

  ablationBars = svg.selectAll(".abl-bar")
    .data(data).join("rect")
    .attr("class", d => `abl-bar abl-bar-${d.abbr.replace(/\+/g,"-")}`)
    .attr("x", 0)
    .attr("y", d => y(d.combination))
    .attr("width",  d => x(d.ap))
    .attr("height", y.bandwidth())
    .attr("rx", 5)
    .attr("fill", d => {
      if (d.combination.includes("★")) return "#f97316";
      if (d.combination.startsWith("M")) return "#4ade80";
      return "#64748b";
    })
    .on("mousemove", (ev, d) => showTip(ev,
      `<strong>${d.combination}</strong>${d.description}<br>` +
      `<span style="color:#f97316">AP: ${d.ap.toFixed(4)}</span>`))
    .on("mouseleave", hideTip);

  // AP value labels to the right of each bar
  svg.selectAll(".abl-val")
    .data(data).join("text")
    .attr("class", "abl-val")
    .attr("x", d => x(d.ap) + 7)
    .attr("y", d => y(d.combination) + y.bandwidth() / 2 + 4.5)
    .style("font-size", "11px")
    .style("fill", "#8899aa")
    .text(d => d.ap.toFixed(3));

  // Persistent "BEST" annotation on top bar
  const best = data[data.length - 1];
  svg.append("text")
    .attr("x", x(best.ap) + 6)
    .attr("y", y(best.combination) - 6)
    .style("font-size", "10px")
    .style("fill", "#f97316")
    .style("font-weight", "700")
    .text("◀ BEST");
}

// Called by heatmap cell click: highlight bars that contain chosen modalities
function linkAblationToModalities(selectedMods) {
  if (!ablationBars) return;
  ablationBars.transition().duration(300)
    .style("opacity", d => {
      if (!selectedMods || selectedMods.length === 0) return 1;
      const matches = selectedMods.every(m => d.abbr.includes(m));
      return matches ? 1 : 0.18;
    });
  // Reset value label opacity to match
  d3.selectAll(".abl-val").transition().duration(300)
    .style("opacity", d => {
      if (!selectedMods || selectedMods.length === 0) return 1;
      return selectedMods.every(m => d.abbr.includes(m)) ? 1 : 0.18;
    });
}


// ─── HEATMAP CHART ───────────────────────────────────────
const mods   = ["M", "I", "T", "C"];
const modNames = { M: "Metadata", I: "Image", T: "Text", C: "Cast/Production" };
const hmLookup = Object.fromEntries(heatmapData.map(d => [d.key, d.ap]));

let heatmapCells;  // for Scrollama step highlighting
let selectedHeatmapMods = [];

function drawHeatmapChart() {
  const container = document.getElementById("heatmap-chart");
  if (!container) return;

  const margin = { top: 50, right: 16, bottom: 16, left: 58 };
  const containerW = Math.min(Math.max(container.clientWidth || 380, 280), 440);
  const cell = Math.floor((containerW - margin.left - margin.right) / 4);
  const svgH  = cell * 4 + margin.top + margin.bottom;

  const svg = d3.select("#heatmap-chart").append("svg")
    .attr("width", containerW).attr("height", svgH)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const color = d3.scaleSequential()
    .domain([0.1, 0.70])
    .interpolator(d3.interpolateRgb("#1e2d3d", "#f97316"));

  heatmapCells = [];

  mods.forEach((row, r) => {
    mods.forEach((col, c) => {
      const key   = [row, col].sort().join("+");
      const value = hmLookup[key] ?? 0.1;
      const isDiag = row === col;

      const cellG = svg.append("g")
        .attr("class", `hm-cell hm-row-${row} hm-col-${col}`)
        .style("cursor", "pointer");

      cellG.append("rect")
        .attr("x", c * cell + 3).attr("y", r * cell + 3)
        .attr("width", cell - 6).attr("height", cell - 6)
        .attr("rx", 5)
        .attr("fill", color(value))
        .attr("stroke", isDiag ? "#f97316" : "none")
        .attr("stroke-width", isDiag ? 2 : 0);

      cellG.append("text")
        .attr("x", c * cell + cell / 2)
        .attr("y", r * cell + cell / 2 + 5)
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .style("font-weight", "700")
        .style("fill", value > 0.42 ? "#fff" : "#8899aa")
        .text(value.toFixed(3));

      // Click to link with ablation chart
      cellG.on("click", () => {
        const clickedMods = [row, col];
        if (selectedHeatmapMods.length > 0 &&
            clickedMods[0] === selectedHeatmapMods[0] &&
            clickedMods[1] === selectedHeatmapMods[1]) {
          // Deselect
          selectedHeatmapMods = [];
          linkAblationToModalities([]);
          d3.selectAll(".hm-cell rect").transition().duration(250).style("opacity", 1);
        } else {
          selectedHeatmapMods = clickedMods;
          linkAblationToModalities(clickedMods);
          // Dim other cells
          d3.selectAll(".hm-cell").transition().duration(250).style("opacity", 0.3);
          cellG.transition().duration(250).style("opacity", 1);
        }
      });

      cellG.on("mousemove", ev => showTip(ev,
        `<strong>${modNames[row]} + ${modNames[col]}</strong>` +
        `AP: ${value.toFixed(4)}<br>` +
        `<span style="color:#8899aa;font-size:11px">Click to highlight in ablation chart</span>`))
        .on("mouseleave", hideTip);

      heatmapCells.push({ row, col, cell: cellG, value });
    });

    // Row labels
    svg.append("text")
      .attr("x", -8).attr("y", r * cell + cell / 2 + 5)
      .attr("text-anchor", "end")
      .style("font-size", "12px").style("fill", "#8899aa").style("font-weight", "600")
      .text(mods[r] === "C" ? "C/P" : mods[r]);

    // Col labels (top)
    svg.append("text")
      .attr("x", r * cell + cell / 2).attr("y", -12)
      .attr("text-anchor", "middle")
      .style("font-size", "12px").style("fill", "#8899aa").style("font-weight", "600")
      .text(mods[r] === "C" ? "C/P" : mods[r]);
  });
}

// Called by heatmap Scrollama steps
function applyHeatmapStep(step) {
  if (!heatmapCells) return;
  d3.selectAll(".hm-cell").transition().duration(400).style("opacity", 1);

  if (step === 1) {
    // Highlight the M row/col
    d3.selectAll(".hm-cell").transition().duration(400).style("opacity", 0.2);
    d3.selectAll(".hm-row-M, .hm-col-M").transition().duration(400).style("opacity", 1);
  } else if (step === 2) {
    // Highlight T+C cell, dim rest
    d3.selectAll(".hm-cell").transition().duration(400).style("opacity", 0.2);
    d3.select(".hm-row-T.hm-col-C, .hm-row-C.hm-col-T").transition().duration(400).style("opacity", 1);
  }
}


// ─── TAKEAWAY SCROLL ANIMATION ───────────────────────────
function initTakeawayObserver() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("visible");
    }),
    { threshold: 0.25 }
  );
  document.querySelectorAll(".tw-item").forEach(el => observer.observe(el));
}


// ─── SCROLLAMA — TIMELINE ────────────────────────────────
function initTimelineScrollama() {
  const scroller = scrollama();
  scroller.setup({
    step:   "#timeline-steps .step",
    offset: 0.55,
    debug:  false
  })
  .onStepEnter(({ element }) => {
    document.querySelectorAll("#timeline-steps .step").forEach(s => s.classList.remove("is-active"));
    element.classList.add("is-active");

    const stepIndex = parseInt(element.dataset.step);
    // Update sticky panel heading
    const headings = [
      "25 Years of Anime Production",
      "The Expansion Years: 2006–2010",
      "Peak Anime Era: 2014–2015",
      "Stable Structure: 2020–2025"
    ];
    const heading = document.getElementById("timeline-heading");
    if (heading) heading.textContent = headings[stepIndex] || headings[0];

    // Highlight year ranges on chart
    const ranges = [null, [2006, 2010], [2014, 2015], [2020, 2025]];
    const r = ranges[stepIndex];
    highlightYears(r ? r[0] : null, r ? r[1] : null);
  })
  .onStepExit(({ element, direction }) => {
    // Reset when fully exiting (scrolling back up past step 0)
    if (direction === "up" && parseInt(element.dataset.step) === 0) {
      highlightYears(null, null);
    }
  });
}


// ─── SCROLLAMA — HEATMAP ─────────────────────────────────
function initHeatmapScrollama() {
  const scroller = scrollama();
  scroller.setup({
    step:   "#heatmap-steps .step",
    offset: 0.55,
    debug:  false
  })
  .onStepEnter(({ element }) => {
    document.querySelectorAll("#heatmap-steps .step").forEach(s => s.classList.remove("is-active"));
    element.classList.add("is-active");

    const stepIndex = parseInt(element.dataset.step);
    applyHeatmapStep(stepIndex);
  })
  .onStepExit(({ element, direction }) => {
    if (direction === "up" && parseInt(element.dataset.step) === 0) {
      applyHeatmapStep(0);
    }
  });
}


// ─── INIT ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  drawTimelineChart();
  drawAblationChart();
  drawHeatmapChart();
  initTakeawayObserver();

  // Scrollama needs a small delay after DOM is ready
  setTimeout(() => {
    initTimelineScrollama();
    initHeatmapScrollama();
  }, 200);
});
