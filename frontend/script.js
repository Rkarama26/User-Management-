
// Save and get token from localStorage
function saveToken(token) {
    localStorage.setItem("token", token);
}

function getToken() {
    return localStorage.getItem("token");
}

// Generic fetch with token
async function fetchWithToken(url, options = {}) {
    const token = getToken();
    options.headers = options.headers || {};
    if (token) {
        options.headers["Authorization"] = "bearer " + token;
    }
    const res = await fetch(url, options);
    return res.json();
}

// Show messages
function showMessage(elementId, msg, isError = true) {
    const el = document.getElementById(elementId);
    el.textContent = msg;
    el.className = isError ? "error" : "success";
}

// Logout function
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}
function toggleProfile() {
    const profileDiv = document.getElementById("profile-container");
    profileDiv.style.display = profileDiv.style.display === "none" ? "block" : "none";
}

let currentUser = null;

async function loadDashboard() {
    // Get logged-in user info
    const data = await fetchWithToken(`${API_URL}/profile`);
    if (data.error) {
        showMessage("res-msg", data.error);
        return;
    }

    currentUser = data;

    // Show in header
    document.getElementById("user-info").textContent = `Welcome, ${data.username} (${data.email})`;

    // Fill hidden profile form
    document.getElementById("profile-name").value = data.username;
    document.getElementById("profile-email").value = data.email;

    // Load resources
    await loadResources();
}

// Update profile
async function updateProfile() {
    const name = document.getElementById("profile-name").value;
    const email = document.getElementById("profile-email").value;

    const data = await fetchWithToken(`${API_URL}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
    });

    if (data.error) {
        showMessage("profile-msg", data.error);
    } else {
        showMessage("profile-msg", "Profile updated!", false);
        // Update header info
        document.getElementById("user-info").textContent = `Welcome, ${name} (${email})`;
        toggleProfile(); // hide after update
    }
}
async function loadResources() {
    let resources = await fetchWithToken(`${API_URL}/resources`);
    if (resources.error) {
        showMessage("res-msg", resources.error);
        return;
    }

    // If user is not admin, filter only own resources
    if (currentUser.role !== "admin") {
        resources = resources.filter(r => r.owner._id === currentUser.id);
    }

    // Populate table
    const tbody = document.querySelector("#res-table tbody");
    tbody.innerHTML = "";
    resources.forEach(r => {
        const tr = document.createElement("tr");

        // Check if current user can edit/delete this resource
        const canEditDelete = r.owner._id === currentUser.id || ["admin", "moderator"].includes(currentUser.role);

        tr.innerHTML = `
            <td>${r.title}</td>
            <td>${r.body}</td>
            <td>
                ${canEditDelete ? `<button onclick="editResource('${r._id}')">Edit</button>
                <button onclick="deleteResource('${r._id}')">Delete</button>` : "-"}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

//  CRUD Operations 

async function createResource() {
    const title = document.getElementById("res-title").value;
    const body = document.getElementById("res-body").value;

    const res = await fetchWithToken(`${API_URL}/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body })
    });

    if (res.error) showMessage("res-msg", res.error);
    else {
        showMessage("res-msg", "Resource created!", false);
        document.getElementById("res-title").value = "";
        document.getElementById("res-body").value = "";
        loadResources();
    }
}

async function deleteResource(id) {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    const res = await fetchWithToken(`${API_URL}/resources/${id}`, { method: "DELETE" });
    if (res.error) showMessage("res-msg", res.error);
    else {
        showMessage("res-msg", "Resource deleted!", false);
        loadResources();
    }
}

async function editResource(id) {
    const title = prompt("Enter new title:");
    const body = prompt("Enter new body:");
    if (!title && !body) return;

    const res = await fetchWithToken(`${API_URL}/resources/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body })
    });

    if (res.error) showMessage("res-msg", res.error);
    else {
        showMessage("res-msg", "Resource updated!", false);
        loadResources();
    }
}

//  Update Profile 
async function updateProfile() {
    const name = document.getElementById("profile-name").value;
    const email = document.getElementById("profile-email").value;

    const data = await fetchWithToken(`${API_URL}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
    });

    if (data.error) showMessage("profile-msg", data.error);
    else {
        showMessage("profile-msg", "Profile updated!", false);
        document.getElementById("user-info").textContent = `Welcome, ${name} (${email})`;
        toggleProfile();
    }
}

//  Init 
window.onload = () => loadDashboard();

// Bind create button
document.querySelector(".create").addEventListener("click", createResource);