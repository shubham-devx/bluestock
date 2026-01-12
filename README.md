
## 📌 Problem Statement

Build a secure backend system that allows users to **register, authenticate, and manage a single company profile** using **JWT-based authentication** and **PostgreSQL**, while maintaining proper **relational integrity** and **access control**.

---

## 🚀 Overview

This project is a **Node.js + Express backend API** implementing **JWT authentication** and a **Company Profile management system**.
Each authenticated user can create, view, and update **exactly one company profile**.

The project follows **industry-standard backend practices** such as protected routes, foreign key constraints, and modular architecture.

---

## ✨ Features

* User Registration & Login
* Password hashing using **bcrypt**
* JWT-based Authentication
* Protected API routes using middleware
* **One Company Profile per User (business rule enforced)**
* Create / Get / Update Company Profile
* PostgreSQL with foreign key constraints
* Clean and modular project structure

---

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **PostgreSQL**
* **jsonwebtoken (JWT)**
* **bcrypt**
* **pg**
* **dotenv**

---

## 📁 Project Structure

```
backend/
│
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── companyController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── companyRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000

DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=company_db
DB_PORT=5432

JWT_ACCESS_SECRET=your_super_secret_key
```

---

## 🗄️ Database Schema

### `users` table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL
);
```

### `company_profiles` table

```sql
CREATE TABLE company_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(150) NOT NULL,
  website TEXT,
  description TEXT
);
```

---

## ▶️ How to Run the Project

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Start the server

```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

## 🔐 Authentication APIs

### Register User

```
POST /auth/register
```

**Request Body**

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "john123"
}
```

---

### Login User

```
POST /auth/login
```

**Request Body**

```json
{
  "email": "john@example.com",
  "password": "john123"
}
```

**Response**

```json
{
  "token": "JWT_ACCESS_TOKEN"
}
```

---

## 🏢 Company Profile APIs (Protected)

> All company APIs require JWT authentication using the header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

### Create Company Profile

```
POST /company/profile
```

```json
{
  "company_name": "TechNova Pvt Ltd",
  "website": "https://technova.com",
  "description": "Software solutions company"
}
```

📌 **Rule enforced:** One company profile per user.

---

### Get Company Profile

```
GET /company/profile
```

Returns the company profile of the logged-in user.

---

### Update Company Profile

```
PUT /company/profile
```

```json
{
  "company_name": "TechNova Pvt Ltd (Updated)",
  "website": "https://technova.io",
  "description": "Updated description"
}
```

---

## 🔐 Authentication & Security Flow

1. User registers
2. User logs in and receives a JWT access token
3. Token is sent in the `Authorization` header (Bearer scheme)
4. Middleware validates the token
5. User identity is extracted from the token (`req.user.id`)
6. User-specific data is accessed securely

> **User IDs are never sent from the client.**

---

## 📡 HTTP Status Codes Used

* **201** – Resource created
* **200** – Success
* **400** – Bad request / validation error
* **401** – Unauthorized (missing token)
* **404** – Resource not found
* **409** – Conflict (company already exists)
* **500** – Internal server error

---

## 🧠 Key Design Decisions

* JWT authentication instead of sessions
* Foreign keys to enforce relational integrity
* One-to-one relationship between User and Company
* Modular MVC-style folder structure
* Secure, token-based user identification

---

## ✅ Completed Milestones

* [x] User Authentication
* [x] JWT Middleware
* [x] Company Profile CRUD
* [x] One Company per User rule
* [x] PostgreSQL Foreign Key Constraints
* [x] Clean API structure

---

## 🔜 Future Improvements

* Refresh token implementation
* Role-based access control (Admin/User)
* Input validation using Joi/Zod
* Rate limiting and security headers
* Deployment to cloud (Render / Railway)

---

## 👨‍💻 Author

**Shubham verma**
Backend Developer 

---



