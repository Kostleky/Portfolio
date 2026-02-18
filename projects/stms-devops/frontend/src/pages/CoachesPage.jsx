import { useEffect, useState } from 'react'
import CoachList from '../components/CoachList'
import CoachForm from '../components/CoachForm'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config/api'

export default function CoachesPage() {
  const { user } = useAuth()
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)

  const isCoach = user?.role === 'coach'

  async function loadCoaches() {
    try {
      const res = await fetch(`${API_URL}/coaches`)
      const data = await res.json()
      setCoaches(data.data || data)
    } catch (error) {
      console.error('Error loading coaches:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCoaches()
  }, [])

  async function handleDelete(id) {
    if (!isCoach) {
      alert('Only coaches can delete entries')
      return
    }
    const res = await fetch(`${API_URL}/coaches/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setCoaches(prev => prev.filter(c => c._id !== id))
    }
  }

  if (loading) return <p style={{ padding: '2rem' }}>Loading coaches...</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>👥 Coaches</h2>
      
      {isCoach ? (
        <CoachForm onCreated={loadCoaches} />
      ) : (
        <div style={{
          padding: '1.5rem',
          background: '#e3f2fd',
          borderRadius: '8px',
          border: '2px solid #2196F3',
          marginBottom: '2rem'
        }}>
          <p style={{ margin: 0, color: '#1565c0', fontWeight: 'bold' }}>
            ℹ️ You are viewing coaches in read-only mode. Only coaches can add or modify entries.
          </p>
        </div>
      )}

      <CoachList coaches={coaches} onDelete={handleDelete} canDelete={isCoach} />
    </div>
  )
}
