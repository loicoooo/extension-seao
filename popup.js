document.addEventListener("DOMContentLoaded", () => {
  const defaultKeywords = [
    "Atmosphare", "Kompan", "Ipepa", "équipements de jeux", "aire de jeux",
    "structure récréative", "appareils de jeux", "modules d'entraînement",
    "tapis sablé", "terrain multisport", "condition physique", "pumptack",
    "skatepark", "parcours modulaire", "piste à rouleau", "piste à vague",
    "Playrite", "Concept Urbain", "Monooko", "Parkitect", "Arconas",
    "hussey seating", "omsi", "master industrie", "seating concept",
    "estrade mobile", "gradin", "gradin rétractable", "tribune", "télescopique",
    "escamotables", "aréna", "salle multiculturelle", "salle multifonctionnelle",
    "salle de spectacle", "multifonction", "maison de la culture",
    "sanitaire automatisée", "toilette séchée", "toilette intelligente",
    "toilette autonettoyante", "sanitaire autonettoyant", "toilette écologique",
    "unité sanitaire automatisée"
  ];

  const defaultContainer = document.getElementById("defaultKeywords");
  const customContainer = document.getElementById("customKeywords");
  const keywordCount = document.getElementById("keywordCount");

  function updateCount() {
    const total =
      defaultContainer.querySelectorAll("input[type='checkbox']:checked").length +
      customContainer.querySelectorAll("input[type='checkbox']:checked").length;
    keywordCount.textContent = total;
  }

  function getActiveKeywords() {
    const defaultChecked = Array.from(defaultContainer.querySelectorAll("input[type='checkbox']:checked")).map(cb => cb.value);
    const customChecked = Array.from(customContainer.querySelectorAll("input[type='checkbox']:checked")).map(cb => cb.value);
    return [...defaultChecked, ...customChecked];
  }

  function saveToStorage() {
    const activeKeywords = getActiveKeywords();
    const customKeywords = Array.from(customContainer.querySelectorAll("label")).map(label => {
      const checkbox = label.querySelector("input[type='checkbox']");
      return {
        value: checkbox.value,
        checked: checkbox.checked
      };
    });
    chrome.storage.local.set({ activeKeywords, customKeywords });
    updateCount();
  }

  function createKeywordElement(value, checked, isCustom = false) {
    const label = document.createElement("label");
    label.className = "keyword-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = value;
    checkbox.checked = checked;
    checkbox.addEventListener("change", saveToStorage);

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(value));

    if (isCustom) {
      const deleteBtn = document.createElement("span");
      deleteBtn.textContent = "✕";
      deleteBtn.className = "delete-btn";
      deleteBtn.addEventListener("click", () => {
        label.remove();
        saveToStorage();
      });
      label.appendChild(deleteBtn);
    }

    return label;
  }

  function renderKeywords() {
    chrome.storage.local.get(["activeKeywords", "customKeywords"], (data) => {
      const active = data.activeKeywords || [];
      const custom = data.customKeywords || [];

      defaultContainer.innerHTML = "";
      defaultKeywords.forEach(keyword => {
        const isChecked = active.includes(keyword);
        const label = createKeywordElement(keyword, isChecked);
        defaultContainer.appendChild(label);
      });

      customContainer.innerHTML = "";
      custom.forEach(item => {
        const label = createKeywordElement(item.value, item.checked, true);
        customContainer.appendChild(label);
      });

      updateCount();
    });
  }

  document.getElementById("addKeyword").addEventListener("click", () => {
    const input = document.getElementById("newKeyword");
    const value = input.value.trim();
    if (!value) return;

    const label = createKeywordElement(value, true, true);
    customContainer.appendChild(label);
    input.value = "";

    saveToStorage();
  });

  document.getElementById("savePreferences").addEventListener("click", saveToStorage);

  document.getElementById("launchSearch").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "launchSearch" });
  });

  document.getElementById("selectAllKeywords").addEventListener("click", () => {
    const checkboxes = document.querySelectorAll("#defaultKeywords input[type='checkbox'], #customKeywords input[type='checkbox']");
    checkboxes.forEach(cb => cb.checked = true);
    saveToStorage();
  });

  document.getElementById("deselectAllKeywords").addEventListener("click", () => {
    const checkboxes = document.querySelectorAll("#defaultKeywords input[type='checkbox'], #customKeywords input[type='checkbox']");
    checkboxes.forEach(cb => cb.checked = false);
    saveToStorage();
  });

  renderKeywords();
});
