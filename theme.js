const toggle = document.getElementById("theme-toggle");

document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches),
);

if (localStorage.theme === "dark") {
  document.documentElement.classList.add("dark");
  toggle.value = "dark";
} else if (localStorage.theme === "light") {
  document.documentElement.classList.remove("dark");
  toggle.value = "light";
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
  } else if (localStorage.theme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  }
});