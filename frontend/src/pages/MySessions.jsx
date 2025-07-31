import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import sessionService from '../services/SessionService'
import SessionCard from '../components/sessioncard'
import LoadingSpinner from '../components/loadingspinner'
import { Plus, FileText, Eye } from 'lucide-react'

const MySessions = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, draft, published

  useEffect(() => {
    fetchMySessions()
  }, [])

  const fetchMySessions = async () => {
    try {
      setLoading(true)
      const response = await sessionService.getMySessions()
      setSessions(response.sessions)
    } catch (error) {
      toast.error('Failed to load your sessions')
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return
    }

    try {
      await sessionService.deleteSession(sessionId)
      setSessions(prev => prev.filter(session => session._id !== sessionId))
      toast.success('Session deleted successfully')
    } catch (error) {
      toast.error('Failed to delete session')
      console.error('Error deleting session:', error)
    }
  }

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true
    return session.status === filter
  })

  const getSessionCounts = () => ({
    all: sessions.length,
    draft: sessions.filter(s => s.status === 'draft').length,
    published: sessions.filter(s => s.status === 'published').length
  })

  const counts = getSessionCounts()

  if (loading) {
    return <LoadingSpinner text="Loading your sessions..." />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
          <p className="mt-2 text-gray-600">Manage your wellness sessions</p>
        </div>
        <Link
          to="/sessions/new"
          className="mt-4 sm:mt-0 flex items-center space-x-2 btn-primary"
        >
          <Plus size={20} />
          <span>New Session</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="card p-1">
        <div className="flex space-x-1">
          <button
            onClick={() => setFilter('all')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FileText size={16} />
            <span>All ({counts.all})</span>
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'draft'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FileText size={16} />
            <span>Drafts ({counts.draft})</span>
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'published'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Eye size={16} />
            <span>Published ({counts.published})</span>
          </button>
        </div>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No sessions found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSessions.map(session => (
            <SessionCard
              key={session._id}
              session={session}
              showActions={true}
              onDelete={handleDeleteSession}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MySessions
