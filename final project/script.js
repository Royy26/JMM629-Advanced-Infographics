/* =====================================================
   FINAL DRAFT 4.28 - script.js
   Evidence-first narrative · D3 v7 · Scrollama v3.2
   JMM629 Advanced Infographics · Sijie Huang · 2026
   ===================================================== */

const tooltip = d3.select("#tooltip");

function showTip(event, html) {
  tooltip
    .html(html)
    .style("opacity", 1)
    .style("left", `${event.clientX + 16}px`)
    .style("top", `${event.clientY - 32}px`);
}

function hideTip() {
  tooltip.style("opacity", 0);
}

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

const modalities = [
  { key: "M", name: "Metadata", color: "#f97316" },
  { key: "I", name: "Image", color: "#4ade80" },
  { key: "T", name: "Text", color: "#a78bfa" },
  { key: "C", name: "Cast", color: "#60a5fa" },
  { key: "P", name: "Production", color: "#facc15" }
];

const modalityLookup = Object.fromEntries(modalities.map(d => [d.key, d]));

const modelData = [
  { label: "Metadata", abbr: "M", ap: 0.6122 },
  { label: "Text", abbr: "T", ap: 0.2904 },
  { label: "Image", abbr: "I", ap: 0.3439 },
  { label: "Cast", abbr: "C", ap: 0.1590 },
  { label: "Production", abbr: "P", ap: 0.2778 },
  { label: "M+T", abbr: "M+T", ap: 0.5681 },
  { label: "M+I", abbr: "M+I", ap: 0.6456 },
  { label: "M+C", abbr: "M+C", ap: 0.5987 },
  { label: "M+P", abbr: "M+P", ap: 0.5799 },
  { label: "T+I", abbr: "T+I", ap: 0.3507 },
  { label: "T+C", abbr: "T+C", ap: 0.1987 },
  { label: "T+P", abbr: "T+P", ap: 0.2895 },
  { label: "I+C", abbr: "I+C", ap: 0.3510 },
  { label: "I+P", abbr: "I+P", ap: 0.3502 },
  { label: "C+P", abbr: "C+P", ap: 0.1883 },
  { label: "M+T+I", abbr: "M+T+I", ap: 0.6463 },
  { label: "M+T+C", abbr: "M+T+C", ap: 0.5932 },
  { label: "M+T+P", abbr: "M+T+P", ap: 0.5862 },
  { label: "M+I+C", abbr: "M+I+C", ap: 0.6552 },
  { label: "M+I+P", abbr: "M+I+P", ap: 0.6582 },
  { label: "M+C+P", abbr: "M+C+P", ap: 0.6105 },
  { label: "T+I+C", abbr: "T+I+C", ap: 0.3648 },
  { label: "T+I+P", abbr: "T+I+P", ap: 0.3560 },
  { label: "T+C+P", abbr: "T+C+P", ap: 0.2041 },
  { label: "I+C+P", abbr: "I+C+P", ap: 0.3408 },
  { label: "M+T+I+C", abbr: "M+T+I+C", ap: 0.6541 },
  { label: "M+T+I+P", abbr: "M+T+I+P", ap: 0.6568 },
  { label: "M+T+C+P", abbr: "M+T+C+P", ap: 0.6079 },
  { label: "M+I+C+P", abbr: "M+I+C+P", ap: 0.6632 },
  { label: "T+I+C+P", abbr: "T+I+C+P", ap: 0.3532 },
  { label: "All 5", abbr: "M+I+T+C+P", ap: 0.6643 }
].map(d => ({ ...d, k: d.abbr.split("+").length }));

const heatmapData = [
  { key: "M+M", ap: 0.6122 },
  { key: "I+I", ap: 0.3439 },
  { key: "T+T", ap: 0.2904 },
  { key: "C+C", ap: 0.1590 },
  { key: "P+P", ap: 0.2778 },
  { key: "I+M", ap: 0.6456 },
  { key: "M+T", ap: 0.5681 },
  { key: "C+M", ap: 0.5987 },
  { key: "M+P", ap: 0.5799 },
  { key: "I+T", ap: 0.3507 },
  { key: "C+T", ap: 0.1987 },
  { key: "P+T", ap: 0.2895 },
  { key: "C+I", ap: 0.3510 },
  { key: "I+P", ap: 0.3502 },
  { key: "C+P", ap: 0.1883 }
];

const slotContextData = [
  {
    slot: "Late Night",
    toneClass: "late-night",
    rateValue: "5.0%",
    rateCaption: "charted rate",
    rateLabel: "5.0% charted rate",
    sceneLabel: "Most selective",
    sceneRead: "These Average Precision (AP) scores are low because Late Night is the hardest market in the set: only 5.0% of titles chart. Even so, Metadata alone still reaches 0.229 in Average Precision, and the full model lifts that to 0.292, which means extra clues help the ranking but do not fully overcome the slot's harsh baseline.",
    fullAp: 0.2921,
    models: [
      { label: "Metadata", ap: 0.2294, tone: "metadata" },
      { label: "All features", ap: 0.2921, tone: "full" }
    ]
  },
  {
    slot: "Morning",
    toneClass: "morning",
    rateValue: "22.3%",
    rateCaption: "charted rate",
    rateLabel: "22.3% charted rate",
    sceneLabel: "Clearest split",
    sceneRead: "This is where model separation reads most clearly.",
    fullAp: 0.8081,
    models: [
      { label: "Metadata", ap: 0.7526, tone: "metadata" },
      { label: "All features", ap: 0.8081, tone: "full" }
    ]
  },
  {
    slot: "Afternoon-Eve",
    toneClass: "afternoon-eve",
    rateValue: "29.8%",
    rateCaption: "charted rate",
    rateLabel: "29.8% charted rate",
    sceneLabel: "Broadest reach",
    sceneRead: "A broader market with a stable high tier.",
    fullAp: 0.7585,
    models: [
      { label: "Metadata", ap: 0.7332, tone: "metadata" },
      { label: "All features", ap: 0.7585, tone: "full" }
    ]
  }
];

