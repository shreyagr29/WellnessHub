# 🌿 Wellness Hub

**Wellness Hub** is a full-stack web application that enables users to register, log in, and book wellness sessions. It is built using the **MERN** stack and is fully deployed on the cloud using **Render** for the backend and **Vercel** for the frontend.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS  
- **Backend**: Node.js, Express  
- **Database**: MongoDB  
- **Authentication**: JSON Web Tokens (JWT)  
- **Deployment**:
  - Frontend → [Vercel](https://vercel.com/)
  - Backend → [Render](https://render.com/)
- **Security**: Helmet, CORS, Rate Limiting

---

## 📁 Project Structure

```
/client         → Frontend (React + Vite)
/server         → Backend (Node.js + Express)
/routes         → API route handlers
/models         → Mongoose schemas
/controllers    → Business logic
.env            → Environment variables
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/shreyagr29/WellnessHub.git
cd WellnessHub
```

---

## 🖥️ Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside the `client/` folder:

```env
VITE_API_URL=https://wellness-hub.onrender.com/api
```

Run the development server:

```bash
npm run dev
```

---

## 🌐 Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
FRONTEND_URL=https://wellness-hub-kappa.vercel.app
MONGODB_URI=<your-mongodb-connection-uri>
JWT_SECRET=<your-secure-jwt-secret>
NODE_ENV=development
```

Run the backend server:

```bash
node index.js
```

---

## 🌍 Live Deployment

- **Frontend**: [https://wellness-hub-kappa.vercel.app](https://wellness-hub-kappa.vercel.app)  
- **Backend**: [https://wellness-hub.onrender.com](https://wellness-hub.onrender.com)

---

## 📡 API Endpoints

### 🔐 Auth

```http
POST /api/auth/register     # Register a new user
POST /api/auth/login        # Login and receive JWT
```

### 📆 Sessions

```http
GET /api/sessions           # Get all public sessions
GET /api/my-sessions        # Get sessions for the logged-in user (Requires Auth)
```

---

## 🔒 Security Features

- **CORS** configured to accept only the deployed frontend URL  
- **Helmet** to set secure HTTP headers  
- **Rate Limiting** to restrict abuse (100 requests per 15 minutes)

---

## 🌱 Future Improvements

- Admin dashboard for managing sessions and users  
- Role-based access control (Admin, User)  
- Payment gateway integration for paid sessions  
- Email and push notification system for session reminders

---

## 📝 License

MIT © 2025 Wellness Hub

---

## 📬 Contact

For suggestions or contributions, feel free to open an issue or submit a pull request on [GitHub](https://github.com/shreyagr29/WellnessHub).
