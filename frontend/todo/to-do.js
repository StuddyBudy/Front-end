
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
      for (let i =0; i<= currentList.length; i++){
         data[currentList].splice(i);
      }
      num=0;
      save();
      renderTasks();
}


function renderTasks() {
  listTitle.textContent = currentList;
  tasksEl.innerHTML = '';
  (data[currentList] || []).forEach((task, i) => {
    const li = document.createElement('li');
    li.className = 'task' + (task.completed ? ' completed' : '');
    li.className += "bg-background-1 rounded p-2 flex justify-between hover:brightness-80";

    const text = document.createElement("span");
    text.innerText = task.text;
    text.className = "flex-1";
    li.appendChild(text);

    // Edit icon (hidden by default, shown on hover)
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✏️';
    editBtn.className = 'edit-task opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2';
    editBtn.title = 'Edit task';
    editBtn.onclick = function(e) {
      e.stopPropagation();
      // Create input for editing
      const input = document.createElement('input');
      input.type = 'text';
      input.value = task.text;
      input.className = 'bg-transparent border-b border-zinc-400 outline-none flex-1';
      input.style.minWidth = '0';
      input.onkeydown = function(ev) {
        if (ev.key === 'Enter') {
          finishEdit();
        } else if (ev.key === 'Escape') {
          li.replaceChild(text, input);
          li.replaceChild(editBtn, input.nextSibling);
        }
      };
      input.onblur = finishEdit;
      function finishEdit() {
        const newText = input.value.trim();
        if (newText) {
          task.text = newText;
          save();
          renderTasks();
        } else {
          li.replaceChild(text, input); // Don't save empty
          li.replaceChild(editBtn, input.nextSibling);
        }
      }
      li.replaceChild(input, text);
      li.replaceChild(document.createElement('span'), editBtn); // Hide edit icon while editing
      input.focus();
      input.select();
    };
    li.appendChild(editBtn);

    li.onclick = e => {
      if (e.target.classList.contains('remove-task') || e.target.classList.contains('edit-task') || e.target.tagName === 'INPUT') return;
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

