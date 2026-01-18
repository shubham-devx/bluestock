🚀 Company Registration & Verification Module

A full-stack application that allows users to register, authenticate, verify identity, and manage company profiles, built as part of an internship warm-up assignment.

This project demonstrates real-world backend + frontend integration, secure authentication, and clean UI workflows.

⸻

📌 Project Objective

The goal of this project is to build a secure company onboarding system where:
	•	Users register and log in securely
	•	Authentication is handled via Firebase + JWT
	•	Users can create and manage a company profile
	•	Verification status (email & mobile) is clearly visible
	•	APIs are protected and scalable

⸻

🧱 Tech Stack Used

Frontend
	•	React.js (Vite)
	•	Firebase Authentication (Email/Password)
	•	Axios
	•	React Router
	•	Plain CSS (inline styling)
	•	JWT decoding for user session

Backend
	•	Node.js
	•	Express.js
	•	PostgreSQL
	•	Firebase Admin SDK
	•	JWT (JSON Web Tokens)
	•	bcrypt (password hashing)
	•	CORS & dotenv

Database
	•	PostgreSQL 15
	•	Two main tables:
	•	users
	•	company_profile

⸻

🗂️ Project Structure

Backend

backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── companyController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── companyRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── firebaseAuthMiddleware.js
│   ├── config/
│   │   ├── db.js
│   │   └── firebase.js
│   ├── app.js
│   └── server.js
└── .env

Frontend

frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── CompanyProfile.jsx
│   ├── firebase.js
│   ├── App.jsx
│   └── main.jsx
└── .env


⸻

🔐 Authentication Flow

Registration
	1.	User registers using Firebase Authentication
	2.	Password is also hashed and stored in PostgreSQL (assignment requirement)
	3.	User record is created in the users table

Login
	1.	User logs in using Firebase (email & password)
	2.	Firebase returns an ID token
	3.	Backend verifies Firebase token
	4.	Backend generates a JWT (90 days)
	5.	JWT is stored in frontend (localStorage)

⸻

🧾 Company Profile Flow
	•	After login, user navigates to Dashboard
	•	User can:
	•	Create company profile (first time)
	•	Update company profile (later)
	•	Company profile is linked using user_id
	•	Only one company per user

⸻

📊 Dashboard Features
	•	Shows logged-in user details (decoded JWT)
	•	Shows verification status badges
	•	Email Verified
	•	Mobile Verification (planned)
	•	Navigation to:
	•	Company Profile
	•	Logout

⸻

🔒 Security Measures Implemented
	•	JWT-based route protection
	•	Firebase token verification
	•	Password hashing using bcrypt
	•	Protected company APIs
	•	Environment variables for secrets
	•	CORS enabled with restricted origin

⸻

🧪 API Endpoints

Auth APIs

Method	Endpoint	Description
POST	/register	Register user
POST	/firebase-login	Firebase login → JWT
GET	/profile	Get logged-in user

Company APIs

Method	Endpoint	Description
POST	/company/profile	Create company
GET	/company/profile	Get company
PUT	/company/profile	Update company

(All company routes are JWT protected)

⸻

⚠️ Current Limitations (Planned Enhancements)
	•	Mobile OTP verification UI (Firebase SMS)
	•	Email verification link handling
	•	Image upload (Cloudinary)
	•	Redux Toolkit integration
	•	Multi-step company form
	•	Unit testing

These are intentionally left as future scope and clearly explained during presentation.