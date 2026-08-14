const main = document.getElementById("main");
const progressTrack = document.getElementById("progressTrack");
const progressFill = document.getElementById("progressFill");

const state = {
  businessType: null,
  categoryIndex: 0,
  answers: {},
  gates: {},
};

function getCategories() {
  return CONFIG[state.businessType].categories;
}

function setProgress(pct) {
  progressTrack.hidden = pct === null;
  if (pct !== null) progressFill.style.width = pct + "%";
}

function renderTypeSelect() {
  setProgress(null);
  const types = Object.keys(CONFIG);
  main.innerHTML = `
    <p class="eyebrow">Schritt 1</p>
    <h1 class="title">Um welchen Betrieb geht's?</h1>
    <p class="subtitle">Wähle den passenden Typ, damit wir dir die richtigen Fragen stellen.</p>
    <div class="type-grid">
      ${types
        .map(
          (key) => `
        <button class="type-card" data-type="${key}">
          <span class="icon">${CONFIG[key].icon}</span>
          <span>
            <span class="label">${CONFIG[key].name}</span>
            <span class="hint">Für Gäste dieses Betriebstyps</span>
          </span>
        </button>
      `,
        )
        .join("")}
      <button class="type-card" disabled>
        <span class="icon">➕</span>
        <span>
          <span class="label">Weitere Typen</span>
          <span class="hint">Folgen bald</span>
        </span>
      </button>
    </div>
  `;

  main.querySelectorAll(".type-card[data-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.businessType = btn.dataset.type;
      state.categoryIndex = 0;
      state.answers = {};
      state.gates = {};
      renderCategory(0);
    });
  });
}

