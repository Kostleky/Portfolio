import { useEffect, useState } from 'react'
import FacilityList from '../components/FacilityList'
import FacilityForm from '../components/FacilityForm'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config/api'

export default function FacilitiesPage() {
  const { user } = useAuth()
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)

  const isCoach = user?.role === 'coach'

  async function loadFacilities() {
    try {
      const res = await fetch(`${API_URL}/facilities`)
      const data = await res.json()
      setFacilities(data.data || data)
    } catch (error) {
      console.error('Error loading facilities:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFacilities()
  }, [])

  async function handleDelete(id) {
    if (!isCoach) {
      alert('Only coaches can delete entries')
      return
    }
    const res = await fetch(`${API_URL}/facilities/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setFacilities(prev => prev.filter(f => f._id !== id))
    }
  }

  if (loading) return <p style={{ padding: '2rem' }}>Loading facilities...</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>🏟️ Facilities Management</h2>
      
      {isCoach ? (
        <FacilityForm onCreated={loadFacilities} />
      ) : (
        <div style={{
          padding: '1.5rem',
          background: '#f3e5f5',
          borderRadius: '8px',
          border: '2px solid #9c27b0',
          marginBottom: '2rem'
        }}>
          <p style={{ margin: 0, color: '#6a1b9a', fontWeight: 'bold' }}>
            ℹ️ You are viewing facilities in read-only mode. Only coaches can add or modify entries.
          </p>
        </div>
      )}

      <FacilityList facilities={facilities} onDelete={handleDelete} canDelete={isCoach} />
    </div>
  )
}