const stationFingerprintProfiles = [
  {
    station: "TV Tokyo",
    shows: 349,
    hits: 29,
    rateValue: "8.3%",
    rateLabel: "chart rate",
    status: "Comparable",
    summary: "Image shows the clearest upward movement."
  },
  {
    station: "TBS",
    shows: 212,
    hits: 16,
    rateValue: "7.5%",
    rateLabel: "chart rate",
    status: "Comparable",
    summary: "A split-response station with two different readings."
  },
  {
    station: "Fuji TV",
    shows: 90,
    hits: 10,
    rateValue: "11.1%",
    rateLabel: "chart rate",
    status: "Comparable",
    summary: "Mostly steady, with limited extra lift."
  },
  {
    station: "NTV",
    shows: 76,
    hits: 36,
    rateValue: "47.4%",
    rateLabel: "chart rate",
    status: "Comparable",
    spotlight: true,
    summary: "Highest base and the clearest Text response."
  },
  {
    station: "TV Asahi",
    shows: 61,
    hits: 16,
    rateValue: "26.2%",
    rateLabel: "chart rate",
    status: "Comparable",
    summary: "Metadata already carries most of the signal."
  },
  {
    station: "NHK",
    shows: 32,
    hits: 9,
    rateValue: "28.1%",
    rateLabel: "chart rate",
    status: "Comparable",
    summary: "Smaller sample, but Image hints at upside."
  },
  {
    station: "NHK-E",
    shows: 80,
    hits: 4,
    rateValue: "5.0%",
    rateLabel: "chart rate",
    status: "Reference only",
    referenceOnly: true,
    summary: "Smaller profile, kept as context."
  }
];

const stationCellTooltipData = {
  "TV Tokyo:full-vs-m": {
    station: "TV Tokyo",
    comparisonLabel: "Full vs Metadata",
    candidateLabel: "Full",
    referenceLabel: "Metadata",
    ap: { candidate: 0.4858, reference: 0.3990, delta: 0.0868, significant: false },
    auroc: { candidate: 0.8818, reference: 0.8294, delta: 0.0524, significant: false },
    takeaway: "Both scores lean upward, which makes TV Tokyo a promising place to watch the full mix."
  },
  "TV Tokyo:plus-image": {
    station: "TV Tokyo",
    comparisonLabel: "M+I vs Metadata",
    candidateLabel: "M+I",
    referenceLabel: "Metadata",
    ap: { candidate: 0.4576, reference: 0.3990, delta: 0.0586, significant: false },
    auroc: { candidate: 0.8874, reference: 0.8294, delta: 0.0580, significant: false },
    takeaway: "Image trends upward here and looks directionally helpful, even if the lift is not yet stable."
  },
  "TV Tokyo:plus-text": {
    station: "TV Tokyo",
    comparisonLabel: "M+T vs Metadata",
    candidateLabel: "M+T",
    referenceLabel: "Metadata",
    ap: { candidate: 0.3743, reference: 0.3990, delta: -0.0247, significant: false },
    auroc: { candidate: 0.8177, reference: 0.8294, delta: -0.0117, significant: false },
    takeaway: "Text stays close to Metadata on TV Tokyo, suggesting the baseline already carries much of the signal."
  },
  "TBS:full-vs-m": {
    station: "TBS",
    comparisonLabel: "Full vs Metadata",
    candidateLabel: "Full",
    referenceLabel: "Metadata",
    ap: { candidate: 0.4015, reference: 0.3255, delta: 0.0760, significant: false },
    auroc: { candidate: 0.8268, reference: 0.8543, delta: -0.0274, significant: false },
    takeaway: "One score rises while the other softens, making TBS a useful mixed-profile station."
  },
  "TBS:plus-image": {
    station: "TBS",
    comparisonLabel: "M+I vs Metadata",
    candidateLabel: "M+I",
    referenceLabel: "Metadata",
    ap: { candidate: 0.4003, reference: 0.3255, delta: 0.0747, significant: false },
    auroc: { candidate: 0.7733, reference: 0.8543, delta: -0.0810, significant: false },
    takeaway: "This cell reveals a split signal: AP improves while AUROC softens, which makes TBS informative."
  },
  "TBS:plus-text": {
    station: "TBS",
    comparisonLabel: "M+T vs Metadata",
    candidateLabel: "M+T",
    referenceLabel: "Metadata",
    ap: { candidate: 0.3160, reference: 0.3255, delta: -0.0095, significant: false },
    auroc: { candidate: 0.7966, reference: 0.8543, delta: -0.0577, significant: false },
    takeaway: "Text remains close to Metadata on TBS, without a decisive separation."
  },
  "Fuji TV:full-vs-m": {
    station: "Fuji TV",
    comparisonLabel: "Full vs Metadata",
    candidateLabel: "Full",
    referenceLabel: "Metadata",
    ap: { candidate: 0.6172, reference: 0.5732, delta: 0.0439, significant: false },
    auroc: { candidate: 0.8700, reference: 0.7925, delta: 0.0775, significant: false },
    takeaway: "The full mix trends upward on both scores, reinforcing a favorable direction over metadata."
  },
  "Fuji TV:plus-image": {
    station: "Fuji TV",
    comparisonLabel: "M+I vs Metadata",
    candidateLabel: "M+I",
    referenceLabel: "Metadata",
    ap: { candidate: 0.5564, reference: 0.5732, delta: -0.0169, significant: false },
    auroc: { candidate: 0.8187, reference: 0.7925, delta: 0.0262, significant: false },
    takeaway: "This is an informative split cell: one score eases slightly while the other moves up."
  },
  "Fuji TV:plus-text": {
    station: "Fuji TV",
    comparisonLabel: "M+T vs Metadata",
    candidateLabel: "M+T",
    referenceLabel: "Metadata",
    ap: { candidate: 0.5628, reference: 0.5732, delta: -0.0104, significant: false },
    auroc: { candidate: 0.7863, reference: 0.7925, delta: -0.0062, significant: false },
    takeaway: "Text stays near Metadata on Fuji TV."
  },
  "NTV:full-vs-m": {
    station: "NTV",
    comparisonLabel: "Full vs Metadata",
    candidateLabel: "Full",
    referenceLabel: "Metadata",
    ap: { candidate: 0.8936, reference: 0.8896, delta: 0.0040, significant: false },
    auroc: { candidate: 0.8569, reference: 0.8826, delta: -0.0257, significant: false },
    takeaway: "All features keep NTV in an already high-performing range, showing how strong the baseline already is here."
  },
  "NTV:plus-image": {
    station: "NTV",
    comparisonLabel: "M+I vs Metadata",
    candidateLabel: "M+I",
    referenceLabel: "Metadata",
    ap: { candidate: 0.9071, reference: 0.8896, delta: 0.0175, significant: false },
    auroc: { candidate: 0.8819, reference: 0.8826, delta: -0.0007, significant: false },
    takeaway: "Image keeps NTV near the same high-performing level once Metadata is present."
  },
  "NTV:plus-text": {
    station: "NTV",
    comparisonLabel: "M+T vs Metadata",
    candidateLabel: "M+T",
    referenceLabel: "Metadata",
    ap: { candidate: 0.8411, reference: 0.8896, delta: -0.0485, significant: true },
    auroc: { candidate: 0.8535, reference: 0.8826, delta: -0.0292, significant: true },
    takeaway: "This is the clearest station-specific response in the matrix: Text shifts both scores on NTV."
  },
  "TV Asahi:full-vs-m": {
    station: "TV Asahi",
    comparisonLabel: "Full vs Metadata",
    candidateLabel: "Full",
    referenceLabel: "Metadata",
    ap: { candidate: 0.9532, reference: 0.9694, delta: -0.0162, significant: false },
    auroc: { candidate: 0.9611, reference: 0.9847, delta: -0.0236, significant: false },
    takeaway: "Metadata already captures most of the signal here, which highlights a very strong baseline on TV Asahi."
  },
  "TV Asahi:plus-image": {
    station: "TV Asahi",
    comparisonLabel: "M+I vs Metadata",
    candidateLabel: "M+I",
    referenceLabel: "Metadata",
    ap: { candidate: 0.9688, reference: 0.9694, delta: -0.0007, significant: false },
    auroc: { candidate: 0.9778, reference: 0.9847, delta: -0.0069, significant: false },
    takeaway: "Image keeps results near the same top-tier level once Metadata is in place."
  },
  "TV Asahi:plus-text": {
    station: "TV Asahi",
    comparisonLabel: "M+T vs Metadata",
    candidateLabel: "M+T",
    referenceLabel: "Metadata",
    ap: { candidate: 0.9851, reference: 0.9694, delta: 0.0157, significant: false },
    auroc: { candidate: 0.9931, reference: 0.9847, delta: 0.0083, significant: false },
    takeaway: "Text nudges both scores upward here, pointing to a small but interesting extra signal."
  },
  "NHK:full-vs-m": {
    station: "NHK",
    comparisonLabel: "Full vs Metadata",
    candidateLabel: "Full",
    referenceLabel: "Metadata",
    ap: { candidate: 0.2674, reference: 0.2334, delta: 0.0341, significant: false },
    auroc: { candidate: 0.4251, reference: 0.3382, delta: 0.0870, significant: false },
    takeaway: "The full mix trends upward on NHK and points to additional upside worth watching."
  },
  "NHK:plus-image": {
    station: "NHK",
    comparisonLabel: "M+I vs Metadata",
    candidateLabel: "M+I",
    referenceLabel: "Metadata",
    ap: { candidate: 0.2485, reference: 0.2334, delta: 0.0151, significant: false },
    auroc: { candidate: 0.3913, reference: 0.3382, delta: 0.0531, significant: false },
    takeaway: "Image adds a light upward push on NHK and suggests room for extra signal."
  },
  "NHK:plus-text": {
    station: "NHK",
    comparisonLabel: "M+T vs Metadata",
    candidateLabel: "M+T",
    referenceLabel: "Metadata",
    ap: { candidate: 0.2402, reference: 0.2334, delta: 0.0069, significant: false },
    auroc: { candidate: 0.3430, reference: 0.3382, delta: 0.0048, significant: false },
    takeaway: "Text stays close to Metadata on NHK."
  }
};

