// LocalStorage se saved tasks retrieve karna
let tasks = JSON.parse(localStorage.getItem('professional_tasks')) || [];
let currentFilter = 'all';

// DOM Elements Selection
const todoForm = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const prioritySelect = document.getElementById('prioritySelect');
const searchInput = document.getElementById('searchInput');
const taskList = document.getElementById('taskList');
const taskStats = document.getElementById('taskStats');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// LocalStorage me Save karna
function saveTasks() {
  localStorage.setItem('professional_tasks', JSON.stringify(tasks));
  renderTasks();
}

// Naya Task Add karna
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.unshift({
    id: Date.now(),
    text: text,
    category: categorySelect.value,
    priority: prioritySelect.value,
    completed: false
  });

  taskInput.value = '';
  saveTasks();
});

// Task Completion Toggle karna
function toggleTask(id) {
  tasks = tasks.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
}

// Task Delete karna
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
}

// Completed Tasks Delete karna
clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
});

// Filter Change karna
document.getElementById('filter-all').addEventListener('click', () => setFilter('all'));
document.getElementById('filter-active').addEventListener('click', () => setFilter('active'));
document.getElementById('filter-completed').addEventListener('click', () => setFilter('completed'));

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`filter-${filter}`).classList.add('active');
  renderTasks();
}

// Search Input Listener
searchInput.addEventListener('input', renderTasks);

// Tasks to UI par Render/Draw karna
function renderTasks() {
  taskList.innerHTML = '';
  const query = searchInput.value.toLowerCase().trim();

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(query);
    if (currentFilter === 'active') return !task.completed && matchesSearch;
    if (currentFilter === 'completed') return task.completed && matchesSearch;
    return matchesSearch;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
      <li class="empty-state">
        <i class="fa-regular fa-folder-open"></i>
        No tasks found.
      </li>`;
  } else {
    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;

      const categoryClass = task.category === 'Work' ? 'badge-work' : 'badge-personal';
      const priorityClass = `badge-${task.priority.toLowerCase()}`;

      li.innerHTML = `
        <div class="task-left">
          <button onclick="toggleTask(${task.id})" class="check-btn">
            <i class="${task.completed ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}"></i>
          </button>
          <span class="task-text">${task.text}</span>
        </div>
        
        <div class="task-right">
          <span class="badge ${categoryClass}">${task.category}</span>
          <span class="badge ${priorityClass}">${task.priority}</span>
          <button onclick="deleteTask(${task.id})" class="delete-btn">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      `;
      taskList.appendChild(li);
    });
  }

  // Update Stats Counter
  const completedCount = tasks.filter(t => t.completed).length;
  taskStats.textContent = `${completedCount} / ${tasks.length} Completed`;
}

// Initial Load
renderTasks();