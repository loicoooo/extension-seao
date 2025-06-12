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
    const totalDefault = defaultContainer.querySelectorAll("input[type='checkbox']:checked").length;
    const totalCustom = customContainer.querySelectorAll("input[type='checkbox']:checked").length;
    const total = totalDefault + totalCustom;
    keywordCount.textContent = total;
  }

  function getActiveKeywords() {
    const defaultChecked = Array.from(defaultContainer.querySelectorAll("input[type='checkbox']:checked")).map(cb => cb.value);
    const customChecked = Array.from(customContainer.querySelectorAll("input[type='checkbox']:checked")).map(cb => cb.value);
    return [...defaultChecked, ...customChecked];
  }

  function saveToStorage() {
    const activeKeywords = getActiveKeywords();

    const customKeywords = Array.from(customContainer.querySelectorAll("input[type='checkbox']")).map(cb => ({
      value: cb.value,
      checked: cb.checked
    }));

    chrome.storage.local.set({ activeKeywords, customKeywords }, () => {
      updateCount();
      console.log("✅ Préférences enregistrées.");
    });
  }

  function renderKeywords() {
    chrome.storage.local.get(["activeKeywords", "customKeywords"], (data) => {
      const active = data.activeKeywords || [];
      const custom = data.customKeywords || [];

      // Affiche mots-clés par défaut
      defaultContainer.innerHTML = "";
      defaultKeywords.forEach(keyword => {
        const isChecked = active.includes(keyword);
        const label = document.createElement("label");
        label.className = "keyword-item";
        label.innerHTML = `<input type="checkbox" value="${keyword}" ${isChecked ? "checked" : ""}> ${keyword}`;
        label.querySelector("input").addEventListener("change", saveToStorage);
        defaultContainer.appendChild(label);
      });

      // Affiche mots-clés personnalisés avec bouton supprimer
      customContainer.innerHTML = "";
      custom.forEach((item, index) => {
        const label = document.createElement("label");
        label.className = "keyword-item";
        label.innerHTML = `
          <input type="checkbox" value="${item.value}" ${item.checked ? "checked" : ""}> 
          ${item.value}
          <span class="delete-btn" title="Supprimer ce mot-clé" data-index="${index}">❌</span>
        `;
        label.querySelector("input").addEventListener("change", saveToStorage);

        label.querySelector(".delete-btn").addEventListener("click", (e) => {
          e.preventDefault();
          custom.splice(index, 1);
          chrome.storage.local.set({ customKeywords: custom }, () => {
            renderKeywords();
            saveToStorage();
            console.log(`✅ Mot-clé personnalisé supprimé : ${item.value}`);
          });
        });

        customContainer.appendChild(label);
      });

      updateCount();
    });
  }

  document.getElementById("addKeyword").addEventListener("click", () => {
    const input = document.getElementById("newKeyword");
    const value = input.value.trim();
    if (!value) return;

    const label = document.createElement("label");
    label.className = "keyword-item";
    label.innerHTML = `<input type="checkbox" value="${value}" checked> ${value} <span class="delete-btn" title="Supprimer ce mot-clé">❌</span>`;
    label.querySelector("input").addEventListener("change", saveToStorage);
    label.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.preventDefault();
      label.remove();
      saveToStorage();
    });

    customContainer.appendChild(label);

    input.value = "";

    saveToStorage();
  });

  document.getElementById("deleteCustomKeywords").addEventListener("click", () => {
    customContainer.innerHTML = "";
    chrome.storage.local.set({ customKeywords: [] }, () => {
      console.log("✅ Mots-clés personnalisés supprimés.");
      saveToStorage();
    });
  });

  document.getElementById("savePreferences").addEventListener("click", saveToStorage);

  document.getElementById("launchSearch").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "launchSearch" });
  });

  renderKeywords();
});
