cal\main.js

const cal = document.getElementById("cal");
const todos = document.getElementById("todos");
const curr = document.getElementById("curr");
const btns = document.getElementById("btns");
const panel = document.getElementById("panel");

const eventQueue = [];

let month = new Date().getMonth();
let year = new Date().getFullYear();

function renderCal(month, year) {
  cal.replaceChildren();

  [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ].forEach((element) => {
    const day = document.createElement("span");
    day.className = "p-2 font-bold text-center border-b";
    day.innerText = element;
    cal.appendChild(day);
  });

  const first = new Date(year, month, 1);
  for (let i = 0; i < first.getDay(); i++) {
    const dull = document.createElement("div");
    dull.className = "p-2 aspect-square shadow opacity-80";
    cal.appendChild(dull);
  }

  const last = new Date(year, month + 1, 0);
  for (let i = 1; i < last.getDate() + 1; i++) {
    const date = document.createElement("div");
    date.className = "p-2 aspect-square shadow";
    date.innerText = i;
    date.addEventListener("click", () => {
      const event = window.prompt("Event: ");
      const eventEl = document.createElement("div");
      eventEl.className = "p-2 rounded shadow";
      eventEl.innerText = event;

      // eventQueue.push({ contents: "", func: () => {} });

      eventEl.addEventListener("click", (e) => {
        e.stopPropagation();
        panel.classList.remove("hidden");
        panel.parentElement.classList.add("grid-cols-[20%_1fr]");
        panel.innerHTML = `<h1 class="font-bold text-2xl text-center">${eventEl.innerText}</h1>`;
      });

      date.appendChild(eventEl);
    });
    cal.appendChild(date);
  }

  curr.innerText =
    new Intl.DateTimeFormat("en-US", { month: "long" }).format(first) +
    " " +
    first.getFullYear();
}

renderCal(month, year);

btns.children[0].addEventListener("click", () => {
  if (month === 0) {
    month = 11;
    year--;
  } else {
    month--;
  }
  renderCal(month, year);
});
btns.children[1].addEventListener("click", () => {
  if (month === 11) {
    month = 0;
    year++;
  } else {
    month++;
  }
  renderCal(month, year);
});
