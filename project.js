
// ==========================================
// IDEA MATES - PROJECT COMPONENT LIBRARY
// Week 3: Reusable Components
// ==========================================

// 1. DEFAULT PROJECTS

const defaultProjects = [
    {
        id: 1,
        title: "AI Resume Builder",
        description: "An AI-powered platform that helps students create professional resumes.",
        category: "AI / ML",
        skills: ["Python", "Machine Learning", "HTML", "CSS"],
        teamSize: 4,
        members: 2,
        owner: "IDEA MATES Team"
    },
    {
        id: 2,
        title: "Campus Connect",
        description: "A platform that connects college students through events, communities and projects.",
        category: "Web Development",
        skills: ["HTML", "CSS", "JavaScript", "MySQL"],
        teamSize: 5,
        members: 3,
        owner: "Student Developer"
    },
    {
        id: 3,
        title: "Smart Expense Tracker",
        description: "A mobile application to track expenses and manage personal budgets.",
        category: "App Development",
        skills: ["Java", "Firebase", "UI Design"],
        teamSize: 3,
        members: 1,
        owner: "Tech Enthusiast"
    }
];

// 2. LOAD AND SAVE PROJECTS

const STORAGE_KEY = "ideaMatesProjects";

function loadProjects() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
            const projects = JSON.parse(saved);

            if (Array.isArray(projects)) {
                return projects;
            }
        }
    } catch (error) {
        console.error("Could not load projects:", error);
    }

    return [...defaultProjects];
}

let projects = loadProjects();

function saveProjects() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
        console.error("Could not save projects:", error);
        showToast("Unable to save projects in this browser.");
    }
}

// 3. HTML ESCAPE HELPER

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

// 4. REUSABLE BUTTON COMPONENT

function Button(text, className, onClick) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = `btn ${className}`;
    button.textContent = text;

    button.addEventListener("click", onClick);

    return button;
}

// 5. REUSABLE PROJECT CARD COMPONENT

function ProjectCard(project) {
    const card = document.createElement("article");

    card.className = "project-card";

    const skills = Array.isArray(project.skills)
        ? project.skills
        : [];

    card.innerHTML = `
        <span class="card-category">
            ${escapeHTML(project.category)}
        </span>

        <h3>${escapeHTML(project.title)}</h3>

        <p>${escapeHTML(project.description)}</p>

        <div class="skills">
            ${skills.map(skill => `
                <span class="skill">${escapeHTML(skill)}</span>
            `).join("")}
        </div>

        <div class="card-footer">

            <span class="team-size">
                ${Number(project.members) || 0}/${Number(project.teamSize) || 1}
                Members
            </span>

            <div class="card-actions">
                <button class="btn btn-outline btn-small view-btn">
                    View
                </button>

                <button class="btn btn-primary btn-small join-btn">
                    Join
                </button>
            </div>

        </div>
    `;

    card.querySelector(".view-btn").addEventListener("click", () => {
        viewProject(project.id);
    });

    card.querySelector(".join-btn").addEventListener("click", () => {
        joinProject(project.id);
    });

    return card;
}

// 6. RENDER PROJECTS