const stationSummaryTooltipData = {
  "TV Tokyo": {
    station: "TV Tokyo",
    comparisonLabel: "Full vs Image-only",
    candidateLabel: "Full",
    referenceLabel: "Image",
    ap: { candidate: 0.4858, reference: 0.4195, delta: 0.0663, significant: false },
    auroc: { candidate: 0.8818, reference: 0.8478, delta: 0.0339, significant: false },
    takeaway: "All features stay ahead of Image only, keeping the full mix in front while the gap remains modest."
  },
  TBS: {
    station: "TBS",
    comparisonLabel: "Full vs Image-only",
    candidateLabel: "Full",
    referenceLabel: "Image",
    ap: { candidate: 0.4015, reference: 0.1487, delta: 0.2528, significant: true },
    auroc: { candidate: 0.8268, reference: 0.6046, delta: 0.2223, significant: true },
    takeaway: "This is one of the three stations where All features clearly beat Image only."
  },
  "Fuji TV": {
    station: "Fuji TV",
    comparisonLabel: "Full vs Image-only",
    candidateLabel: "Full",
    referenceLabel: "Image",
    ap: { candidate: 0.6172, reference: 0.5380, delta: 0.0792, significant: false },
    auroc: { candidate: 0.8700, reference: 0.7650, delta: 0.1050, significant: false },
    takeaway: "Fuji TV trends upward against poster-only, showing encouraging room for the full mix."
  },
  NHK: {
    station: "NHK",
    comparisonLabel: "Full vs Image-only",
    candidateLabel: "Full",
    referenceLabel: "Image",
    ap: { candidate: 0.2674, reference: 0.3567, delta: -0.0893, significant: false },
    auroc: { candidate: 0.4251, reference: 0.5507, delta: -0.1256, significant: false },
    takeaway: "On NHK, poster-only edges above the full mix, which makes NHK a useful reminder that channel context can redirect the pattern."
  },
  NTV: {
    station: "NTV",
    comparisonLabel: "Full vs Image-only",
    candidateLabel: "Full",
    referenceLabel: "Image",
    ap: { candidate: 0.8936, reference: 0.7110, delta: 0.1826, significant: true },
    auroc: { candidate: 0.8569, reference: 0.7007, delta: 0.1562, significant: true },
    takeaway: "NTV is another station where the full mix separates clearly from poster-only."
  },
  "TV Asahi": {
    station: "TV Asahi",
    comparisonLabel: "Full vs Image-only",
    candidateLabel: "Full",
    referenceLabel: "Image",
    ap: { candidate: 0.9532, reference: 0.6166, delta: 0.3366, significant: true },
    auroc: { candidate: 0.9611, reference: 0.8222, delta: 0.1389, significant: true },
    takeaway: "TV Asahi shows the strongest separation between All features and Image only."
  }
};

