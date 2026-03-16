# 🔐 Password Hub — Secure Password Manager

<div align="center">

🛡 **Secure • Smart • Simple**

A modern **full-stack password manager** that securely stores and manages your credentials with **encryption, OAuth login, and two-factor authentication**.

🚀 Built using **React, Node.js, Express, and MongoDB**

</div>

---

# 📦 Overview

Password Hub is a **secure password management application** that allows users to safely store, organize, and manage their passwords in one place.

It implements **industry-standard security practices** including:

🔐 Encrypted password storage  
🛡 Two-Factor Authentication (2FA)  
🌐 OAuth login (Google, Microsoft, GitHub)  
📧 Email recovery system  
📊 Password strength monitoring  

This project demonstrates a **production-level full-stack application architecture** suitable for real-world deployment.

---

# ✨ Features

## 🔑 Authentication
- 🔐 Secure login & registration
- 🌐 OAuth login with:
  - Google
  - Microsoft
  - GitHub
- 🛡 JWT Authentication
- 🔒 Encrypted passwords using hashing

---

## 🛡 Security Features

- 🔐 Two-Factor Authentication (Google Authenticator)
- 🔄 2FA recovery via email
- 📧 Forgot password email system
- 🔑 Password reset with secure token
- 🚫 Permanent account deletion
- ⏳ Auto-lock timer for inactivity

---

## 🔑 Password Management

- ➕ Add new passwords
- ✏ Edit saved passwords
- 🗑 Delete passwords
- ⭐ Mark passwords as favorites
- 🔍 Search & filter passwords
- 🏷 Categorize passwords
- 📊 Password strength indicator

---

## 📊 Dashboard

- 📈 Password statistics
- 🟢 Strong / 🟡 Medium / 🔴 Weak password tracking
- 📊 Category distribution charts
- 🕒 Recently added passwords

---

## 📂 Data Management

- 📥 Import passwords from Excel
- 📤 Export passwords to Excel
- 📁 Secure data storage in MongoDB

---

## ⚙ User Settings

- 👤 Profile management
- 🔒 Enable/disable 2FA
- 🎨 Theme selection (Dark / Light / System)
- ⏱ Auto-lock configuration
- 🗑 Permanent account deletion

---

# 🛠 Tech Stack

## Frontend
```
React.js
Tailwind CSS
Framer Motion
React Icons
Chart.js
Axios
```

## Backend
```
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
Passport.js
Speakeasy (2FA)
Nodemailer
```

## Deployment
```
Frontend → Vercel
Backend → Render
Database → MongoDB Atlas
```

---

# 📂 Project Structure

```
Password-Hub
│
├── backend
│   ├── config
│   │   ├── passport.js
│   │   └── email.js
│   │
│   ├── middleware
│   │   └── auth.js
│   │
│   ├── models
│   │   ├── User.js
│   │   └── Password.js
│   │
│   ├── routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── passwords.js
│   │
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── context
│   │   └── App.js
│
└── README.md
```

---

# 🚀 Installation

## 1️⃣ Clone the repository

```bash
git clone https://github.com/Devraj-sah22/password-hub.git
cd password-hub
```

---

## 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3️⃣ Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

# ⚙ Environment Variables

Create a `.env` file inside **backend**

```
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
SESSION_SECRET=your_session_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret

MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_secret
```

---

# ▶ Run the Project

### Start Backend

```bash
cd backend
npm start
```

Backend runs on:

```
http://localhost:5000
```

---

### Start Frontend

```bash
cd frontend
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

# 🌐 Deployment

### Frontend

Deploy using **Vercel**

```
https://vercel.com
```

---

### Backend

Deploy using **Render**

```
https://render.com
```

---

### Database

Use **MongoDB Atlas**

```
https://mongodb.com/atlas
```

---

# 🔐 Security Practices Implemented

✔ Password hashing  
✔ JWT authentication  
✔ OAuth authentication  
✔ Two-factor authentication  
✔ Secure email verification  
✔ Token-based password reset  
✔ Protected API routes  

---

# 🎯 Future Improvements

- 🔐 End-to-end encryption
- 🧠 Password breach detection
- 📱 Mobile app version
- 🔍 Dark web password monitoring
- 🧑‍💻 Admin dashboard
- 🗄 Vault sharing between users

---

# 👨‍💻 Author

**Devraj Sah**

Computer Science Engineering Student  
KIIT University

---

# ⭐ Support

If you like this project:

⭐ Star the repository  
🍴 Fork it  
🚀 Build your own version

---

# 📜 License

This project is licensed under the **MIT License**

---

<div align="center">

🔐 **Password Hub — Your Digital Vault**

</div>
