import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './contexts/authcontext'
import { useAuth } from './contexts/authcontext'
import Navbar from './components/navbar'
import LoadingSpinner from './components/loadingspinner'

// Pages
import Login from './pages/login'
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import MySessions from './pages/MySessions'
import SessionEditor from './pages/SessionEditor'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />
}

function AppContent() {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-sessions" 
            element={
              <ProtectedRoute>
                <MySessions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sessions/new" 
            element={
              <ProtectedRoute>
                <SessionEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sessions/edit/:id" 
            element={
              <ProtectedRoute>
                <SessionEditor />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
