const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class AuthService {
  async register(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      if (data.token) {
        localStorage.setItem('token', data.token)
      }

      return data
    } catch (error) {
      throw error
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      if (data.token) {
        localStorage.setItem('token', data.token)
      }

      return data
    } catch (error) {
      throw error
    }
  }

  async getCurrentUser() {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No token found')
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user')
      }

      return data
    } catch (error) {
      throw error
    }
  }

  logout() {
    localStorage.removeItem('token')
  }

  getToken() {
    return localStorage.getItem('token')
  }

  isAuthenticated() {
    const token = this.getToken()
    if (!token) return false

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp > Date.now() / 1000
    } catch {
      return false
    }
  }

  getAuthHeaders() {
    const token = this.getToken()
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }
}

export default new AuthService()
