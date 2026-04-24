# 🏫 University Administration System – Backend

A **scalable, production-grade backend system** built with **Node.js, TypeScript, and MongoDB**, designed to power a **role-based SaaS university management platform**.

🚀 This project focuses on **real-world backend architecture**, including secure authentication, role-based authorization, file handling, and maintainable system design.

---

## 🌐 Related Frontend

👉 Frontend Repository:
https://github.com/moshiur111/university-administration-system-frontend

💡 This backend is built to support a **multi-role SaaS dashboard system**.

---

## 📌 Overview

This backend system is designed to solve real-world challenges such as:

* 🔐 Secure authentication & authorization
* 🧩 Modular and scalable architecture
* ⚙️ Clean separation of business logic
* 📦 Maintainable and production-ready codebase

It handles users, students, authentication, file uploads, and system-level error management in a structured way.

---

## ⚡ Key Highlights

* 🔐 JWT-based authentication (Access + Refresh tokens)
* 🧑‍💼 Role-based authorization (Admin, Student)
* 🧠 Clean architecture (Controller → Service → Model)
* ⚠️ Centralized global error handling
* 🖼️ File upload system with Cloudinary
* 🔄 Transaction-safe operations using MongoDB sessions
* 🧪 Input validation using Zod

---

## 🧠 Architecture Deep Dive

### 🧩 Clean Architecture

* Controllers handle request/response
* Services contain business logic
* Models manage database interaction
* Improves scalability and testability

### 🔐 Authentication Strategy

* Access token for short-lived sessions
* Refresh token for secure re-authentication
* Token invalidation on password change

### ⚙️ Authorization Design

* Role-based access control (RBAC)
* Database acts as the source of truth
* Prevents unauthorized access at service level

### ⚠️ Error Handling System

* Centralized global error middleware
* Custom `AppError` for consistent error handling
* Structured API responses for frontend predictability

### 🖼️ File Upload Strategy

* Multer handles file parsing
* Cloudinary used for scalable cloud storage
* Local files cleaned after upload

---

## 🧠 Engineering Decisions

Key decisions made during development:

* Used **Zod** for runtime validation instead of relying only on TypeScript
* Implemented **custom AppError class** for better error control
* Chose **MongoDB transactions** for safe multi-step operations
* Designed **centralized error handler** for consistent API responses
* Kept JWT payload minimal for better security

💡 These decisions reflect real-world backend engineering practices.

---

## 💼 Business Value

This backend architecture enables:

* 📈 Scalable system for multiple user roles
* 🔐 Secure authentication and session management
* ⚙️ Faster feature development with clean structure
* 🧠 Maintainable codebase for team environments

💡 This is not just an API — it’s a **foundation for scalable SaaS products**

---

## ✨ Core Features

### 🔐 Authentication & Authorization

* JWT-based authentication (Access & Refresh tokens)
* Secure refresh token handling
* Role-based access control (Admin, Student)
* Password change with token invalidation
* Forgot & reset password flow

---

### 👨‍🎓 Student Management

* Create and manage student profiles
* Academic department & semester linkage
* Transaction-safe student creation

---

### 🖼️ File Upload (Profile Image)

* Multer-based file handling
* Cloudinary cloud storage integration
* File validation (type & size)
* Automatic local file cleanup

---

### ⚠️ Global Error Handling

* Centralized error middleware
* Consistent response format
* Handles validation, database, and custom errors

---

## 🛠️ Tech Stack

* 🟢 Node.js + Express.js
* 🔷 TypeScript
* 🍃 MongoDB + Mongoose
* 🔐 JWT Authentication
* 📦 Zod (Validation)
* ☁️ Cloudinary (File Storage)
* 📤 Multer (File Upload)

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```env id="env12345"
PORT=5000
DATABASE_URL=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## ⚡ Getting Started

```bash id="start123"
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

---

## 📡 API Structure (Example)

```bash id="api123"
POST   /api/auth/login
POST   /api/auth/refresh-token
POST   /api/students/create
GET    /api/students
```

💡 Follows RESTful conventions

---

## 🔮 Future Improvements

* 🚦 Rate limiting & security hardening
* 📊 Request logging & monitoring
* 🔄 Direct Cloudinary streaming (no disk storage)
* 📜 Swagger/OpenAPI documentation
* 🧾 Audit logging for critical operations

---

## 👤 Author

**Muhammad Moshiur Rahman**

* GitHub: https://github.com/moshiur111
* LinkedIn: https://www.linkedin.com/in/moshiur111

---

## ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub!
