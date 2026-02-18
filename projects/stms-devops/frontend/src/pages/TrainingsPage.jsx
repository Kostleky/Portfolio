import { useEffect, useState } from 'react'
import TrainingList from '../components/TrainingList'
import TrainingForm from '../components/TrainingForm'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config/api'

export default function TrainingsPage() {
  const { user } = useAuth()
  const [trainings, setTrainings] = useState([])
  const [teams, setTeams] = useState([])
  const [coaches, setCoaches] = useState([])
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)

  const isCoach = user?.role === 'coach'

  async function loadTrainings() {
    try {
      const res = await fetch(`${API_URL}/trainingSessions`)
      const data = await res.json()
      setTrainings(data.data || data)
    } catch (error) {
      console.error('Error loading trainings:', error)
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
    loadTrainings()
    loadResources()
  }, [])

  async function handleDelete(id) {
    if (!isCoach) {
      alert('Only coaches can delete entries')
      return
    }
    const res = await fetch(`${API_URL}/trainingSessions/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setTrainings(prev => prev.filter(t => t._id !== id))
    }
  }

  if (loading) return <p style={{ padding: '2rem' }}>Loading trainings...</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>🏋️ Training Sessions</h2>
      
      {isCoach ? (
        <TrainingForm 
          onCreated={loadTrainings} 
          teams={teams}
          coaches={coaches}
          facilities={facilities}
        />
      ) : (
        <div style={{
          padding: '1.5rem',
          background: '#e8f5e9',
          borderRadius: '8px',
          border: '2px solid #4CAF50',
          marginBottom: '2rem'
        }}>
          <p style={{ margin: 0, color: '#2e7d32', fontWeight: 'bold' }}>
            ℹ️ You are viewing trainings in read-only mode. Only coaches can schedule or modify trainings.
          </p>
        </div>
      )}

      <TrainingList trainings={trainings} onDelete={handleDelete} canDelete={isCoach} />
    </div>
  )
}
