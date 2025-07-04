

const web = document.getElementById("theme-toggle-web");
const mobile = document.getElementById("theme-toggle-mobile");

// initial value localStorage or default to "system" if nothin in storage
const savedTheme = localStorage.theme || "system";
web.value = savedTheme;
mobile.value = savedTheme;

function updateTheme(e) {
  let value = savedTheme;
  if (e && e.target) {
    value = e.target.value;
  } else {
    value = web.value; // goes back to web in case
  }

  // saving theme
  localStorage.theme = value;
  web.value = value;
  mobile.value = value;

  if (value === "system") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  } else {
    document.documentElement.setAttribute("data-theme", value);
  }
}

//when theme should run pendejo
web.addEventListener("change", updateTheme);
mobile.addEventListener("change", updateTheme);

updateTheme();