function renderCategory(index) {
  const categories = getCategories();
  const category = categories[index];
  setProgress(Math.round((index / categories.length) * 100));

  const itemsHtml = category.items
    .map((item, i) => {
      const current = state.answers[item.id];
      const skipped = current === "-";
      const value = skipped ? 0 : (current ?? 0);
      if (state.answers[item.id] === undefined) state.answers[item.id] = value;

      return `
      <div class="question-card" style="animation-delay:${0.05 + i * 0.05}s">
        <div class="question-head">
          <span class="question-label">${item.label}</span>
          ${item.weight > 1 ? `<span class="question-weight">${item.weight}× gewichtet</span>` : ""}
        </div>
        <p class="question-text">${item.question}</p>
        <div class="slider-row">
          <input type="range" min="0" max="10" step="1" value="${value}"
                 data-item="${item.id}" ${skipped ? "disabled" : ""}>
          <span class="value-box" data-value-for="${item.id}">${skipped ? "–" : value}</span>
        </div>
        <label class="skip-toggle">
          <input type="checkbox" data-skip="${item.id}" ${skipped ? "checked" : ""}>
          Kann ich nicht beurteilen
        </label>
      </div>
    `;
    })
    .join("");

  const gatesHtml = category.sperrklauseln
    .map((gate, i) => {
      const val = state.gates[gate.id];
      const isIrrelevant =
        gate.scope === "item" && state.answers[gate.target] === "-";
      return `
      <div class="gate-card ${isIrrelevant ? "gate-disabled" : ""}" data-gate-card="${gate.id}" style="animation-delay:${0.05 + (category.items.length + i) * 0.05}s">
        <span class="gate-tag">Wichtige Zusatzfrage</span>
        <p class="gate-label">${gate.question}</p>
        <div class="pill-row">
          <button class="pill ${val === true ? "active" : ""}" data-gate="${gate.id}" data-gateval="true" ${isIrrelevant ? "disabled" : ""}>Ja</button>
          <button class="pill ${val === false ? "active no" : ""}" data-gate="${gate.id}" data-gateval="false" ${isIrrelevant ? "disabled" : ""}>Nein</button>
        </div>
      </div>
    `;
    })
    .join("");

  main.innerHTML = `
    <p class="eyebrow">Gang ${index + 1} von ${categories.length}</p>
    <h1 class="title">${category.name}</h1>
    <p class="subtitle">Bewerte jeden Punkt von 0 (sehr schlecht) bis 10 (hervorragend).</p>
    ${itemsHtml}
    ${gatesHtml}
    <div class="nav-row">
      ${index > 0 ? `<button class="btn" id="backBtn">Zurück</button>` : `<button class="btn" id="backBtn">Betriebstyp ändern</button>`}
      <button class="btn btn-primary" id="nextBtn">${index === categories.length - 1 ? "Ergebnis anzeigen" : "Weiter"}</button>
    </div>
  `;

  main.querySelectorAll("input[type='range']").forEach((slider) => {
    slider.addEventListener("input", () => {
      const id = slider.dataset.item;
      state.answers[id] = Number(slider.value);
      main.querySelector(`[data-value-for="${id}"]`).textContent = slider.value;
    });
  });

  main.querySelectorAll("[data-skip]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const id = checkbox.dataset.skip;
      const slider = main.querySelector(
        `input[type="range"][data-item="${id}"]`,
      );
      const valueBox = main.querySelector(`[data-value-for="${id}"]`);
      const relatedGates = category.sperrklauseln.filter(
        (g) => g.scope === "item" && g.target === id,
      );

      if (checkbox.checked) {
        state.answers[id] = "-";
        slider.disabled = true;
        valueBox.textContent = "–";
        relatedGates.forEach((g) => {
          state.gates[g.id] = undefined;
          const card = main.querySelector(`[data-gate-card="${g.id}"]`);
          if (!card) return;
          card.classList.add("gate-disabled");
          card.querySelectorAll(".pill").forEach((p) => {
            p.classList.remove("active", "no");
            p.disabled = true;
          });
        });
      } else {
        slider.disabled = false;
        state.answers[id] = Number(slider.value);
        valueBox.textContent = slider.value;
        relatedGates.forEach((g) => {
          const card = main.querySelector(`[data-gate-card="${g.id}"]`);
          if (!card) return;
          card.classList.remove("gate-disabled");
          card.querySelectorAll(".pill").forEach((p) => {
            p.disabled = false;
          });
        });
      }
    });
  });

  main.querySelectorAll("[data-gate]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const gateId = btn.dataset.gate;
      const isYes = btn.dataset.gateval === "true";
      state.gates[gateId] = isYes;

      const card = main.querySelector(`[data-gate-card="${gateId}"]`);
      card
        .querySelectorAll(".pill")
        .forEach((p) => p.classList.remove("active", "no"));
      btn.classList.add("active");
      if (!isYes) btn.classList.add("no");
    });
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    if (index === categories.length - 1) {
      renderResult();
    } else {
      renderCategory(index + 1);
    }
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    if (index === 0) {
      renderTypeSelect();
    } else {
      renderCategory(index - 1);
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function computeResults() {
  const categories = getCategories();
  const categoryResults = [];
  const triggeredCaps = [];

  categories.forEach((category) => {
    const itemValues = {};

    category.items.forEach((item) => {
      let raw = state.answers[item.id];
      if (raw === "-" || raw === undefined) return;
      let value = Number(raw);

      category.sperrklauseln
        .filter(
          (g) =>
            g.scope === "item" &&
            g.target === item.id &&
            state.gates[g.id] === false,
        )
        .forEach((g) => {
          if (value > g.maxIfNo) {
            triggeredCaps.push(
              `${category.name} – ${item.label}: von ${value} auf max. ${g.maxIfNo} gedeckelt, weil „${g.question}“ mit Nein beantwortet wurde.`,
            );
          }
          value = Math.min(value, g.maxIfNo);
        });

      itemValues[item.id] = value;
    });

    let sum = 0,
      weightTotal = 0;
    category.items.forEach((item) => {
      if (itemValues[item.id] !== undefined) {
        sum += itemValues[item.id] * item.weight;
        weightTotal += item.weight;
      }
    });
    let avg = weightTotal > 0 ? sum / weightTotal : null;

    category.sperrklauseln
      .filter((g) => g.scope === "category" && state.gates[g.id] === false)
      .forEach((g) => {
        if (avg !== null && avg > g.maxIfNo) {
          triggeredCaps.push(
            `${category.name}: Kategorie-Durchschnitt von ${avg.toFixed(1)} auf max. ${g.maxIfNo} gedeckelt, weil „${g.question}“ mit Nein beantwortet wurde.`,
          );
        }
        if (avg !== null) avg = Math.min(avg, g.maxIfNo);
      });

    categoryResults.push({ id: category.id, name: category.name, avg });
  });

  const validAvgs = categoryResults.filter((c) => c.avg !== null);
  const overallAvg = validAvgs.length
    ? validAvgs.reduce((s, c) => s + c.avg, 0) / validAvgs.length
    : null;

  let overallStars = toStars(overallAvg);

  const oneStarCategories = categoryResults.filter(
    (c) => c.avg !== null && toStars(c.avg) === 1,
  );
  if (oneStarCategories.length && overallStars > 1) {
    oneStarCategories.forEach((c) => {
      triggeredCaps.push(
        `Gesamtbewertung auf 1 Stern begrenzt, da „${c.name}“ nur 1 Stern erreicht hat.`,
      );
    });
    overallStars = 1;
  }

  return { categoryResults, overallAvg, overallStars, triggeredCaps };
}

function toStars(score) {
  if (score === null) return 0;
  if (score < 3) return 1;
  if (score < 5) return 2;
  if (score < 7) return 3;
  if (score < 9) return 4;
  return 5;
}

function starGlyphs(count) {
  return "★".repeat(count) + "☆".repeat(5 - count);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildReviewText(categoryResults, overallAvg, overallStars) {
  const rated = categoryResults.filter((c) => c.avg !== null);
  if (!rated.length) return "";
  const top = rated.reduce((a, b) => (b.avg > a.avg ? b : a));
  const low = rated.reduce((a, b) => (b.avg < a.avg ? b : a));

  const hasPositive = top.avg >= 8;

  const halfOverall = overallAvg !== null ? overallAvg / 2 : 0;
  const hasCritical = low.avg < halfOverall;

  const level = Math.max(1, Math.min(5, overallStars || 1));
  let text = pickRandom(REVIEW_OPENERS[level]);

  if (hasPositive) {
    text +=
      " " + pickRandom(REVIEW_POSITIVE_CLAUSES).replaceAll("{top}", top.name);
  }
  if (hasCritical) {
    text +=
      " " + pickRandom(REVIEW_NEGATIVE_CLAUSES).replaceAll("{low}", low.name);
  }

  return text;
}

function renderResult() {
  setProgress(100);
  const { categoryResults, overallAvg, overallStars, triggeredCaps } =
    computeResults();
  const reviewText = buildReviewText(categoryResults, overallAvg, overallStars);

  main.innerHTML = `
    <p class="eyebrow">Dein Ergebnis</p>
    <h1 class="title">Fertig serviert.</h1>
    <p class="subtitle">So würde deine Google-Bewertung aussehen. Text gerne anpassen und übernehmen.</p>

    <div class="receipt">
      ${triggeredCaps.length ? `<button class="info-btn" id="infoBtn" aria-label="Sperrklausel-Infos anzeigen">i</button>` : ""}
      <div class="receipt-head">
        <div class="type">${CONFIG[state.businessType].name}</div>
        <div class="overall-stars">${starGlyphs(overallStars)}</div>
        <div class="overall-score">${overallAvg !== null ? overallAvg.toFixed(1) : "–"} / 10 Punkte</div>
      </div>
      ${
        triggeredCaps.length
          ? `
        <div class="info-panel" id="infoPanel" hidden>
          <span class="info-panel-title">Diese Sperrklauseln haben das Ergebnis beeinflusst</span>
          <ul>${triggeredCaps.map((msg) => `<li>${msg}</li>`).join("")}</ul>
        </div>
      `
          : ""
      }
      <hr class="receipt-divider">
      ${categoryResults
        .map(
          (c, i) => `
        <div class="receipt-row" style="animation-delay:${0.5 + i * 0.1}s">
          <span class="cat-name">${c.name}</span>
          <span>
            <span class="stars">${starGlyphs(toStars(c.avg))}</span>
            <span class="cat-score">${c.avg !== null ? c.avg.toFixed(1) : "–"}</span>
          </span>
        </div>
      `,
        )
        .join("")}
      <hr class="receipt-divider">
      <div class="review-text-wrap">
        <span class="review-text-label">Vorschlag Bewertungstext</span>
        <span id="reviewText">${reviewText}</span>
      </div>
    </div>

    <div class="result-actions">
      <button class="btn" id="restartBtn">Neu starten</button>
      <button class="btn btn-primary" id="copyBtn">Text kopieren</button>
    </div>
  `;

  const infoBtn = document.getElementById("infoBtn");
  if (infoBtn) {
    infoBtn.addEventListener("click", () => {
      const panel = document.getElementById("infoPanel");
      panel.hidden = !panel.hidden;
      infoBtn.classList.toggle("active", !panel.hidden);
    });
  }

  document.getElementById("copyBtn").addEventListener("click", () => {
    navigator.clipboard.writeText(reviewText).then(() => {
      const btn = document.getElementById("copyBtn");
      const original = btn.textContent;
      btn.textContent = "Kopiert!";
      setTimeout(() => (btn.textContent = original), 1600);
    });
  });

  document
    .getElementById("restartBtn")
    .addEventListener("click", renderTypeSelect);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

renderTypeSelect();
