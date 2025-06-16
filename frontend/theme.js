const toggle = document.getElementById("theme-toggle");
//const sideToggle
document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches),
);

if (localStorage.theme === "dark") {
  document.documentElement.classList.add("dark");
  
  document.documentElement.classList.remove("ehs");
  toggle.value = "dark";
} else if (localStorage.theme === "light") {
  document.documentElement.classList.remove("dark");
  
  document.documentElement.classList.remove("ehs");
  toggle.value = "light";
} else if (localStorage.theme === "ehs") {
  document.documentElement.classList.remove("dark");
  
  document.documentElement.classList.add("ehs");
  toggle.value = "ehs";
} else {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("dark");
  }
  toggle.value = "system";
}

toggle.addEventListener("change", () => {
  localStorage.theme = toggle.value;
  if (localStorage.theme === "dark") {
    document.documentElement.classList.add("dark");
    
      document.documentElement.classList.remove("ehs");
  } else if (localStorage.theme === "light") {
    document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("ehs");
  }
  else if (localStorage.theme === "ehs") {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("ehs");
  } else {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("ehs");
    }
  }
});