function formatDelta(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(4)}`;
}

function readableComparisonLabel(label) {
  switch (label) {
    case "Full vs Metadata":
      return "All features vs Metadata";
    case "M+I vs Metadata":
      return "Metadata + Image vs Metadata";
    case "M+T vs Metadata":
      return "Metadata + Text vs Metadata";
    case "Full vs Image-only":
      return "All features vs Image only";
    default:
      return label;
  }
}

function readableStationLabel(label) {
  switch (label) {
    case "Full":
      return "All features";
    case "Metadata":
      return "Metadata";
    case "M+I":
      return "Metadata + Image";
    case "M+T":
      return "Metadata + Text";
    case "Image":
      return "Image only";
    default:
      return label;
  }
}

function significanceLabel(significant) {
  return significant
    ? '<span style="color:#f97316">clear difference</span>'
    : '<span style="color:#94a3b8">no clear difference</span>';
}

function buildStationTooltip(detail) {
  return [
    `<strong>${detail.station} · ${readableComparisonLabel(detail.comparisonLabel)}</strong>`,
    `<span style="color:#94a3b8">Hit-finding score (AP)</span>: ${readableStationLabel(detail.candidateLabel)} ${detail.ap.candidate.toFixed(4)} vs ${readableStationLabel(detail.referenceLabel)} ${detail.ap.reference.toFixed(4)} (${formatDelta(detail.ap.delta)}) ${significanceLabel(detail.ap.significant)}`,
    `<span style="color:#94a3b8">Overall separation (AUROC)</span>: ${readableStationLabel(detail.candidateLabel)} ${detail.auroc.candidate.toFixed(4)} vs ${readableStationLabel(detail.referenceLabel)} ${detail.auroc.reference.toFixed(4)} (${formatDelta(detail.auroc.delta)}) ${significanceLabel(detail.auroc.significant)}`,
    `<span style="color:#94a3b8">Plain-English read:</span> ${detail.takeaway}`
  ].join("<br>");
}

function buildStationDetailCard(detail) {
  return `
    <div class="station-detail-head">
      <div>
        <span class="station-detail-kicker">Pinned detail</span>
        <h4 class="station-detail-title">${detail.station} · ${readableComparisonLabel(detail.comparisonLabel)}</h4>
      </div>
      <button type="button" class="station-detail-close" data-clear-station-detail>Clear card</button>
    </div>
    <div class="station-detail-grid">
      <div class="station-detail-metric">
        <span class="station-detail-label">Hit-finding score (AP)</span>
        <strong class="station-detail-main">${readableStationLabel(detail.candidateLabel)} ${detail.ap.candidate.toFixed(4)} vs ${readableStationLabel(detail.referenceLabel)} ${detail.ap.reference.toFixed(4)}</strong>
        <p class="station-detail-meta">Gap ${formatDelta(detail.ap.delta)} · ${detail.ap.significant ? "clear difference" : "no clear difference"}</p>
      </div>
      <div class="station-detail-metric">
        <span class="station-detail-label">Overall separation (AUROC)</span>
        <strong class="station-detail-main">${readableStationLabel(detail.candidateLabel)} ${detail.auroc.candidate.toFixed(4)} vs ${readableStationLabel(detail.referenceLabel)} ${detail.auroc.reference.toFixed(4)}</strong>
        <p class="station-detail-meta">Gap ${formatDelta(detail.auroc.delta)} · ${detail.auroc.significant ? "clear difference" : "no clear difference"}</p>
      </div>
    </div>
    <p class="station-detail-read"><strong>Plain-English read:</strong> ${detail.takeaway}</p>
  `;
}

function pairKey(a, b) {
  return [a, b].sort().join("+");
}

function comboToNames(abbr) {
  return abbr.split("+").map(key => modalityLookup[key].name).join(" + ");
}

function comboDisplayLabel(d) {
  if (d.k === 1) return modalityLookup[d.abbr].name;
  if (d.label === "All 5") return "All features";
  return d.label;
}

function comboInsight(d) {
  if (d.abbr === "M+I+T+C+P") {
    return "Best overall result across all 31 tested versions.<br>";
  }
  if (d.abbr === "M+I+C+P") {
    return "Top-performing version without Text; a strong, compact alternative.<br>";
  }
  if (d.k === 1) {
    return `${modalityLookup[d.abbr].name} alone.<br>`;
  }
  return `${comboToNames(d.abbr)}.<br>`;
}

function makeSvg(selector, outerH, margin, minW) {
  const node = document.querySelector(selector);
  if (!node) return null;

  const outerW = Math.max(node.clientWidth || 400, minW || 320);
  const W = outerW - margin.left - margin.right;
  const H = outerH - margin.top - margin.bottom;

  const svg = d3.select(selector)
    .append("svg")
    .attr("width", outerW)
    .attr("height", outerH)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  return { svg, W, H };
}

let timelineBars;
let rankingRows;
let heatmapCells;
let evidenceStep = 0;
let manualFocus = null;
let activeStationTrigger = null;
let activeStationDetailKey = null;

const timelineGuideTexts = [
  "Start with the full timeline, then follow the highlighted years to see why metadata is already informative before broadcast.",
  "Watch the mid-2000s expansion years: more output means shows are entering a more crowded field, which makes metadata meaningful.",
  "At peak output, the market is larger but still selective. The key clue is not just volume, but the kind of season a show enters.",
  "This final view ties the chart back to the main claim: metadata is strong because it describes where a show enters the market before audiences react."
];

const timelineSubHtml = [
  `Each bar is one year. <strong style="color:#f97316">Orange</strong> marks charted titles, <span style="color:#94a3b8">gray</span> marks titles that never charted. The line tracks the charted rate over time.`,
  `Focus on the growth years. Output rises quickly, which means release year and market timing already carry useful context before a show airs.`,
  `Peak production does not erase competition. Even at the busiest points, only some titles break through, so context stays informative.`,
  `This is why metadata works so well: the model is not only seeing a title, it is also seeing the industry conditions wrapped around that title.`
];

const evidenceGuideTexts = [
  "Start with the full ranking. Then compare the one-clue versions before tracing what happens when metadata enters the mix.",
  "Look at the five one-clue bars first. Metadata sits far above the others, which sets up the core story.",
  "Now track every combination containing metadata. The ranking and two-clue map start to tell the same story: once M appears, scores rise.",
  "Finish by comparing the top versions directly. The top tier stays tightly grouped, which signals a robust, metadata-centered model family."
];

const evidenceSubHtml = [
  `Across all 31 versions, the same simple story keeps showing up: Metadata matters most, Image helps next, and the extra features add only a little.`,
  `The one-clue view makes the order obvious: Metadata leads, Image follows, and the rest sit much lower on their own.`,
  `When metadata enters a combination, most of the upper half of the ranking lights up. The two-clue chart reinforces the same pattern.`,
  `The best model uses All features, but only barely. That tiny final gap is the real ending of the evidence section.`
];

const rankingCueTexts = [
  "Start with the five one-clue bars, then watch how the top group forms around combinations that include Metadata and Image.",
  "Stay on the five one-clue bars first: they establish the baseline before you compare larger combinations.",
  "Focus on the upper half of the ranking now. Most of the strongest combinations share the same metadata core.",
  "Hold the top two models side by side. The ranking says All features win, but only by the smallest visible margin in the story."
];

function setHtml(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function updateStepProgress(containerId, activeStep) {
  const root = document.getElementById(containerId);
  if (!root) return;

  root.querySelectorAll(".step-progress-dot").forEach(dot => {
    dot.classList.toggle("is-active", Number(dot.dataset.progressStep) === activeStep);
  });
}

function updateTimelineNarrative(stepIndex) {
  setHtml("timeline-sub", timelineSubHtml[stepIndex] || timelineSubHtml[0]);
  setText("timeline-guide-text", timelineGuideTexts[stepIndex] || timelineGuideTexts[0]);
  updateStepProgress("timeline-progress", stepIndex);
}

function updateEvidenceNarrative(stepIndex) {
  const sub = document.querySelector("#sec-evidence .sticky-sub");
  if (sub) sub.innerHTML = evidenceSubHtml[stepIndex] || evidenceSubHtml[0];

  setText("evidence-guide-text", evidenceGuideTexts[stepIndex] || evidenceGuideTexts[0]);
  setText("ranking-reading-cue", rankingCueTexts[stepIndex] || rankingCueTexts[0]);
  updateStepProgress("evidence-progress", stepIndex);
}

function updateManualEvidenceNarrative() {
  if (!manualFocus) {
    updateEvidenceNarrative(evidenceStep);
    return;
  }

  if (manualFocus.type === "pair") {
    const names = manualFocus.mods.map(mod => modalityLookup[mod].name).join(" + ");
    setText("evidence-guide-text", `Manual highlight: ${names}. This view shows every ranked combination that contains that two-clue pair.`);
    setText("ranking-reading-cue", `Only combinations containing ${names} stay bright. Click the same square again to return to the story.`);
    return;
  }

  if (manualFocus.type === "combo") {
    const names = manualFocus.mods.map(mod => modalityLookup[mod].name).join(" + ");
    setText("evidence-guide-text", `Manual highlight: ${names}. The ranking isolates one exact version while the map shows the smaller pieces inside it.`);
    setText("ranking-reading-cue", "The selected bar is isolated now. Click it again to return to the step-by-step reading path.");
  }
}

function setActiveStorySection(sectionId) {
  document.querySelectorAll(".story-rail-item").forEach(item => {
    const isActive = item.dataset.storyTarget === sectionId;
    item.classList.toggle("is-active", isActive);

    if (isActive) {
      item.setAttribute("aria-current", "true");
    } else {
      item.removeAttribute("aria-current");
    }
  });
}

function initStoryRail() {
  const sections = Array.from(document.querySelectorAll(".story-section"));
  if (!sections.length) return;

  const updateActive = () => {
    const anchorLine = window.innerHeight * 0.38;
    let activeId = sections[0].id;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= anchorLine && rect.bottom > anchorLine) {
        activeId = section.id;
      }
    });

    setActiveStorySection(activeId);
  };

  updateActive();
  window.addEventListener("scroll", updateActive, { passive: true });
  window.addEventListener("resize", updateActive);
}

function drawTimelineChart() {
  const container = document.querySelector("#timeline-chart");
  if (!container) return;

  const margin = { top: 24, right: 28, bottom: 42, left: 44 };
  const outerW = Math.max(container.clientWidth || 500, 400);
  const outerH = 280;
  const W = outerW - margin.left - margin.right;
  const H = outerH - margin.top - margin.bottom;
  const timelineData = animeData.map(d => ({ ...d, pct: d.charted / d.total }));

  const svg = d3.select("#timeline-chart")
    .append("svg")
    .attr("width", outerW)
    .attr("height", outerH)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .domain(timelineData.map(d => d.year))
    .range([0, W])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(timelineData, d => d.total) * 1.1])
    .range([H, 0]);

  const yLine = d3.scaleLinear()
    .domain([0.35, 0.60])
    .range([H, 0]);

  const stack = d3.stack().keys(["charted", "not_charted"])(timelineData);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${H})`)
    .call(
      d3.axisBottom(x)
        .tickValues(timelineData.filter(d => d.year % 5 === 0).map(d => d.year))
        .tickSize(4)
    );

  svg.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("d")));

  const layers = svg.selectAll(".layer")
    .data(stack)
    .join("g")
    .attr("fill", d => d.key === "charted" ? "#f97316" : "#475569");

  timelineBars = layers.selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("class", d => `bar bar-y${d.data.year}`)
    .attr("x", d => x(d.data.year))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d[1]))
    .attr("height", d => Math.max(0, y(d[0]) - y(d[1])))
    .attr("rx", 2)
    .on("mousemove", (ev, d) => showTip(
      ev,
      `<strong>${d.data.year}</strong>Charted: ${d.data.charted}<br>Not charted: ${d.data.not_charted}<br><span style="color:#f97316">Rate: ${(d.data.pct * 100).toFixed(1)}%</span>`
    ))
    .on("mouseleave", hideTip);

  svg.append("path")
    .datum(timelineData)
    .attr("fill", "none")
    .attr("stroke", "#f97316")
    .attr("stroke-width", 2)
    .attr("opacity", 0.75)
    .attr("d", d3.line()
      .x(d => x(d.year) + x.bandwidth() / 2)
      .y(d => yLine(d.pct))
      .curve(d3.curveCatmullRom));

  const peakYear = 2014;
  const peak = timelineData.find(d => d.year === peakYear);
  svg.append("text")
    .attr("x", x(peakYear) + x.bandwidth() / 2)
    .attr("y", y(peak.total) - 7)
    .attr("text-anchor", "middle")
    .style("font-size", "10px")
    .style("fill", "#f97316")
    .style("font-weight", "700")
    .text("Peak ->");
}

