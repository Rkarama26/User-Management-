# Backend - RBAC Resource Manager

## 1. Project Overview
The backend provides a **RESTful API** for a Role-Based Access Control (RBAC) system.  
Users can register, log in, and perform CRUD operations on resources depending on their role (admin, moderator, user).  
JWT is used for authentication, and middleware ensures proper role-based access.

**Features:**
- User registration and login with JWT  
- Role-based access control (admin, moderator, user)  
- Protected CRUD routes for resources  
- User profile management  
- MongoDB Atlas for database storage  

---

## 2. Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas, Mongoose  
- **Authentication:** JWT  
- **Middleware:** CORS, body-parser, input validation  

---

## 3. Folder Structure

```text
backend/
│
├─ config/
│   └─ db.config.js         # MongoDB connection
├─ middlewares/
│   └─ auth.middleware.js   # JWT auth & RBAC
├─ models/
│   ├─ User.model.js
│   └─ Resource.model.js
├─ routes/
│   ├─ auth.routes.js
│   ├─ user.routes.js
│   ├─ profile.routes.js
│   └─ resource.routes.js
├─ .env.exmaple                     # environment variables
├─ package.json
└─ index.js                 # server entry point

```
## Environment variables 

 - PORT="port number"
 - MONGO_URI="<your db>"
 - JWT_SECRET_KEY=your_jwt_secret_here
