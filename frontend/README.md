# User Management Frontend

## Project Overview
This is the **frontend** for the User Management system.  
It allows users to:
- Register and log in
- View and edit their profile
- Create, edit, and delete resources
- Admins and moderators have special privileges to manage all resources

The frontend communicates with a backend API hosted on Render using **JWT authentication**.

---

## Features
- User authentication (login/register)
- JWT-based session management
- Profile update
- Resource management (CRUD)
- Role-based access (user, moderator, admin)
- Responsive UI

---

## Tech Stack
- **HTML** – Structure of pages
- **CSS** – Styling and responsive layout
- **JavaScript** – Logic for fetching API data and DOM manipulation
- **LocalStorage** – Store JWT tokens

---

## Folder Structure

```text
frontend/
│
├── index.html # Login page
├── register.html # Registration page
├── dashboard.html # Dashboard to manage resources
├── style.css # Global styles
├── script.js # Main JavaScript logic
└── config.js # API URL and config

```

---

## Setup Instructions

1. Clone the repository:
```bash
git clone <frontend-repo-url>
cd frontend
const API_URL = "https://user-management-j8gz.onrender.com";

```