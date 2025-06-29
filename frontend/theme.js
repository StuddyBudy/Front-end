const toggle = document.getElementById("theme-toggle");

if (localStorage.theme === undefined) {
  localStorage.theme = "system";
}

toggle.value = localStorage.theme;

const updateTheme = () => {
  if (toggle.value === "system") {
    localStorage.theme = "system";
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }

    return;
  }

  document.documentElement.setAttribute("data-theme", toggle.value);
  localStorage.theme = toggle.value;
  console.log(toggle.theme);
};

toggle.addEventListener("change", updateTheme);
updateTheme();
