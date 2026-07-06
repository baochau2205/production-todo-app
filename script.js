const state = {
  todos: loadTodos(),
  filter: "all"
};

const input = document.getElementById("input");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");
const empty = document.getElementById("empty");
const filterBtns = document.querySelectorAll(".filters button");

init();

function init() {
  bindEvents();
  render();
}

function bindEvents() {
  addBtn.addEventListener("click", handleAdd);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleAdd();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      setFilter(btn.dataset.filter);
    });
  });

  list.addEventListener("click", handleListClick);
}

function handleAdd() {
  const text = input.value.trim();
  if (!text) return;

  state.todos.push(createTodo(text));
  input.value = "";

  saveTodos();
  render();
}

function handleListClick(e) {
  const id = Number(e.target.dataset.id);
  const action = e.target.dataset.action;

  if (!id || !action) return;

  if (action === "toggle") toggleTodo(id);
  if (action === "delete") deleteTodo(id);
}

function toggleTodo(id) {
  state.todos = state.todos.map(t =>
    t.id === id ? { ...t, done: !t.done } : t
  );

  saveTodos();
  render();
}

function deleteTodo(id) {
  state.todos = state.todos.filter(t => t.id !== id);

  saveTodos();
  render();
}

function setFilter(value) {
  state.filter = value;

  filterBtns.forEach(b => b.classList.remove("active"));
  document
    .querySelector(`[data-filter="${value}"]`)
    .classList.add("active");

  render();
}

function render() {
  const todos = getFilteredTodos();

  list.innerHTML = "";

  empty.style.display = todos.length ? "none" : "block";

  todos.forEach(todo => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="${todo.done ? "done" : ""}">
        ${todo.text}
      </span>

      <div>
        <button data-action="toggle" data-id="${todo.id}">
          ✓
        </button>
        <button data-action="delete" data-id="${todo.id}">
          X
        </button>
      </div>
    `;

    list.appendChild(li);
  });
}

function createTodo(text) {
  return {
    id: Date.now(),
    text,
    done: false
  };
}

function getFilteredTodos() {
  if (state.filter === "active")
    return state.todos.filter(t => !t.done);

  if (state.filter === "done")
    return state.todos.filter(t => t.done);

  return state.todos;
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(state.todos));
}

function loadTodos() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}