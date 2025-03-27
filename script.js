// Henter elementer fra HTML
const taskInput = document.getElementById("taskInput");
const taskForm = document.getElementById("taskForm");
const listContainer = document.getElementById("listContainer");
const showCompletedCheckbox = document.getElementById("showCompleted");
const sortBySelect = document.getElementById("sort-by");

// Lager et objekt for filtrering og en tom liste for oppgaver
let filters = { showCompleted: false, sortBy: "time-desc" };
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
        showCompletedCheckbox.checked = filters.showCompleted;
        sortBySelect.value = filters.sortBy; // Setter select til lagret verdi
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
    event.preventDefault();

    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const newTask = {
        id: Date.now(),
        description: taskText,
        completed: false,
        timestamp: new Date().getTime(), // Lagrer som timestamp for enklere sortering
    };

    tasks.push(newTask);
    saveTaskToStorage();
    renderPage();
    taskInput.value = "";
};

// Filtrerer oppgaver basert på `filters.showCompleted`
const filterArray = (taskArr) => {
    return taskArr.filter((task) => filters.showCompleted || !task.completed);
};

// Sorterer oppgaver basert på valgt sorteringsmetode
const sortTasks = (taskArr) => {
    return taskArr.sort((a, b) => {
        if (filters.sortBy === "time-desc") {
            return b.timestamp - a.timestamp;
        } else if (filters.sortBy === "time-asc") {
            return a.timestamp - b.timestamp;
        } else if (filters.sortBy === "alpha-desc") {
            return b.description.localeCompare(a.description);
        } else if (filters.sortBy === "alpha-asc") {
            return a.description.localeCompare(b.description);
        }
    });
};

// Bygger HTML for hver oppgave
const buildPage = (task) => {
    const taskContainer = document.createElement("li");
    taskContainer.classList.add("task-item");
    if (task.completed) {
        taskContainer.classList.add("completed");
    }

    const timeStampElement = document.createElement("span");
    timeStampElement.textContent = `[${new Date(task.timestamp).toLocaleString()}] `;

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

// Oppdaterer siden basert på sortering og filtrering
const renderPage = () => {
    listContainer.innerHTML = "";
    const filteredTasks = filterArray(tasks);
    const sortedTasks = sortTasks(filteredTasks);
    sortedTasks.forEach(buildPage);
};

// Eventlistener for checkbox som viser/skjuler fullførte oppgaver
showCompletedCheckbox.addEventListener("change", () => {
    filters.showCompleted = showCompletedCheckbox.checked;
    saveFiltersToStorage();
    renderPage();
});

// Eventlistener for sorteringsvalg
sortBySelect.addEventListener("change", (e) => {
    filters.sortBy = e.target.value;
    saveFiltersToStorage();
    renderPage();
});

// Laster data og klargjør event listeners
loadFromStorage();
taskForm.addEventListener("submit", addTodoHandler);
renderPage();
