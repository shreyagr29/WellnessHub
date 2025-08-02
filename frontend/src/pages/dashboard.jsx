import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import sessionService from '../services/SessionService'
import SessionCard from '../components/sessioncard'
import LoadingSpinner from '../components/loadingspinner'
import { Search, Filter, Plus } from 'lucide-react'

const Dashboard = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [availableTags, setAvailableTags] = useState([])

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await sessionService.getPublicSessions()
      setSessions(response.sessions)
      
      const tags = new Set()
      response.sessions.forEach(session => {
        session.tags?.forEach(tag => tags.add(tag))
      })
      setAvailableTags(Array.from(tags))
    } catch (error) {
      toast.error('Failed to load sessions')
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => session.tags?.includes(tag))

    return matchesSearch && matchesTags
  })

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  if (loading) {
    return <LoadingSpinner text="Loading sessions..." />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wellness Sessions</h1>
          <p className="mt-2 text-gray-600">Explore our collection of wellness sessions</p>
        </div>
        <Link
          to="/sessions/new"
          className="mt-4 sm:mt-0 flex items-center space-x-2 btn-primary"
        >
          <Plus size={20} />
          <span>Create Session</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {availableTags.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Filter size={18} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter by tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🧘</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedTags.length > 0 ? 'No sessions found' : 'No sessions available'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedTags.length > 0 
              ? 'Try adjusting your search or filters'
              : 'Be the first to create a wellness session!'
            }
          </p>
          <Link to="/sessions/new" className="btn-primary">
            Create First Session
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map(session => (
            <SessionCard key={session._id} session={session} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
