// Henter elementene fra HTML
const taskInput = document.getElementById("taskInput");
const taskForm = document.getElementById("taskForm");
const listContainer = document.getElementById("listContainer");

// Lager et objekt for filtrering og en tom liste for oppgaver
let filters = { showCompleted: false };
let tasks = [];

// Laster lagrede oppgaver og filtre fra LocalStorage
const loadFromStorage = () => {
    const storedTasks = localStorage.getItem("tasks");
    const storedFilters = localStorage.getItem("filters");

    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }

    if (storedFilters) {
        filters = JSON.parse(storedFilters);
    }
};

// Lagrer oppgaver i LocalStorage
const saveTaskToStorage = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Lagrer filter-innstillinger i LocalStorage
const saveFiltersToStorage = () => {
    localStorage.setItem("filters", JSON.stringify(filters));
};

// Legger til en ny oppgave
const addTodoHandler = (event) => {
    event.preventDefault(); // Hindrer siden fra å laste på nytt

    const taskText = taskInput.value.trim();
    if (taskText === "") return; // Stopper hvis input er tom

    const newTask = {
        id: Date.now(), // Unik ID basert på tidspunkt
        description: taskText,
        completed: false,
        timestamp: new Date().toLocaleString(), // Legger til tidsstempel
    };

    tasks.push(newTask);
    saveTaskToStorage();
    renderPage();

    taskInput.value = ""; // Nullstiller input-feltet
};

// Filtrerer oppgaver basert på `filters.showCompleted`
const filterArray = (taskArr) => {
    return taskArr.filter((task) => filters.showCompleted || !task.completed);
};

// Bygger HTML for hver oppgave
const buildPage = (task) => {
    const taskContainer = document.createElement("li");
    taskContainer.classList.add("task-item");

    const timeStampElement = document.createElement("span");
    timeStampElement.textContent = `[${task.timestamp}] `;

    const descriptionElement = document.createElement("span");
    descriptionElement.textContent = task.description;

    const completeInput = document.createElement("input");
    completeInput.type = "checkbox";
    completeInput.checked = task.completed;
    completeInput.addEventListener("change", () => {
        task.completed = completeInput.checked;
        saveTaskToStorage();
        renderPage();
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Slett";
    deleteButton.addEventListener("click", () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        saveTaskToStorage();
        renderPage();
    });

    taskContainer.appendChild(completeInput);
    taskContainer.appendChild(timeStampElement);
    taskContainer.appendChild(descriptionElement);
    taskContainer.appendChild(deleteButton);

    listContainer.appendChild(taskContainer);
};

// Rendersiden basert på lagrede oppgaver og filter
const renderPage = () => {
    listContainer.innerHTML = ""; // Nullstiller listen

    const filteredTasks = filterArray(tasks);
    filteredTasks.forEach(buildPage);
};

// Laster data og klargjør event listeners
loadFromStorage();
taskForm.addEventListener("submit", addTodoHandler);
renderPage();
