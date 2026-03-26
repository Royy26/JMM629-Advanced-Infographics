const tooltip = d3.select("#tooltip");

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
  { combination: "C (Cast only)", ap: 0.1509, description: "Cast and studio information alone is weak." },
  { combination: "T (Text only)", ap: 0.3521, description: "Synopsis text helps a little, but not much." },
  { combination: "I (Image only)", ap: 0.3445, description: "Poster image alone is not enough." },
  { combination: "M (Metadata only)", ap: 0.6122, description: "Metadata is the strongest single source." },
  { combination: "M + I", ap: 0.6455, description: "Metadata plus image is a strong baseline." },
  { combination: "M + T + I + C", ap: 0.6430, description: "Adding text does not improve the best combination." },
  { combination: "M + I + C (Best ★)", ap: 0.6627, description: "Best result in the experiment." }
];

const heatmapData = [
  { key: "M+M", ap: 0.6122 },
  { key: "I+I", ap: 0.3445 },
  { key: "T+T", ap: 0.3521 },
  { key: "C+C", ap: 0.1509 },
  { key: "I+M", ap: 0.6455 },
  { key: "M+T", ap: 0.5820 },
  { key: "C+M", ap: 0.5987 },
  { key: "I+T", ap: 0.3888 },
  { key: "C+I", ap: 0.3519 },
  { key: "C+T", ap: 0.3464 }
];

function showTooltip(event, html) {
  tooltip
    .html(html)
    .style("opacity", 1)
    .style("left", `${event.clientX + 14}px`)
    .style("top", `${event.clientY - 28}px`);
}

function hideTooltip() {
  tooltip.style("opacity", 0);
}

document.addEventListener("mousemove", function(event) {
  const tip = document.getElementById("tooltip");
  if (parseFloat(tip.style.opacity || 0) <= 0) return;
  const rect = tip.getBoundingClientRect();
  if (event.clientX + 18 + rect.width > window.innerWidth) {
    tip.style.left = `${event.clientX - rect.width - 8}px`;
  }
});

function makeSvg(selector, outerHeight, margin, minWidth) {
  const outerWidth = Math.max(document.querySelector(selector).clientWidth, minWidth || 280);
  const width = outerWidth - margin.left - margin.right;
  const height = outerHeight - margin.top - margin.bottom;
  const svg = d3.select(selector).append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  return { svg, width, height };
}

function cleanLabel(label) {
  return label
    .replace(" (Metadata only)", "")
    .replace(" (Image only)", "")
    .replace(" (Text only)", "")
    .replace(" (Cast only)", "")
    .replace(" (Best ★)", "★");
}

function drawTimelineChart() {
  const data = animeData.map(d => ({ ...d, pct: d.charted / d.total }));
  const { svg, width, height } = makeSvg("#timeline-chart", 250, { top: 24, right: 20, bottom: 38, left: 44 }, 320);
  const x = d3.scaleBand().domain(data.map(d => d.year)).range([0, width]).padding(0.12);
  const y = d3.scaleLinear().domain([0, d3.max(data, d => d.total) * 1.1]).range([height, 0]);
  const yLine = d3.scaleLinear().domain([0.35, 0.55]).range([height, 0]);
  const stack = d3.stack().keys(["charted", "not_charted"])(data);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickValues(data.filter(d => d.year % 5 === 0).map(d => d.year)));

  svg.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("d")));

  svg.selectAll(".layer")
    .data(stack)
    .join("g")
    .attr("fill", d => d.key === "charted" ? "#e07b54" : "#b0bec5")
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.data.year))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .on("mousemove", (event, d) => {
      showTooltip(event, `<strong>${d.data.year}</strong>Charted: ${d.data.charted}<br>Not charted: ${d.data.not_charted}<br>Rate: ${(d.data.pct * 100).toFixed(1)}%`);
    })
    .on("mouseleave", hideTooltip);

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#e07b54")
    .attr("stroke-width", 2)
    .attr("d", d3.line().x(d => x(d.year) + x.bandwidth() / 2).y(d => yLine(d.pct)).curve(d3.curveCatmullRom));
}

function drawAblationChart() {
  const data = [...modelData].sort((a, b) => a.ap - b.ap);
  const { svg, width, height } = makeSvg("#ablation-chart", 280, { top: 10, right: 54, bottom: 34, left: 170 }, 320);
  const x = d3.scaleLinear().domain([0, 0.72]).range([0, width]);
  const y = d3.scaleBand().domain(data.map(d => d.combination)).range([height, 0]).padding(0.22);

  svg.append("g").attr("class", "axis").call(d3.axisLeft(y).tickSize(0));
  svg.append("g").attr("class", "axis").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(4).tickFormat(d3.format(".2f")));

  svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", 0)
    .attr("y", d => y(d.combination))
    .attr("width", d => x(d.ap))
    .attr("height", y.bandwidth())
    .attr("rx", 5)
    .attr("fill", d => d.combination.includes("Best") ? "#e07b54" : d.combination.startsWith("M") ? "#7eb37f" : "#c8d0d8")
    .on("mousemove", (event, d) => showTooltip(event, `<strong>${d.combination}</strong>${d.description}<br>AP: ${d.ap.toFixed(4)}`))
    .on("mouseleave", hideTooltip);

  svg.selectAll(".value")
    .data(data)
    .join("text")
    .attr("x", d => x(d.ap) + 6)
    .attr("y", d => y(d.combination) + y.bandwidth() / 2 + 4)
    .style("font-size", "11px")
    .style("fill", "#444")
    .text(d => d.ap.toFixed(3));
}

