const todos = document.getElementById("todos");
const todo = document.getElementById("todo");
const progress = document.getElementById("progress");
const todoList = [];

const basis = document.createElement("li");
basis.className =
  "flex justify-between p-2 my-1 w-full text-xl break-all rounded border shadow";
const delBtnBase = document.createElement("button");
delBtnBase.className = "w-4 text-red-800 dark:text-red-300 aspect-square";

todo.addEventListener("keyup", (k) => {
  if (k.key === "Enter") {
    if (todo.value === "") {
      return;
    }
    createTodo({ text: todo.value, clicked: false });
    todo.value = "";
  }
});

function updateList() {
  localStorage.setItem("todos", JSON.stringify(todoList));

  let perc = (
    (todos.querySelectorAll(".opacity-50").length / todos.children.length) *
    100
  ).toFixed(0);

  if (perc === "NaN") {
    progress.style.width = "100%";
    progress.innerText = "100%";
  } else {
    progress.style.width = perc + "%";
    progress.innerText = perc + "%";
  }
}

function createTodo(todo) {
  const div = basis.cloneNode();
  const span = document.createElement("span");
  span.innerText = todo.text;
  div.appendChild(span);
  const del = delBtnBase.cloneNode();
  del.addEventListener("click", () => {
    removeTodo(div);
  });
  del.innerText = "X";
  div.appendChild(del);
  todos.appendChild(div);
  const idx = todos.children.length - 1;
  div.addEventListener("click", () => {
    div.classList.toggle("line-through");
    div.classList.toggle("decoration-4");
    div.classList.toggle("opacity-50");
    for (let i = 0; i < todoList.length; i++) {
      if (todoList[i].div === div) {
        todoList[i].clicked = !todoList[i].clicked;
      }
    }
    updateList();
  });
  todo.div = div;
  todoList.push(todo);
  if (todo.clicked) {
    div.classList.toggle("line-through");
    div.classList.toggle("decoration-4");
    div.classList.toggle("opacity-50");
  }
  updateList();
}

function removeTodo(div) {
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].div === div) {
      todos.removeChild(div);
      todoList.splice(i, 1);
      return;
    }
  }
}

JSON.parse(localStorage.getItem("todos")).forEach((element) => {
  createTodo(element);
});
