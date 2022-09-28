// Remove and complete icons in SVG format
var removeSVG = ' <span class="material-symbols-outlined">delete</span>';
var completeSVG = '<span class="material-symbols-outlined">task_alt</span>';

const taskTitel = document.getElementById("task-titel");
const taskAssign = document.getElementById("task-assign");
const taskSearch = document.getElementById("task-search");
const addBtn = document.getElementById("add");
const clearBtn = document.getElementById("clear-btn");
const todos = document.getElementById("todos");
const todo = document.getElementById("todo");
const done = document.getElementById("done");
clearBtn.addEventListener("click", clearSearch);
add.addEventListener("click", addTask);
taskSearch.addEventListener("keyup", filterTasks);

let tasks = [];

function getTaskFromLocalStorage() {
  let reTasks = JSON.parse(localStorage.getItem("tasks"));
  if (reTasks == null) {
    tasks = [];
  } else {
    tasks = reTasks;
  }
}

function updateLocalStorage() {
  let taskString = JSON.stringify(tasks);
  console.log(taskString);
  localStorage.setItem("tasks", taskString);
}

getTaskFromLocalStorage();
render();

function clearSearch() {
  taskSearch.value = "";
  render();
}

function filterTasks() {
  var listItem = document.querySelectorAll("li");
  let taskName = taskSearch.value.toLowerCase();
  listItem.forEach((item) => {
    let text = item.innerHTML.toLowerCase();
    let found = text.indexOf(taskName);
    if (taskName == "" || found != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}
function addTask() {
  let titel = taskTitel.value;
  let assign = taskAssign.value;
  if (titel && assign) {
    newTask = {
      titel: titel,
      assignTo: assign,
      isDone: false,
    };
    tasks.push(newTask);
  }

  taskTitel.value = "";
  taskAssign.value = "";
  taskTitel.focus();
  render();
  updateLocalStorage();
}

function toDown() {
  document.getElementsByClassName("task-delete-confirm")[0].remove();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  document.getElementsByClassName("task-delete-confirm")[0].remove();
  render();
  updateLocalStorage();
}

function deleteTaskConfirmation(index) {
  let h = window.pageYOffset;
  let hh = h + 100;

  let c = document.createElement("div");
  c.classList.add("task-delete-confirm");
  c.style.position = "absolute";

  var s = (hh += "px");
  c.style.top = s;
  c.innerHTML = `
            <div class="confirmation-content" >
                <span class="material-symbols-sharp">
                    error
                    </span>
                <p>Are you Sure?</p>
                <p>You will not be able to recover this task !</p>

            </div>
            <div class="confirm-action">
                <button onclick="toDown()"class="cancel-btn"> 
                    Cancel
                </button>
                <button onclick="deleteTask(${index})" class="confirm-btn">
                    Yes, Delete it !
                </button>
            
            </div>
    
        `;
  document.getElementById("main").prepend(c);
}

function toggleTaskCompletion(index) {
  let task = document.getElementsByTagName("li")[index];
  tasks[index].isDone = !tasks[index].isDone;
  updateLocalStorage();
  render();
}

function countTask() {
  let doneTask = 0;
  for (i of tasks) {
    if (i.isDone == true) {
      doneTask++;
    }
  }
  done.innerHTML = `${doneTask}`;
  todo.innerHTML = `${tasks.length}`;
}

function render() {
  todos.innerHTML = "";
  let index = 0;
  for (task of tasks) {
    let content = `
            <li class="${
              task.isDone ? "completed-task-list" : "uncompleted-task-list"
            }" >
                <div class="todo-item">
                    <p class="task-name">${task.titel}</p>
                    <p class="task-assignTo">${task.assignTo}</p>
                </div>
                <div class="control">
                    <button onclick="deleteTaskConfirmation(${index})"class="action-btn remove-btn"> 
                    <span class="material-symbols-sharp">
                    delete
                    </span>
                    </button>
                    ${
                      task.isDone
                        ? ` <button onclick="toggleTaskCompletion(${index})" class="action-btn uncomplete-btn">
                    <span class="material-symbols-sharp">unpublished</span>
                    </button>`
                        : `<button onclick="toggleTaskCompletion(${index})" class="action-btn complete-btn">
                    <span class="material-symbols-sharp">check_circle</span>
                    </button>`
                    }
                </div>
            </li>
        `;
    todos.innerHTML += content;
    index++;
  }
  countTask();
}
