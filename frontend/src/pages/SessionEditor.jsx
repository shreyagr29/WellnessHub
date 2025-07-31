import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import sessionService from '../services/SessionService'
import { useAutoSave } from '../hooks/useAutoSave'
import LoadingSpinner from '../components/loadingspinner'
import { Save, Eye, ArrowLeft, Clock } from 'lucide-react'

const SessionEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    json_file_url: ''
  })

  useEffect(() => {
    if (isEditing) {
      fetchSession()
    }
  }, [id])

  const fetchSession = async () => {
    try {
      setLoading(true)
      const response = await sessionService.getSession(id)
      const session = response.session
      setFormData({
        title: session.title || '',
        tags: session.tags ? session.tags.join(', ') : '',
        json_file_url: session.json_file_url || ''
      })
    } catch (error) {
      toast.error('Failed to load session')
      navigate('/my-sessions')
    } finally {
      setLoading(false)
    }
  }

  const handleAutoSave = async (data) => {
    if (!data.title.trim() || !data.json_file_url.trim()) {
      return // Don't auto-save empty sessions
    }

    try {
      setSaving(true)
      const sessionData = {
        ...data,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        ...(isEditing && { id })
      }
      
      const response = await sessionService.saveDraft(sessionData)
      setLastSaved(new Date())
      
      // If this was a new session, redirect to edit mode
      if (!isEditing && response.session._id) {
        navigate(`/sessions/edit/${response.session._id}`, { replace: true })
      }
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setSaving(false)
    }
  }

  // Auto-save hook
  useAutoSave(formData, handleAutoSave, 5000)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSaveDraft = async () => {
    if (!formData.title.trim() || !formData.json_file_url.trim()) {
      toast.error('Please fill in title and JSON URL')
      return
    }

    try {
      setSaving(true)
      const sessionData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        ...(isEditing && { id })
      }
      
      const response = await sessionService.saveDraft(sessionData)
      setLastSaved(new Date())
      toast.success('Draft saved successfully!')
      
      // If this was a new session, redirect to edit mode
      if (!isEditing && response.session._id) {
        navigate(`/sessions/edit/${response.session._id}`, { replace: true })
      }
    } catch (error) {
      toast.error('Failed to save draft')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!formData.title.trim() || !formData.json_file_url.trim()) {
      toast.error('Please fill in title and JSON URL')
      return
    }

    // Validate URL format
    try {
      new URL(formData.json_file_url)
    } catch {
      toast.error('Please enter a valid URL')
      return
    }

    try {
      setPublishing(true)
      const sessionData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        ...(isEditing && { id })
      }
      
      await sessionService.publishSession(sessionData)
      toast.success('Session published successfully!')
      navigate('/my-sessions')
    } catch (error) {
      toast.error('Failed to publish session')
    } finally {
      setPublishing(false)
    }
  }

  const formatLastSaved = (date) => {
    if (!date) return null
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)
    
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
    return date.toLocaleTimeString()
  }

  if (loading) {
    return <LoadingSpinner text="Loading session..." />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/my-sessions')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Session' : 'Create New Session'}
            </h1>
            {lastSaved && (
              <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                <Clock size={16} />
                <span>Last saved {formatLastSaved(lastSaved)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {saving && (
            <span className="text-sm text-blue-600 flex items-center">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
              Auto-saving...
            </span>
          )}
        </div>
      </div>

      {/* Editor Form */}
      <div className="card p-8 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Session Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., Morning Yoga Flow, Mindfulness Meditation"
            maxLength={200}
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.title.length}/200 characters
          </p>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="input-field"
            placeholder="yoga, meditation, beginner, morning (comma-separated)"
          />
          <p className="mt-1 text-sm text-gray-500">
            Add relevant tags to help users discover your session
          </p>
        </div>

        <div>
          <label htmlFor="json_file_url" className="block text-sm font-medium text-gray-700 mb-2">
            JSON File URL *
          </label>
          <input
            type="url"
            id="json_file_url"
            name="json_file_url"
            value={formData.json_file_url}
            onChange={handleChange}
            className="input-field"
            placeholder="https://example.com/session-data.json"
          />
          <p className="mt-1 text-sm text-gray-500">
            URL to the JSON file containing your session data
          </p>
        </div>

        {/* Preview Section */}
        {formData.title && formData.json_file_url && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900">{formData.title}</h4>
              {formData.tags && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.split(',').map((tag, index) => (
                    tag.trim() && (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-md"
                      >
                        {tag.trim()}
                      </span>
                    )
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-600 mt-2">
                JSON URL: {formData.json_file_url}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-6">
          <button
            onClick={handleSaveDraft}
            disabled={saving || !formData.title.trim() || !formData.json_file_url.trim()}
            className="flex items-center space-x-2 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>
          
          <button
            onClick={handlePublish}
            disabled={publishing || !formData.title.trim() || !formData.json_file_url.trim()}
            className="flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Eye size={18} />
            <span>{publishing ? 'Publishing...' : 'Publish Session'}</span>
          </button>
        </div>
      </div>

      {/* Help Section */}
      <div className="card p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-medium text-blue-900 mb-3">💡 Tips for Creating Great Sessions</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Use descriptive titles that clearly indicate the type and difficulty level</li>
          <li>• Add relevant tags to help users find your sessions (e.g., "beginner", "morning", "stress-relief")</li>
          <li>• Ensure your JSON URL is publicly accessible and contains valid session data</li>
          <li>• Your work is automatically saved as you type - no need to worry about losing progress!</li>
          <li>• Save as draft to continue editing later, or publish to make it available to all users</li>
        </ul>
      </div>
    </div>
  )
}

export default SessionEditor
