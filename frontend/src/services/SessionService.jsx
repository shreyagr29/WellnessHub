import authService from './AuthService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class SessionService {
  async getPublicSessions(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString()
      const response = await fetch(`${API_URL}/sessions?${queryString}`)
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch sessions')
      }
      
      return data
    } catch (error) {
      throw error
    }
  }

  async getMySessions(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString()
      const response = await fetch(`${API_URL}/my-sessions?${queryString}`, {
        headers: {
          ...authService.getAuthHeaders()
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch your sessions')
      }
      
      return data
    } catch (error) {
      throw error
    }
  }

  async getSession(id) {
    try {
      const response = await fetch(`${API_URL}/my-sessions/${id}`, {
        headers: {
          ...authService.getAuthHeaders()
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch session')
      }
      
      return data
    } catch (error) {
      throw error
    }
  }

  async saveDraft(sessionData) {
    try {
      const response = await fetch(`${API_URL}/my-sessions/save-draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders()
        },
        body: JSON.stringify(sessionData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save draft')
      }
      
      return data
    } catch (error) {
      throw error
    }
  }

  async publishSession(sessionData) {
    try {
      const response = await fetch(`${API_URL}/my-sessions/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders()
        },
        body: JSON.stringify(sessionData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to publish session')
      }
      
      return data
    } catch (error) {
      throw error
    }
  }

  async deleteSession(id) {
    try {
      const response = await fetch(`${API_URL}/my-sessions/${id}`, {
        method: 'DELETE',
        headers: {
          ...authService.getAuthHeaders()
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete session')
      }
      
      return data
    } catch (error) {
      throw error
    }
  }
}

export default new SessionService()
