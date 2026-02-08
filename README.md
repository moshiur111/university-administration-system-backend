# University Administration System – Backend

A scalable, production-ready backend system built with **Node.js**, **TypeScript**, and **MongoDB**, following clean architecture and real-world backend engineering best practices.

---

## 📌 Overview

This project is a **University Administration System backend** designed with a strong focus on:

- clean architecture
- security
- maintainability
- real-world production patterns

It handles authentication, role-based authorization, student management, file uploads, and centralized error handling in a structured and scalable way.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (Access & Refresh Tokens)
- **Validation:** Zod
- **File Upload:** Multer + Cloudinary
- **Error Handling:** Centralized Global Error Handler
- **Architecture:** Clean architecture (Controller → Service → Model)

---

## ✨ Core Features

### 🔐 Authentication & Authorization

- JWT-based authentication (access & refresh tokens)
- Secure refresh token handling
- Role-based authorization (Admin, Student)
- Password change with automatic token invalidation
- Forgot & reset password flow

### 👨‍🎓 Student Management

- Create and manage student profiles
- Academic department & semester linkage
- Transaction-safe student creation using MongoDB sessions

### 🖼️ File Upload (Profile Image)

- Image upload using Multer
- Cloudinary integration for cloud storage
- File type and size validation
- Automatic cleanup of local files after upload

### ⚠️ Global Error Handling
- Centralized global error handling for consistent API responses

---

## 🧠 Architecture & Design Decisions

- Clean separation of concerns (routes, controllers, services)
- Business logic isolated from controllers
- Custom `AppError` for operational and business errors
- Centralized global error handler for consistency
- JWT contains minimal identity data (no sensitive information)
- Database is the source of truth for authorization
- File upload logic abstracted for future scalability

---

## 🚨 Error Handling Strategy

All application errors are handled centrally using a **global error handling middleware**.

### Error types handled:

- Request validation errors (Zod)
- Database validation & casting errors (Mongoose)
- Duplicate key errors
- File upload errors (Multer)
- Custom application errors (`AppError`)

All errors return a **consistent response format**, making frontend error handling predictable and clean.

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

```

## 📖 API Documentation

API documentation will be added in a future update.
Currently, endpoints follow RESTful conventions.

## 🔮 Future Improvements

- Rate limiting for security hardening
- Request tracing & structured logging
- Direct Cloudinary streaming (no disk storage)
- Audit logs for sensitive operations
- API documentation using Swagger/OpenAPI

## 👤 Author

**Moshiur Rahman**  
Backend Developer (Node.js, TypeScript, MongoDB)