function highlightYears(yearStart, yearEnd) {
  if (!timelineBars) return;
  timelineBars.transition().duration(350)
    .style("opacity", d => {
      if (yearStart === null) return 1;
      return d.data.year >= yearStart && d.data.year <= yearEnd ? 1 : 0.18;
    });
}

function drawRankingChart() {
  const data = [...modelData].sort((a, b) => a.ap - b.ap);
  const margin = { top: 18, right: 64, bottom: 40, left: 220 };
  const res = makeSvg("#ranking-chart", 760, margin, 470);
  if (!res) return;

  const { svg, W, H } = res;
  const x = d3.scaleLinear().domain([0, 0.70]).range([0, W]);
  const y = d3.scaleBand().domain(data.map(d => d.abbr)).range([H, 0]).padding(0.16);
  const barColor = d3.scaleLinear()
    .domain(d3.extent(data, d => d.ap))
    .range(["#334155", "#f97316"]);

  svg.selectAll(".grid-line")
    .data(x.ticks(5))
    .join("line")
    .attr("class", "grid-line")
    .attr("x1", d => x(d))
    .attr("x2", d => x(d))
    .attr("y1", 0)
    .attr("y2", H)
    .attr("stroke", "rgba(255,255,255,0.06)")
    .attr("stroke-dasharray", "3,3");

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${H})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format(".2f")));

  rankingRows = svg.selectAll(".ranking-row")
    .data(data)
    .join("g")
    .attr("class", d => `ranking-row ranking-${d.abbr.replace(/\+/g, "-")}`)
    .attr("transform", d => `translate(0,${y(d.abbr)})`)
    .style("cursor", "pointer")
    .on("click", (ev, d) => toggleComboFocus(d.abbr.split("+")))
    .on("mousemove", (ev, d) => showTip(
      ev,
      `<strong>${comboToNames(d.abbr)}</strong>${comboInsight(d)}<span style="color:#f97316">AP: ${d.ap.toFixed(4)}</span>`
    ))
    .on("mouseleave", hideTip);

  rankingRows.append("text")
    .attr("x", -122)
    .attr("y", y.bandwidth() / 2 + 4)
    .attr("text-anchor", "end")
    .style("font-size", "11px")
    .style("fill", "#cbd5e1")
    .style("font-weight", d => d.k >= 4 ? "700" : "600")
    .text(d => comboDisplayLabel(d));

  rankingRows.selectAll(".ranking-pip")
    .data(d => modalities.map((modality, index) => ({
      abbr: d.abbr,
      modality,
      index,
      active: d.abbr.includes(modality.key)
    })))
    .join("circle")
    .attr("class", "ranking-pip")
    .attr("cx", d => -104 + d.index * 16)
    .attr("cy", y.bandwidth() / 2)
    .attr("r", 4.5)
    .attr("fill", d => d.active ? d.modality.color : "rgba(136,153,170,0.22)")
    .attr("stroke", d => d.active ? "rgba(255,255,255,0.2)" : "none")
    .attr("stroke-width", 1);

  rankingRows.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", d => x(d.ap))
    .attr("height", y.bandwidth())
    .attr("rx", 5)
    .attr("fill", d => barColor(d.ap));

  rankingRows.append("text")
    .attr("class", "ranking-value")
    .attr("x", d => x(d.ap) + 7)
    .attr("y", y.bandwidth() / 2 + 4)
    .style("font-size", "11px")
    .style("fill", "#94a3b8")
    .text(d => d.ap.toFixed(3));

  const best = data[data.length - 1];
  svg.append("text")
    .attr("x", x(best.ap) + 8)
    .attr("y", y(best.abbr) - 6)
    .style("font-size", "10px")
    .style("fill", "#f97316")
    .style("font-weight", "700")
    .text("BEST");
}

