# 🌿 Wellness Hub

A full-stack wellness platform where users can register, login, and book wellness sessions. Built with the **MERN** stack and deployed using **Render** (backend) and **Vercel** (frontend).

---

## 🛠 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS  
- **Backend**: Node.js + Express  
- **Database**: MongoDB  
- **Authentication**: JWT  
- **Deployment**:  
  - Frontend → [Vercel](https://vercel.com/)  
  - Backend → [Render](https://render.com/)  
- **Security**: Helmet, CORS, Rate Limiting

---

## 📁 Project Structure

- /client # Frontend (React + Vite)
- /server # Backend (Node.js + Express)
- /routes # Express route handlers
- /models # Mongoose models
- /controllers # Business logic
- .env # Environment variables

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/shreyagr29/WellnessHub.git
cd wellness-hub

---

## 🖥️ Frontend Setup

cd client
npm install
### Create a .env file in client/:

VITE_API_URL=https://your-backend-url.onrender.com/api

### Start the development server:

npm run dev

---

## 🌐 Backend Setup

cd server
npm install

### Create a .env file in server/:

PORT=5000
FRONTEND_URL=https://your-frontend-url.vercel.app
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

### Start the backend server:
node index.js

---

## 🌍 Deployment URLs
- Frontend: [https://your-frontend-url.vercel.app](https://wellness-hub-kappa.vercel.app)

- Backend: [https://your-backend-url.onrender.com](https://wellness-hub.onrender.com)

---

## 📡 API Routes
Auth
POST   /api/auth/register
POST   /api/auth/login

Sessions
GET    /api/sessions
GET    /api/my-sessions   (Requires Auth)

---

## 🔒 Security Features
- CORS origin restricted to frontend URL

- Helmet for setting secure HTTP headers

- Rate limiter to prevent abuse

---

## 🌱 Future Improvements
- Admin dashboard

- Role-based access control

- Payment integration

- Email & push notifications

---

## 📝 License
MIT © 2025 Wellness Hub

---

Let me know if you want this saved as a downloadable file or tailored with your actual GitHub repo URL and deployed frontend/backend URLs.

