// Multi-list To-Do App
const listsEl = document.getElementById('lists');
const addListBtn = document.getElementById('add-list-btn');
const clearButt = document.getElementById("clear-all-btn")
const listTitle = document.getElementById('list-title');
const addTaskForm = document.getElementById('add-task-form');
const taskInput = document.getElementById('task-input');
const tasksEl = document.getElementById('tasks');

// Data structure: { listName: [ {text, completed} ] }
let data = JSON.parse(localStorage.getItem('todo-multilist')) || { 'My List': [] };
let currentList = Object.keys(data)[0];


// Initial render
renderLists();
renderTasks();



function save() {
  localStorage.setItem('todo-multilist', JSON.stringify(data));
}

function renderLists() {
  listsEl.innerHTML = '';
  Object.keys(data).forEach(list => {
    const div = document.createElement('div');
    div.className = 'list-item' + (list === currentList ? ' selected' : '');
    div.textContent = list;
    div.onclick = () => {
      currentList = list;
      renderLists();
      renderTasks();
    };
    if (Object.keys(data).length > 1) {
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-list';
      removeBtn.textContent = '✕';
      removeBtn.onclick = e => {
        e.stopPropagation();
        if (confirm(`Delete list "${list}"?`)) {
          delete data[list];
          if (currentList === list) currentList = Object.keys(data)[0];
          save();
          renderLists();
          renderTasks();
        }
      };
      div.appendChild(removeBtn);
    }
    listsEl.appendChild(div);
  });
}

addListBtn.onclick = () => {
  let name = prompt('New list name?');
  if (!name) return;
  name = name.trim();
  if (!name || data[name]) return alert('Invalid or duplicate name.');
  data[name] = [];
  currentList = name;
  save();
  renderLists();
  renderTasks();
}
clearButt.onclick = () => {
   console.log("current list: "+currentList);
      for (let i =0; i<= currentList.length; i++){
         data[currentList].splice(i);
      }
      save();
      renderTasks();
}

function renderTasks() {
  listTitle.textContent = currentList;
  tasksEl.innerHTML = '';
  (data[currentList] || []).forEach((task, i) => {
    const li = document.createElement('li');
    li.className = 'task' + (task.completed ? ' completed' : '');
    li.textContent = task.text;
    li.onclick = e => {
      if (e.target.classList.contains('remove-task')) return;
      task.completed = !task.completed;
      save();
      renderTasks();
    };
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-task';
    removeBtn.textContent = '✕';
    removeBtn.onclick = e => {
      e.stopPropagation();
      data[currentList].splice(i, 1);
      save();
      renderTasks();
    };
    li.appendChild(removeBtn);
    tasksEl.appendChild(li);
  });
}

var num=0;

addTaskForm.onsubmit = e => {
  e.preventDefault();
  num++;
  const text = num+") "+taskInput.value.trim();
  if (!text) return;
  data[currentList].push({ text, completed: false });
  taskInput.value = '';
  save();
  renderTasks();
};