function drawHeatmapChart() {
  const container = document.getElementById("heatmap-chart");
  if (!container) return;

  const mods = modalities.map(d => d.key);
  const lookup = Object.fromEntries(heatmapData.map(d => [d.key, d.ap]));
  const margin = { top: 54, right: 16, bottom: 16, left: 62 };
  const containerW = Math.min(Math.max(container.clientWidth || 360, 320), 430);
  const cell = Math.floor((containerW - margin.left - margin.right) / 5);
  const svgH = cell * 5 + margin.top + margin.bottom;

  const cellsData = [];
  mods.forEach((row, r) => {
    mods.forEach((col, c) => {
      const key = pairKey(row, col);
      cellsData.push({
        row,
        col,
        r,
        c,
        key,
        ap: lookup[key] ?? 0.15,
        diagonal: row === col
      });
    });
  });

  const svg = d3.select("#heatmap-chart")
    .append("svg")
    .attr("width", containerW)
    .attr("height", svgH)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const color = d3.scaleLinear()
    .domain([0.15, 0.67])
    .range(["#243244", "#f97316"]);

  heatmapCells = svg.selectAll(".hm-cell")
    .data(cellsData)
    .join("g")
    .attr("class", d => `hm-cell hm-row-${d.row} hm-col-${d.col}`)
    .style("cursor", "pointer")
    .on("click", (ev, d) => {
      const modsForSelection = d.row === d.col ? [d.row] : [d.row, d.col];
      togglePairFocus(modsForSelection);
    })
    .on("mousemove", (ev, d) => {
      const label = d.row === d.col
        ? `${modalityLookup[d.row].name} alone`
        : `${modalityLookup[d.row].name} + ${modalityLookup[d.col].name}`;

      showTip(
        ev,
        `<strong>${label}</strong>AP: ${d.ap.toFixed(4)}<br><span style="color:#94a3b8;font-size:11px">Click to highlight matching combinations</span>`
      );
    })
    .on("mouseleave", hideTip);

  heatmapCells.append("rect")
    .attr("x", d => d.c * cell + 3)
    .attr("y", d => d.r * cell + 3)
    .attr("width", cell - 6)
    .attr("height", cell - 6)
    .attr("rx", 6)
    .attr("fill", d => color(d.ap))
    .attr("stroke", d => d.diagonal ? modalityLookup[d.row].color : "none")
    .attr("stroke-width", d => d.diagonal ? 2 : 0);

  heatmapCells.append("text")
    .attr("x", d => d.c * cell + cell / 2)
    .attr("y", d => d.r * cell + cell / 2 + 4)
    .attr("text-anchor", "middle")
    .style("font-size", "11px")
    .style("font-weight", "700")
    .style("fill", d => d.ap > 0.40 ? "#ffffff" : "#cbd5e1")
    .text(d => d.ap.toFixed(3));

  mods.forEach((mod, index) => {
    svg.append("text")
      .attr("x", -10)
      .attr("y", index * cell + cell / 2 + 4)
      .attr("text-anchor", "end")
      .style("font-size", "12px")
      .style("font-weight", "700")
      .style("fill", modalityLookup[mod].color)
      .text(mod);

    svg.append("text")
      .attr("x", index * cell + cell / 2)
      .attr("y", -14)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "700")
      .style("fill", modalityLookup[mod].color)
      .text(mod);
  });
}

function positionPercent(value, minValue, maxValue) {
  const ratio = (value - minValue) / (maxValue - minValue);
  return Math.max(0, Math.min(100, ratio * 100));
}