function renderProjects() {
    const projectGrid = document.getElementById("projectGrid");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const projectCount = document.getElementById("projectCount");

    if (!projectGrid) {
        console.error("Project grid element not found.");
        return;
    }

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    const filteredProjects = projects.filter(project => {
        const title = String(project.title || "").toLowerCase();
        const description = String(project.description || "").toLowerCase();
        const skills = Array.isArray(project.skills)
            ? project.skills.join(" ").toLowerCase()
            : "";

        const matchesSearch =
            title.includes(searchText) ||
            description.includes(searchText) ||
            skills.includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            project.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    projectGrid.innerHTML = "";

    if (filteredProjects.length === 0) {
        projectGrid.innerHTML = `
            <div class="empty-state">
                <h3>No projects found!</h3>
                <p>Try another search or create a new project.</p>
            </div>
        `;
    } else {
        filteredProjects.forEach(project => {
            projectGrid.appendChild(ProjectCard(project));
        });
    }

    if (projectCount) {
        projectCount.textContent =
            `${filteredProjects.length} Projects`;
    }
}

// 7. REUSABLE MODAL COMPONENT

function Modal(title, content, buttons = []) {
    const overlay = document.getElementById("modalOverlay");

    document.getElementById("modalTitle").textContent = title;

    const modalContent = document.getElementById("modalContent");
    modalContent.replaceChildren();

    if (typeof content === "string") {
        modalContent.innerHTML = content;
    } else if (content instanceof Node) {
        modalContent.appendChild(content);
    }

    const actions = document.getElementById("modalActions");
    actions.replaceChildren();

    buttons.forEach(button => {
        actions.appendChild(button);
    });

    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
}

function closeModal() {
    const overlay = document.getElementById("modalOverlay");

    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
}

// 8. VIEW PROJECT DETAILS

function viewProject(projectId) {
    const project = projects.find(item => item.id === projectId);

    if (!project) return;

    const content = document.createElement("div");

    const skills = Array.isArray(project.skills)
        ? project.skills
        : [];

    content.innerHTML = `
        <p><strong>Category:</strong> ${escapeHTML(project.category)}</p>

        <p><strong>Description:</strong></p>
        <p>${escapeHTML(project.description)}</p>

        <p><strong>Required Skills:</strong></p>
        <div class="skills">
            ${skills.map(skill => `
                <span class="skill">${escapeHTML(skill)}</span>
            `).join("")}
        </div>

        <p><strong>Created by:</strong> ${escapeHTML(project.owner)}</p>

        <p><strong>Team:</strong>
            ${Number(project.members) || 0}/${Number(project.teamSize) || 1}
            members
        </p>
    `;

    Modal(
        "Project Details",
        content,
        [
            Button("Close", "btn-secondary", closeModal),
            Button("Join Project", "btn-primary", () => {
                closeModal();
                joinProject(projectId);
            })
        ]
    );
}

// 9. JOIN PROJECT DEMO

function joinProject(projectId) {
    const project = projects.find(item => item.id === projectId);

    if (!project) return;

    if (Number(project.members) >= Number(project.teamSize)) {
        showToast("Sorry! This project team is full.");
        return;
    }

    project.members = Number(project.members || 0) + 1;

    saveProjects();
    renderProjects();

    showToast("You joined the project! (Demo)");
}

// 10. CREATE PROJECT FORM

function openCreateProject() {

    const form = document.createElement("form");

    form.id = "createProjectForm";

    form.innerHTML = `
        <div class="form-group">
            <label for="projectTitle">Project Title *</label>

            <input
                type="text"
                id="projectTitle"
                name="title"
                placeholder="Enter your project name"
                required
                maxlength="60"
            >
        </div>

        <div class="form-group">
            <label for="projectDescription">Description *</label>

            <textarea
                id="projectDescription"
                name="description"
                placeholder="Describe your project idea..."
                required
                maxlength="500"
            ></textarea>
        </div>

        <div class="form-group">
            <label for="projectCategory">Category *</label>

            <select id="projectCategory" name="category" required>
                <option value="">Select category</option>
                <option value="Web Development">Web Development</option>
                <option value="AI / ML">AI / ML</option>
                <option value="App Development">App Development</option>
                <option value="Other">Other</option>
            </select>
        </div>

        <div class="form-group">
            <label for="projectSkills">Required Skills *</label>

            <input
                type="text"
                id="projectSkills"
                name="skills"
                placeholder="Python, HTML, CSS, Java..."
                required
            >
        </div>

        <div class="form-group">
            <label for="teamSize">Maximum Team Size *</label>

            <input
                type="number"
                id="teamSize"
                name="teamSize"
                min="1"
                max="20"
                value="4"
                required
            >
        </div>

        <div class="form-group">
            <label for="projectOwner">Your Name *</label>

            <input
                type="text"
                id="projectOwner"
                name="owner"
                placeholder="Enter your name"
                required
            >
        </div>
    `;

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const formData = new FormData(form);

        const newProject = {
            id: Date.now(),
            title: formData.get("title").trim(),
            description: formData.get("description").trim(),
            category: formData.get("category"),
            skills: formData.get("skills")
                .split(",")
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0),
            teamSize: Number(formData.get("teamSize")),
            members: 1,
            owner: formData.get("owner").trim()
        };

        if (newProject.skills.length === 0) {
            showToast("Please enter at least one skill.");
            return;
        }

        projects.unshift(newProject);

        saveProjects();
        renderProjects();
        closeModal();

        showToast("Your project was created successfully!");

        document.getElementById("searchInput").value = "";
        document.getElementById("categoryFilter").value = "All";

        renderProjects();

        document.getElementById("projectGrid").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    Modal(
        "Create a New Project",
        form,
        [
            Button("Cancel", "btn-secondary", closeModal),
            Button("Create Project", "btn-primary", () => {
                form.requestSubmit();
            })
        ]
    );
}

// 11. TOAST NOTIFICATION

function showToast(message) {
    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(showToast.timeout);

    showToast.timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// 12. INITIALIZE PAGE

function initializePage() {

    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");

    const createButtons = [
        "navCreate",
        "heroCreate",
        "bottomCreate"
    ];

    createButtons.forEach(id => {
        const button = document.getElementById(id);

        if (button) {
            button.addEventListener("click", openCreateProject);
        }
    });

    searchInput.addEventListener("input", renderProjects);

    categoryFilter.addEventListener("change", renderProjects);

    document.getElementById("closeModal")
        .addEventListener("click", closeModal);

    document.getElementById("modalOverlay")
        .addEventListener("click", function(event) {
            if (event.target === this) {
                closeModal();
            }
        });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    renderProjects();

    console.log("IDEA MATES loaded successfully!");
}

// 13. START APPLICATION

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePage);
} else {
    initializePage();
}
