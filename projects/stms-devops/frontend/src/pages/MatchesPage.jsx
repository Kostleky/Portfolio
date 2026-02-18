import { useEffect, useState } from 'react'
import MatchList from '../components/MatchList'
import MatchForm from '../components/MatchForm'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config/api'

export default function MatchesPage() {
  const { user } = useAuth()
  const [matches, setMatches] = useState([])
  const [teams, setTeams] = useState([])
  const [coaches, setCoaches] = useState([])
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)

  const isCoach = user?.role === 'coach'

  async function loadMatches() {
    try {
      const res = await fetch(`${API_URL}/matchSessions`)
      const data = await res.json()
      setMatches(data.data || data)
    } catch (error) {
      console.error('Error loading matches:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadResources() {
    try {
      const [teamsRes, coachesRes, facilitiesRes] = await Promise.all([
        fetch(`${API_URL}/teams`),
        fetch(`${API_URL}/coaches`),
        fetch(`${API_URL}/facilities`)
      ])
      const teamsData = await teamsRes.json()
      const coachesData = await coachesRes.json()
      const facilitiesData = await facilitiesRes.json()
      
      setTeams(teamsData.data || teamsData)
      setCoaches(coachesData.data || coachesData)
      setFacilities(facilitiesData.data || facilitiesData)
    } catch (error) {
      console.error('Error loading resources:', error)
    }
  }

  useEffect(() => {
    loadMatches()
    loadResources()
  }, [])

  async function handleDelete(id) {
    if (!isCoach) {
      alert('Only coaches can delete entries')
      return
    }
    const res = await fetch(`${API_URL}/matchSessions/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMatches(prev => prev.filter(m => m._id !== id))
    }
  }

  if (loading) return <p style={{ padding: '2rem' }}>Loading matches...</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>⚽ Match Sessions</h2>
      
      {isCoach ? (
        <MatchForm 
          onCreated={loadMatches} 
          teams={teams}
          coaches={coaches}
          facilities={facilities}
        />
      ) : (
        <div style={{
          padding: '1.5rem',
          background: '#fff9e6',
          borderRadius: '8px',
          border: '2px solid #ffc107',
          marginBottom: '2rem'
        }}>
          <p style={{ margin: 0, color: '#f57c00', fontWeight: 'bold' }}>
            ℹ️ You are viewing matches in read-only mode. Only coaches can schedule or modify matches.
          </p>
        </div>
      )}

      <MatchList matches={matches} onDelete={handleDelete} canDelete={isCoach} />
    </div>
  )
}
