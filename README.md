# 🎓 XYZ University — Student Portal

A full-stack student portal built for **XYZ University**, giving students a single dashboard to manage academics, payments, attendance, and campus services online.

 **Live Site (Frontend):** [https://student-portal-theta-roan.vercel.app](https://student-portal-theta-roan.vercel.app)
 
 **Live API (Backend):** [https://studentportal-upyf.onrender.com](https://studentportal-upyf.onrender.com)

>  The backend is hosted on Render's free tier. If it has been inactive, the **first request may take 30–50 seconds** to wake up (cold start) — please be patient on first load.

---

## Overview

Student Portal is a single-window academic ERP-style web app where a student can log in and:

- View their profile, CGPA, and academic results
- Check attendance and exam clearance status
- Register/drop courses each semester
- Pay tuition and track their payment ledger
- Apply for waivers, scholarships, and transport cards
- Submit teaching evaluations
- Request certificates & transcripts
- Browse learning resources and the academic calendar
- Get real-time notifications

---

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router
- Bootstrap 5
- Firebase Authentication
- Axios
- Recharts (data visualization)
- React Icons / Lucide React

**Backend**
- Node.js + Express
- MongoDB (via official `mongodb` driver)
- Firebase Admin SDK (token verification)
- express-rate-limit (write-endpoint rate limiting)
- CORS

**Deployment**
- Frontend → [Vercel](https://vercel.com)
- Backend → [Render](https://render.com)
- Database → [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## Project Structure

```
StudentPortal/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── Component/       # All page/feature components
│   │   ├── hooks/           # Custom hooks (e.g. useAxiosSecure)
│   │   ├── AuthContext.jsx
│   │   ├── AuthProvider.jsx
│   │   ├── firebase.init.js
│   │   └── main.jsx
│   └── package.json
│
├── server/                  # Express backend
│   ├── config/               # DB + Firebase config
│   ├── middleware/           # Auth, rate limiting
│   ├── routes/                # One route file per feature
│   ├── seed/                  # Demo data seeding script
│   ├── utils/                  # Shared route helpers
│   └── package.json
│
└── .gitignore
```

---

## ✨ Features

| Module | Description |
|---|---|
| **Dashboard** | Today's class routine, quick financial summary |
| **Student Profile** | Personal, academic & address info |
| **Academic Result** | Semester-wise SGPA, cumulative CGPA, grade breakdown |
| **Attendance** | Course-wise attendance % with clearance warnings |
| **Payment Ledger** | Full transaction history, dues, filters by semester |
| **Course Registration** | Add/drop courses with live seat & credit-limit checks |
| **Exam Clearance** | Department-wise clearance checklist |
| **Waiver** | Apply for and track fee waivers |
| **Scholarship** | Browse & apply for scholarships based on eligibility |
| **Transport Card** | Apply for a bus route & pickup point |
| **Teaching Evaluation** | Anonymous per-course faculty evaluation |
| **Certificate & Transcript** | Request official documents with delivery options |
| **Learning Resources** | Browse slides, videos, docs by course |
| **Academic Calendar** | University-wide events, filterable by category |
| **Notifications** | Real-time alerts (payments, results, notices) |

---

## 🔐 Authentication & Security

- **Firebase Authentication** handles sign-up/sign-in (email & password).
- Every protected API route verifies the Firebase ID token server-side (`verifyFirebaseToken` middleware).
- A second middleware (`verifyTokenEmail`) ensures a student can only ever read/write **their own** data — one student can never query another's records.
- All emails are normalized to lowercase on both the request and the stored data, avoiding case-sensitivity mismatches.
- Write endpoints (apply, submit, register, etc.) are rate-limited to prevent abuse.
- Secrets (MongoDB URI, Firebase service key) are kept in environment variables — never committed to the repository.



## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas cluster
- A Firebase project (Authentication enabled)

### 1. Clone the repository

```bash
git clone https://github.com/tanvir20114/StudentPortal.git
cd StudentPortal
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in `server/` (see Environment Variables above), then:

```bash
npm start
```

Optional — seed demo data into MongoDB:

```bash
node seed/seed.js
```

### 3. Set up the frontend

```bash
cd ../client
npm install
```

Create a `.env` file in `client/` (see Environment Variables above), then:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`, connected to the backend at `http://localhost:5000`.

---

## 🌍 Deployment Notes

- **Backend (Render):** Root Directory = `server`, Build Command = `npm install`, Start Command = `npm start`, Instance Type = Free.
- **Frontend (Vercel):** Root Directory = `client`, framework auto-detected as Vite.
- After deploying, remember to:
  1. Add the deployed frontend domain to **Firebase → Authentication → Settings → Authorized domains**.
  2. Update `CLIENT_URL` in Render's environment variables to the deployed frontend URL (no trailing slash) so CORS allows requests from production.
  3. Whitelist Render's outbound traffic in **MongoDB Atlas → Network Access** (`0.0.0.0/0` for simplicity, or restrict further for production).

---

## 📌 Known Limitations

- Passwords are managed entirely by Firebase Auth — no password data is ever stored in MongoDB.
- Free-tier hosting means the backend may "sleep" after inactivity, causing a slow first response.
- Demo/seed data uses placeholder student records for local development and testing.

---

## 📄 License

This project was built for educational purposes as part of a university portal demo.

---

## 🙋 Author

**Tanvir**
GitHub: [@tanvir20114](https://github.com/tanvir20114)