function drawSlotContextChart() {
  const chartContainer = document.getElementById("slot-context-chart");
  if (!chartContainer) return;

  chartContainer.innerHTML = "";

  const slotColors = {
    "Late Night": "#f97316",
    Morning: "#93c5fd",
    "Afternoon-Eve": "#2dd4bf"
  };

  const domainMin = 0.18;
  const domainMax = 0.85;

  chartContainer.innerHTML = `
    <div class="slot-scene-grid">
      ${slotContextData.map(slot => {
        const metadata = slot.models.find(model => model.label === "Metadata");
        const full = slot.models.find(model => model.label === "All features");
        const metaPos = positionPercent(metadata.ap, domainMin, domainMax);
        const fullPos = positionPercent(full.ap, domainMin, domainMax);
        const rangeLeft = Math.min(metaPos, fullPos);
        const rangeWidth = Math.max(Math.abs(fullPos - metaPos), 2.4);
        const gap = full.ap - metadata.ap;

        return `
          <article class="slot-scene-card slot-scene-card--${slot.toneClass}" style="--slot-scene-accent:${slotColors[slot.slot]}">
            <div class="slot-scene-card-head">
              <div>
                <span class="slot-scene-kicker">${slot.slot}</span>
                <h4 class="slot-scene-title">${slot.sceneLabel}</h4>
              </div>
              <div class="slot-scene-rate-block">
                <span class="slot-scene-rate">${slot.rateValue}</span>
                <span class="slot-scene-rate-caption">${slot.rateCaption}</span>
              </div>
            </div>

            <div class="slot-scene-shift" data-slot="${slot.slot}">
              <div class="slot-scene-track">
                <span class="slot-scene-track-base"></span>
                <span class="slot-scene-range" style="left:${rangeLeft}%; width:${rangeWidth}%"></span>
                <span class="slot-scene-point slot-scene-point--metadata" style="left:${metaPos}%"></span>
                <span class="slot-scene-point slot-scene-point--full" style="left:${fullPos}%"></span>
              </div>
              <p class="slot-scene-metric-note">Within-slot Average Precision (AP)</p>
              <div class="slot-scene-model-grid">
                <div class="slot-scene-model">
                  <span class="slot-scene-model-label">Metadata</span>
                  <strong class="slot-scene-model-value">${metadata.ap.toFixed(3)}</strong>
                </div>
                <div class="slot-scene-model">
                  <span class="slot-scene-model-label">All features</span>
                  <strong class="slot-scene-model-value">${full.ap.toFixed(3)}</strong>
                </div>
              </div>
              <p class="slot-scene-gap">${gap >= 0 ? "+" : ""}${gap.toFixed(3)} Average Precision (AP) gain in this slot</p>
            </div>

            <p class="slot-scene-read">${slot.sceneRead}</p>
          </article>
        `;
      }).join("")}
    </div>
  `;

  chartContainer.querySelectorAll(".slot-scene-shift").forEach((element, index) => {
    const slot = slotContextData[index];
    const metadata = slot.models.find(model => model.label === "Metadata");
    const full = slot.models.find(model => model.label === "All features");

    element.addEventListener("mousemove", event => showTip(
      event,
      `<strong>${slot.slot}</strong><br>${slot.rateLabel}<br><span style="color:#94a3b8">Metadata ${metadata.ap.toFixed(4)} → All features ${full.ap.toFixed(4)}</span>`
    ));
    element.addEventListener("mouseleave", hideTip);
  });
}

function buildStationFingerprintRail(station, comparison, label) {
  const detail = stationCellTooltipData[`${station}:${comparison}`];
  if (!detail) return "";

  const domainMin = 0.2;
  const domainMax = 1;
  const start = positionPercent(detail.ap.reference, domainMin, domainMax);
  const end = positionPercent(detail.ap.candidate, domainMin, domainMax);
  const left = Math.min(start, end);
  const width = Math.max(Math.abs(end - start), 1.8);
  const trendClass = detail.ap.candidate >= detail.ap.reference ? "forward" : "backward";
  const toneClass = comparison === "plus-image" ? "image" : "text";

  return `
    <div class="station-fingerprint-rail station-fingerprint-rail--${toneClass} station-fingerprint-rail--${trendClass}" data-station="${station}" data-comparison="${comparison}">
      <div class="station-fingerprint-rail-head">
        <span>${label}</span>
        <strong>${detail.ap.reference.toFixed(3)} → ${detail.ap.candidate.toFixed(3)}</strong>
      </div>
      <div class="station-fingerprint-track">
        <span class="station-fingerprint-track-base"></span>
        <span class="station-fingerprint-range" style="left:${left}%; width:${width}%"></span>
        <span class="station-fingerprint-dot station-fingerprint-dot--baseline" style="left:${start}%"></span>
        <span class="station-fingerprint-dot station-fingerprint-dot--candidate" style="left:${end}%"></span>
      </div>
    </div>
  `;
}

function renderStationFingerprintWall() {
  const wall = document.getElementById("station-fingerprint-wall");
  if (!wall) return;

  const cards = stationFingerprintProfiles.filter(profile => !profile.referenceOnly);
  const reference = stationFingerprintProfiles.find(profile => profile.referenceOnly);

  wall.innerHTML = `
    <div class="station-fingerprint-grid">
      ${cards.map(profile => `
        <article class="station-fingerprint-card${profile.spotlight ? " station-fingerprint-card--spotlight" : ""}">
          <div class="station-fingerprint-top" data-station-summary="${profile.station}">
            <div>
              <span class="station-fingerprint-name">${profile.station}</span>
              <span class="station-fingerprint-meta">${profile.shows} shows · ${profile.hits} hits</span>
            </div>
            <div class="station-fingerprint-rate-block">
              <strong class="station-fingerprint-rate">${profile.rateValue}</strong>
              <span class="station-fingerprint-rate-label">${profile.rateLabel}</span>
            </div>
            <span class="station-fingerprint-status">${profile.status}</span>
          </div>

          <div class="station-fingerprint-rails">
            ${buildStationFingerprintRail(profile.station, "plus-image", "Image")}
            ${buildStationFingerprintRail(profile.station, "plus-text", "Text")}
          </div>

          <p class="station-fingerprint-read">${profile.summary}</p>
        </article>
      `).join("")}
    </div>
    ${reference ? `
      <article class="station-fingerprint-card station-fingerprint-card--reference">
        <div class="station-fingerprint-top station-fingerprint-top--reference">
          <div>
            <span class="station-fingerprint-name">${reference.station}</span>
            <span class="station-fingerprint-meta">${reference.shows} shows · ${reference.hits} hits</span>
          </div>
          <div class="station-fingerprint-rate-block">
            <strong class="station-fingerprint-rate">${reference.rateValue}</strong>
            <span class="station-fingerprint-rate-label">${reference.rateLabel}</span>
          </div>
          <span class="station-fingerprint-status station-fingerprint-status--reference">${reference.status}</span>
        </div>
        <p class="station-fingerprint-reference">${reference.summary}</p>
      </article>
    ` : ""}
  `;
}

function renderStationDetailCard(detail = null) {
  const card = document.getElementById("station-detail-card");
  if (!card) return;

  if (!detail) {
    card.innerHTML = `
      <div class="station-detail-empty">
        <span class="station-detail-kicker">Pinned detail</span>
        <p>Hover any card head or response rail for a quick read. Click or tap to pin the exact score comparison here.</p>
      </div>
    `;
    return;
  }

  card.innerHTML = buildStationDetailCard(detail);
}

function clearStationDetail() {
  if (activeStationTrigger) {
    activeStationTrigger.classList.remove("is-selected");
    activeStationTrigger.setAttribute("aria-pressed", "false");
  }

  activeStationTrigger = null;
  activeStationDetailKey = null;
  renderStationDetailCard();
}

function pinStationDetail(detailKey, detail, trigger) {
  if (activeStationDetailKey === detailKey) {
    clearStationDetail();
    return;
  }

  if (activeStationTrigger) {
    activeStationTrigger.classList.remove("is-selected");
    activeStationTrigger.setAttribute("aria-pressed", "false");
  }

  activeStationTrigger = trigger;
  activeStationDetailKey = detailKey;
  trigger.classList.add("is-selected");
  trigger.setAttribute("aria-pressed", "true");
  renderStationDetailCard(detail);
}

