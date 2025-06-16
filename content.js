console.log("🚀 Script injecté, en attente du champ...");

chrome.storage.local.get(["activeKeywords"], (data) => {
  const keywords = data.activeKeywords || [];

  // Formater les mots clés avec guillemets si contiennent un espace, sinon wildcard *
  const formattedKeywords = keywords.map(keyword => {
    if (keyword.includes(" ")) {
      return `"${keyword}"`;
    } else {
      return `${keyword}*`;
    }
  });

  function check() {
    // Remplace le sélecteur ci-dessous par celui du champ mots clés réel dans SEAO
    const input = document.querySelector("input#form\\.recherche\\.avancee\\.mots\\.cles\\.nimporte");
    if (input) {
      input.value = formattedKeywords.join(" OR ");
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Coche la case "Avis appels d'offres"
      const avisCheckbox = document.querySelector("input#form\\.recherche\\.avancee\\.typesAvis\\.1\\.3");
      if (avisCheckbox && !avisCheckbox.checked) avisCheckbox.click();

      // Coche la case "Publié"
      const publieCheckbox = document.querySelector("input#form\\.recherche\\.avancee\\.status\\.avis\\.1\\.6");
      if (publieCheckbox && !publieCheckbox.checked) publieCheckbox.click();

      console.log("🎯 Script SEAO complété avec mots-clés dynamiques !");
    } else {
      setTimeout(check, 500);
    }
  }

  check();
});
