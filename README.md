
# 🚀 Company Profile Management System

A **full-stack web application** that implements **secure user authentication**, **JWT-based authorization**, and **company profile management**.
Built as part of an **Internship Warm-up Assignment** to demonstrate real-world backend and frontend integration.

---

## ✨ Features

### 🔐 Authentication

* User registration with **hashed passwords** (bcrypt)
* User login with **JWT access tokens**
* Secure logout by clearing stored tokens
* Protected routes on both **backend & frontend**

### 👤 User Management

* JWT payload contains authenticated user identity (`userId`, `email`)
* Logged-in user details decoded and displayed on frontend

### 🏢 Company Profile

* Create company profile (one profile per user)
* Fetch logged-in user’s company profile
* Update existing company profile
* Proper REST behavior:

  * `404` when profile does not exist
  * `401 / 403` for unauthorized access

### 🛡 Security Practices

* Password hashing with bcrypt
* JWT verification middleware
* Authorization via `Bearer <token>`
* Route-level access protection

---

## 🧱 Tech Stack

### Backend

* Node.js
* Express.js
* PostgreSQL
* JWT (jsonwebtoken)
* bcrypt
* dotenv
* cors

### Frontend

* React (Vite)
* React Router
* Axios
* jwt-decode

---

## 📁 Project Structure

### Backend

```text
backend/
│── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── companyController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── companyRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── config/
│   │   └── db.js
│   ├── app.js
│   └── server.js
│── .env
│── package.json
```

### Frontend

```text
frontend/
│── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CompanyProfile.jsx
│   │   └── ProtectedRoute.jsx
│   ├── App.jsx
│   └── main.jsx
│── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/company_db
JWT_ACCESS_SECRET=your_secret_key
```

---

## 🗄 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Company Profiles Table

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

## 🔗 API Endpoints

### Authentication

| Method | Endpoint    | Description                |
| ------ | ----------- | -------------------------- |
| POST   | `/register` | Register new user          |
| POST   | `/login`    | Login user and receive JWT |

### Company Profile (Protected)

| Method | Endpoint           | Description                  |
| ------ | ------------------ | ---------------------------- |
| POST   | `/company/profile` | Create company profile       |
| GET    | `/company/profile` | Get logged-in user’s company |
| PUT    | `/company/profile` | Update company profile       |

---

## 🔐 JWT Authentication Flow

1. User logs in
2. Backend generates JWT containing:

   ```json
   {
     "userId": 1,
     "email": "user@example.com"
   }
   ```
3. Frontend stores token in `localStorage`
4. Token sent in every protected request:

   ```
   Authorization: Bearer <token>
   ```
5. Backend middleware verifies token
6. Controllers use `req.user.userId`

---

## 🖥 Frontend Flow

* Login → Dashboard
* Dashboard displays logged-in user information
* Dashboard → Company Profile

  * No profile → Create mode
  * Existing profile → Edit mode
* Logout clears token and blocks protected routes

---

## ▶️ Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

* Frontend: `http://localhost:5173`
* Backend: `http://localhost:5000`

---

## 🧪 Key Learnings

* JWT-based authentication & authorization
* Middleware-driven backend security
* RESTful API design
* Frontend–backend integration
* Error handling with correct HTTP status codes
* Real-world auth and profile workflows

---

## 🚧 Future Enhancements

* Company logo upload
* Refresh token mechanism
* Role-based access control
* UI improvements (Tailwind / Material UI)
* Deployment (Render / Railway)

---

## 👨‍💻 Author

**Shubham Verma**
Full-Stack Developer 

Just tell me 👌

