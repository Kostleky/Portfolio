import { useEffect, useState } from 'react'
import TeamList from '../components/TeamList'
import TeamForm from '../components/TeamForm'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config/api'

export default function TeamsPage() {
  const { user } = useAuth()
  const [teams, setTeams] = useState([])
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)

  const isCoach = user?.role === 'coach'

  async function loadTeams() {
    try {
      const res = await fetch(`${API_URL}/teams`)
      const data = await res.json()
      setTeams(data.data || data)
    } catch (error) {
      console.error('Error loading teams:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadCoaches() {
    try {
      const res = await fetch(`${API_URL}/coaches`)
      const data = await res.json()
      setCoaches(data.data || data)
    } catch (error) {
      console.error('Error loading coaches:', error)
    }
  }

  useEffect(() => {
    loadTeams()
    loadCoaches()
  }, [])

  async function handleDelete(id) {
    if (!isCoach) {
      alert('Only coaches can delete entries')
      return
    }
    const res = await fetch(`${API_URL}/teams/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setTeams(prev => prev.filter(t => t._id !== id))
    }
  }

  if (loading) return <p style={{ padding: '2rem' }}>Loading teams...</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>🏆 Teams</h2>
      
      {isCoach ? (
        <TeamForm onCreated={loadTeams} coaches={coaches} />
      ) : (
        <div style={{
          padding: '1.5rem',
          background: '#e8f5e9',
          borderRadius: '8px',
          border: '2px solid #4CAF50',
          marginBottom: '2rem'
        }}>
          <p style={{ margin: 0, color: '#2e7d32', fontWeight: 'bold' }}>
            ℹ️ You are viewing teams in read-only mode. Only coaches can add or modify entries.
          </p>
        </div>
      )}

      <TeamList teams={teams} onDelete={handleDelete} canDelete={isCoach} />
    </div>
  )
}
