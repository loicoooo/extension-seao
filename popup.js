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

  let profiles = [];
  let selectedProfileId = null;

  const profileSelect = document.getElementById("profileSelect");
  const profileKeywords = document.getElementById("profileKeywords");
  const keywordCount = document.getElementById("keywordCount");

  function updateCount() {
    const profile = profiles.find((p) => p.id === selectedProfileId);
    const count = profile ? profile.keywords.filter(k => k.checked).length : 0;
    keywordCount.textContent = count;
  }

  function renderProfiles() {
    profileSelect.innerHTML = "";
    profiles.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      profileSelect.appendChild(opt);
    });
    if (selectedProfileId) {
      profileSelect.value = selectedProfileId;
    }
  }

  function renderProfileKeywords() {
    const profile = profiles.find((p) => p.id === selectedProfileId);
    if (!profile) return;

    profileKeywords.innerHTML = "";
    profile.keywords.forEach((kw, index) => {
      const label = document.createElement("label");
      label.className = "keyword-item";
      label.innerHTML = `
        <input type="checkbox" value="${kw.value}" ${kw.checked ? "checked" : ""}>
        ${kw.value}
        ${!defaultKeywords.includes(kw.value) ? "<span class='delete-btn' data-index='" + index + "'>×</span>" : ""}
      `;

      const checkbox = label.querySelector("input");
      checkbox.addEventListener("change", () => {
        kw.checked = checkbox.checked;
        saveProfiles();
        updateCount();
      });

      const deleteBtn = label.querySelector(".delete-btn");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
          profile.keywords.splice(index, 1);
          saveProfiles();
          renderProfileKeywords();
          updateCount();
        });
      }

      profileKeywords.appendChild(label);
    });

    updateCount();
  }

  function saveProfiles() {
    chrome.storage.local.set({ profiles });
  }

  function loadProfiles() {
    chrome.storage.local.get("profiles", (data) => {
      profiles = data.profiles || [];
      if (!profiles.length) {
        const defaultProfile = {
          id: crypto.randomUUID(),
          name: "Profil par défaut",
          keywords: defaultKeywords.map(k => ({ value: k, checked: false }))
        };
        profiles.push(defaultProfile);
        selectedProfileId = defaultProfile.id;
        saveProfiles();
      } else {
        selectedProfileId = profiles[0].id;
      }
      renderProfiles();
      renderProfileKeywords();
    });
  }

  document.getElementById("addKeyword").addEventListener("click", () => {
    const input = document.getElementById("newKeyword");
    const value = input.value.trim();
    if (!value) return;

    const profile = profiles.find((p) => p.id === selectedProfileId);
    if (!profile.keywords.some(k => k.value === value)) {
      profile.keywords.push({ value, checked: true });
      saveProfiles();
      renderProfileKeywords();
      input.value = "";
    }
  });

  document.getElementById("savePreferences").addEventListener("click", saveProfiles);
  document.getElementById("launchSearch").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "launchSearch" });
  });

  profileSelect.addEventListener("change", () => {
    selectedProfileId = profileSelect.value;
    renderProfileKeywords();
  });

  document.getElementById("newProfile").addEventListener("click", () => {
    const name = prompt("Nom du nouveau profil :");
    if (!name) return;
    const newProfile = {
      id: crypto.randomUUID(),
      name,
      keywords: defaultKeywords.map(k => ({ value: k, checked: false }))
    };
    profiles.push(newProfile);
    selectedProfileId = newProfile.id;
    renderProfiles();
    renderProfileKeywords();
    saveProfiles();
  });

  document.getElementById("renameProfile").addEventListener("click", () => {
    const profile = profiles.find((p) => p.id === selectedProfileId);
    if (!profile) return;
    const newName = prompt("Nouveau nom du profil :", profile.name);
    if (!newName) return;
    profile.name = newName;
    renderProfiles();
    saveProfiles();
  });

  document.getElementById("deleteProfile").addEventListener("click", () => {
    if (!confirm("Supprimer ce profil ?")) return;
    profiles = profiles.filter((p) => p.id !== selectedProfileId);
    if (profiles.length) {
      selectedProfileId = profiles[0].id;
    } else {
      selectedProfileId = null;
    }
    renderProfiles();
    renderProfileKeywords();
    saveProfiles();
  });

  document.getElementById("selectAllBtn").addEventListener("click", () => {
    const profile = profiles.find((p) => p.id === selectedProfileId);
    if (!profile) return;
    profile.keywords.forEach((kw) => kw.checked = true);
    saveProfiles();
    renderProfileKeywords();
    updateCount();
  });

  document.getElementById("deselectAllBtn").addEventListener("click", () => {
    const profile = profiles.find((p) => p.id === selectedProfileId);
    if (!profile) return;
    profile.keywords.forEach((kw) => kw.checked = false);
    saveProfiles();
    renderProfileKeywords();
    updateCount();
  });

  loadProfiles();
});
