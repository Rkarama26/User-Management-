
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
        options.headers["Authorization"] = "Bearer " + token;
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
    try {
        let resources = await fetchWithToken(`${API_URL}/resources`);
        console.log("Fetched resources:", resources);

        if (!Array.isArray(resources)) {
            showMessage("res-msg", "Unexpected response format");
            return;
        }

        // Filter if user is not admin
        if (currentUser.role !== "admin") {
            resources = resources.filter(r => r.owner && r.owner._id === currentUser._id);
        }

        const tbody = document.querySelector("#res-table tbody");
        tbody.innerHTML = "";

        if (resources.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No resources found</td></tr>`;
            return;
        }

        resources.forEach(r => {
            const ownerEmail = r.owner?.email || "Unknown";
            const canEditDelete =
                r.owner && (r.owner._id === currentUser._id || ["admin", "moderator"].includes(currentUser.role));

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${r.title}</td>
                <td>${r.body}</td>
                <td>${ownerEmail}</td>
                <td>
                    ${canEditDelete
                        ? `<button onclick="editResource('${r._id}')">Edit</button>
                           <button onclick="deleteResource('${r._id}')">Delete</button>`
                        : "-"
                    }
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error loading resources:", error);
        showMessage("res-msg", "Failed to load resources");
    }
}


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

