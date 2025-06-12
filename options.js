const themes = [
  { name: "light", label: "Clair", class: "theme-light" },
  { name: "dark", label: "Sombre", class: "theme-dark" },
  { name: "blue", label: "Bleu", class: "theme-blue" },
  { name: "green", label: "Vert", class: "theme-green" },
  { name: "red", label: "Rouge", class: "theme-red" },
  { name: "yellow", label: "Jaune", class: "theme-yellow" },
  { name: "contrast", label: "Contrasté", class: "theme-contrast" },
  { name: "ocean", label: "Océan", class: "theme-ocean" },
  { name: "sand", label: "Sable", class: "theme-sand" },
  { name: "purple", label: "Violet", class: "theme-purple" },
];

const grid = document.getElementById("themeGrid");

themes.forEach(theme => {
  const btn = document.createElement("div");
  btn.className = `theme-button ${theme.class}`;
  btn.textContent = theme.label;
  btn.addEventListener("mouseover", () => {
    document.body.className = theme.class;
  });
  btn.addEventListener("click", () => {
    localStorage.setItem("theme", theme.name);
    alert(`Thème "${theme.label}" sélectionné !`);
  });
  grid.appendChild(btn);
});

const saved = localStorage.getItem("theme");
if (saved) {
  const current = themes.find(t => t.name === saved);
  if (current) document.body.className = current.class;
}