function bindStationInteraction(element, detailKey, detail, enablePinning) {
  element.classList.add("has-tooltip");

  element.addEventListener("mousemove", event => showTip(event, buildStationTooltip(detail)));
  element.addEventListener("mouseleave", hideTip);
  if (!enablePinning) return;

  element.setAttribute("role", "button");
  element.setAttribute("tabindex", "0");
  element.setAttribute("aria-pressed", "false");

  element.addEventListener("click", event => {
    event.preventDefault();
    hideTip();
    pinStationDetail(detailKey, detail, element);
  });
  element.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    hideTip();
    pinStationDetail(detailKey, detail, element);
  });
}

function initStationMatrixTooltips() {
  const detailCard = document.getElementById("station-detail-card");
  const enablePinning = Boolean(detailCard);
  if (detailCard) {
    detailCard.addEventListener("click", event => {
      if (event.target.closest("[data-clear-station-detail]")) {
        clearStationDetail();
      }
    });
  }

  renderStationDetailCard();

  document.querySelectorAll("[data-station][data-comparison]").forEach(cell => {
    const key = `${cell.dataset.station}:${cell.dataset.comparison}`;
    const detail = stationCellTooltipData[key];
    if (!detail) return;

    bindStationInteraction(cell, key, detail, enablePinning);
  });

  document.querySelectorAll("[data-station-summary]").forEach(label => {
    const detail = stationSummaryTooltipData[label.dataset.stationSummary];
    if (!detail) return;

    bindStationInteraction(label, `summary:${label.dataset.stationSummary}`, detail, enablePinning);
  });
}

function applyRankingOpacity(predicate) {
  if (!rankingRows) return;
  rankingRows.transition().duration(300)
    .style("opacity", d => predicate(d) ? 1 : 0.14);
}

function applyHeatmapOpacity(predicate) {
  if (!heatmapCells) return;
  heatmapCells.transition().duration(300)
    .style("opacity", d => predicate(d) ? 1 : 0.18);
}

function comboContainsCell(mods, row, col) {
  if (row === col) return mods.includes(row);
  return mods.includes(row) && mods.includes(col);
}

function manualFocusEquals(type, mods) {
  return manualFocus && manualFocus.type === type && manualFocus.mods.join("+") === mods.join("+");
}

function togglePairFocus(mods) {
  manualFocus = manualFocusEquals("pair", mods) ? null : { type: "pair", mods };
  applyEvidenceView();
  updateManualEvidenceNarrative();
}

function toggleComboFocus(mods) {
  manualFocus = manualFocusEquals("combo", mods) ? null : { type: "combo", mods };
  applyEvidenceView();
  updateManualEvidenceNarrative();
}

function applyEvidenceView() {
  if (manualFocus) {
    if (manualFocus.type === "pair") {
      const mods = manualFocus.mods;
      applyRankingOpacity(d => mods.every(mod => d.abbr.includes(mod)));
      applyHeatmapOpacity(d => d.key === pairKey(mods[0], mods[1] || mods[0]));
      return;
    }

    if (manualFocus.type === "combo") {
      const mods = manualFocus.mods;
      applyRankingOpacity(d => d.abbr === mods.join("+"));
      applyHeatmapOpacity(d => comboContainsCell(mods, d.row, d.col));
      return;
    }
  }

  if (evidenceStep === 1) {
    applyRankingOpacity(d => d.k === 1);
    applyHeatmapOpacity(d => d.diagonal);
    return;
  }

  if (evidenceStep === 2) {
    applyRankingOpacity(d => d.abbr.includes("M"));
    applyHeatmapOpacity(d => d.row === "M" || d.col === "M");
    return;
  }

  if (evidenceStep === 3) {
    const topSet = new Set(["M+I+T+C+P", "M+I+C+P"]);
    applyRankingOpacity(d => topSet.has(d.abbr));
    applyHeatmapOpacity(d => {
      if (d.diagonal && (d.row === "M" || d.row === "I")) return true;
      return d.key === pairKey("M", "I");
    });
    return;
  }

  applyRankingOpacity(() => true);
  applyHeatmapOpacity(() => true);
}

function initTakeawayObserver() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    }),
    { threshold: 0.25 }
  );

  document.querySelectorAll(".tw-item").forEach(el => observer.observe(el));
}

function initTimelineScrollama() {
  const scroller = scrollama();
  scroller.setup({
    step: "#timeline-steps .step",
    offset: 0.55,
    debug: false
  })
    .onStepEnter(({ element }) => {
      document.querySelectorAll("#timeline-steps .step").forEach(step => step.classList.remove("is-active"));
      element.classList.add("is-active");

      const stepIndex = parseInt(element.dataset.step, 10);
      const headings = [
        "Anime Output, 2000–2025",
        "Output Starts Rising: 2006–2010",
        "Peak Output: 2014–2015",
        "Why Metadata Helps"
      ];

      const heading = document.getElementById("timeline-heading");
      if (heading) heading.textContent = headings[stepIndex] || headings[0];
      updateTimelineNarrative(stepIndex);

      const ranges = [null, [2006, 2010], [2014, 2015], [2020, 2025]];
      const range = ranges[stepIndex];
      highlightYears(range ? range[0] : null, range ? range[1] : null);
    })
    .onStepExit(({ element, direction }) => {
      if (direction === "up" && parseInt(element.dataset.step, 10) === 0) {
        highlightYears(null, null);
        updateTimelineNarrative(0);
      }
    });
}

function initEvidenceScrollama() {
  const evidenceSteps = document.querySelectorAll("#evidence-steps .step");
  if (!evidenceSteps.length) return;

  const scroller = scrollama();
  scroller.setup({
    step: "#evidence-steps .step",
    offset: 0.55,
    debug: false
  })
    .onStepEnter(({ element }) => {
      document.querySelectorAll("#evidence-steps .step").forEach(step => step.classList.remove("is-active"));
      element.classList.add("is-active");
      evidenceStep = parseInt(element.dataset.step, 10);
      manualFocus = null;
      applyEvidenceView();
      updateEvidenceNarrative(evidenceStep);
    })
    .onStepExit(({ element, direction }) => {
      if (direction === "up" && parseInt(element.dataset.step, 10) === 0) {
        evidenceStep = 0;
        manualFocus = null;
        applyEvidenceView();
        updateEvidenceNarrative(0);
      }
    });
}

document.addEventListener("DOMContentLoaded", () => {
  drawTimelineChart();
  drawRankingChart();
  drawHeatmapChart();
  drawSlotContextChart();
  renderStationFingerprintWall();
  initStationMatrixTooltips();
  initTakeawayObserver();
  applyEvidenceView();
  updateTimelineNarrative(0);
  updateEvidenceNarrative(0);
  initStoryRail();

  setTimeout(() => {
    initTimelineScrollama();
    initEvidenceScrollama();
  }, 200);
});
