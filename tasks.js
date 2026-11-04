
// Get HTML elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const errorMessage = document.getElementById("errorMessage");

const totalCount = document.getElementById("totalCount");
const activeCount = document.getElementById("activeCount");
const completedCount = document.getElementById("completedCount");

const filterButtons = document.querySelectorAll(".filter-btn");

// Load tasks from LocalStorage
let tasks = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem("ideaMatesTasks")
    );

    tasks = Array.isArray(savedTasks) ? savedTasks : [];
} catch (error) {
    console.error("Unable to load saved tasks:", error);
}

let currentFilter = "all";

// Save tasks
function saveTasks() {
    try {
        localStorage.setItem(
            "ideaMatesTasks",
            JSON.stringify(tasks)
        );
    } catch (error) {
        errorMessage.textContent = "Unable to save tasks in this browser.";
        console.error(error);
    }
}

// Update task statistics
function updateStats() {
    totalCount.textContent = tasks.length;

    activeCount.textContent =
        tasks.filter(task => !task.completed).length;

    completedCount.textContent =
        tasks.filter(task => task.completed).length;
}

// Display tasks
function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    if (filteredTasks.length === 0) {

        const emptyMessage = document.createElement("li");

        emptyMessage.className = "empty-message";

        emptyMessage.textContent =
            currentFilter === "all"
                ? "No tasks yet. Add your first task!"
                : "No tasks found in this category.";

        taskList.appendChild(emptyMessage);

    } else {

        filteredTasks.forEach(task => {

            const li = document.createElement("li");

            li.className = "task-item";

            if (task.completed) {
                li.classList.add("completed");
            }

            // Checkbox
            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.className = "task-checkbox";
            checkbox.checked = task.completed;

            checkbox.addEventListener("change", () => {

                task.completed = checkbox.checked;

                saveTasks();
                renderTasks();

            });

            // Task text
            const span = document.createElement("span");

            span.className = "task-text";
            span.textContent = task.text;

            // Delete button
            const deleteBtn = document.createElement("button");

            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";
            deleteBtn.type = "button";

            deleteBtn.addEventListener("click", () => {

                tasks = tasks.filter(item => item.id !== task.id);

                saveTasks();
                renderTasks();

            });

            li.append(checkbox, span, deleteBtn);

            taskList.appendChild(li);

        });

    }

    updateStats();
}

// Add task
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {

        errorMessage.textContent = "Please enter a task first!";
        taskInput.focus();

        return;
    }

    const newTask = {
        id: Date.now() + Math.random(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    taskInput.value = "";

    errorMessage.textContent = "";

    saveTasks();

    renderTasks();

    taskInput.focus();
}

// Add button event
addTaskBtn.addEventListener("click", addTask);

// Enter key event
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});

// Filter buttons
filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        currentFilter = this.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        renderTasks();

    });

});

// Initial display
renderTasks();