function drawHeatmapChart() {
  const mods = ["M", "I", "T", "C"];
  const names = { M: "Metadata", I: "Image", T: "Text", C: "Cast" };
  const lookup = Object.fromEntries(heatmapData.map(d => [d.key, d.ap]));
  const margin = { top: 42, right: 16, bottom: 18, left: 52 };
  const size = Math.min(Math.max(document.getElementById("heatmap-chart").clientWidth, 280), 360);
  const cell = Math.floor((size - margin.left - margin.right) / 4);
  const svg = d3.select("#heatmap-chart").append("svg")
    .attr("width", size)
    .attr("height", cell * 4 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  const color = d3.scaleSequential().domain([0.1, 0.68]).interpolator(d3.interpolateRgb("#f5f5f5", "#2e7d32"));

  mods.forEach((row, r) => {
    mods.forEach((col, c) => {
      const key = [row, col].sort().join("+");
      const value = lookup[key];
      svg.append("rect")
        .attr("x", c * cell + 2)
        .attr("y", r * cell + 2)
        .attr("width", cell - 4)
        .attr("height", cell - 4)
        .attr("rx", 4)
        .attr("fill", color(value || 0.1))
        .attr("stroke", row === col ? "#e07b54" : "none")
        .attr("stroke-width", row === col ? 2 : 0)
        .on("mousemove", event => showTooltip(event, `<strong>${names[row]} + ${names[col]}</strong>AP: ${value.toFixed(4)}`))
        .on("mouseleave", hideTooltip);

      svg.append("text")
        .attr("x", c * cell + cell / 2)
        .attr("y", r * cell + cell / 2 + 4)
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .style("fill", value > 0.45 ? "#fff" : "#333")
        .text(value.toFixed(3));
    });

    svg.append("text").attr("x", -8).attr("y", r * cell + cell / 2 + 4).attr("text-anchor", "end").style("font-size", "11px").text(mods[r]);
    svg.append("text").attr("x", r * cell + cell / 2).attr("y", -10).attr("text-anchor", "middle").style("font-size", "11px").text(mods[r]);
  });
}

function drawConfidenceSimulator() {
  const yearly = 54;
  const chartedRate = 0.464;
  const container = document.getElementById("simulator-container");

  container.innerHTML = `
    <div class="sim-controls">
      <label class="sim-label">If the model keeps the top <strong><span id="pct-display">30</span>%</strong> of titles:</label>
      <input type="range" id="threshold-slider" min="5" max="90" value="30" step="5" class="sim-slider">
      <div class="sim-scale"><span>Top 5%</span><span>Top 90%</span></div>
    </div>
    <div class="sim-results" id="sim-results"></div>
    <div id="sim-chart"></div>`;

  function getMetrics(pct) {
    const share = pct / 100;
    const predicted = Math.round(yearly * share);
    const precision = Math.min(0.95, chartedRate * (1 + 0.55 * (1 - share)));
    const truePositives = Math.round(predicted * precision);
    const recall = Math.min(1, truePositives / Math.round(yearly * chartedRate));
    return { predicted, precision, truePositives, recall };
  }

  function update(pct) {
    const m = getMetrics(pct);
    document.getElementById("pct-display").textContent = pct;
    document.getElementById("sim-results").innerHTML = `
      <div class="sim-card"><div class="sim-num">${m.predicted}</div><div class="sim-desc">titles kept</div></div>
      <div class="sim-card sim-card-highlight"><div class="sim-num">${(m.precision * 100).toFixed(0)}%</div><div class="sim-desc">precision</div></div>
      <div class="sim-card"><div class="sim-num">${m.truePositives}</div><div class="sim-desc">true charters</div></div>
      <div class="sim-card"><div class="sim-num">${(m.recall * 100).toFixed(0)}%</div><div class="sim-desc">recall</div></div>`;

    document.getElementById("sim-chart").innerHTML = `
      <div style="height:24px;background:#e8eaed;border-radius:4px;overflow:hidden;position:relative;">
        <div style="width:${pct}%;height:24px;background:#b0bec5;position:absolute;left:0;top:0;"></div>
        <div style="width:${(pct * m.precision).toFixed(1)}%;height:24px;background:#e07b54;position:absolute;left:0;top:0;"></div>
      </div>
      <div style="margin-top:8px;font-size:11px;color:#666;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;">
        <span>Orange = correctly predicted charters</span>
        <span>Gray = selected but not charted</span>
      </div>`;
  }

  document.getElementById("threshold-slider").addEventListener("input", function(event) {
    update(+event.target.value);
  });

  update(30);
}
