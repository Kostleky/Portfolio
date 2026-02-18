import { useState } from 'react'
import PropTypes from 'prop-types'
import { API_URL } from '../config/api'

export default function TeamForm({ onCreated, coaches }) {
  const [name, setName] = useState('')
  const [sport, setSport] = useState('Football')
  const [city, setCity] = useState('')
  const [foundedYear, setFoundedYear] = useState('')
  const [coachId, setCoachId] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    const teamData = {
      name,
      sport,
      city,
      foundedYear: foundedYear ? parseInt(foundedYear) : undefined,
      coachId: coachId || undefined
    }

    const res = await fetch(`${API_URL}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData),
    })

    if (res.ok) {
      setName('')
      setSport('Football')
      setCity('')
      setFoundedYear('')
      setCoachId('')
      onCreated()
    } else {
      const error = await res.json()
      alert(`Failed to add team: ${error.message || 'Unknown error'}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ 
      marginBottom: '2rem',
      padding: '1.5rem',
      background: '#f0f8ff',
      borderRadius: '8px',
      border: '2px solid #4CAF50'
    }}>
      <h3>➕ Add New Team</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Team Name"
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="Football">⚽ Football</option>
          <option value="Rugby">🏉 Rugby</option>
          <option value="Basketball">🏀 Basketball</option>
          <option value="Volleyball">🏐 Volleyball</option>
          <option value="Tennis">🎾 Tennis</option>
        </select>

        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <input
          type="number"
          value={foundedYear}
          onChange={(e) => setFoundedYear(e.target.value)}
          placeholder="Founded Year (optional)"
          min="1800"
          max={new Date().getFullYear()}
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <select
          value={coachId}
          onChange={(e) => setCoachId(e.target.value)}
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">No Coach (optional)</option>
          {coaches.map(coach => (
            <option key={coach._id} value={coach._id}>
              {coach.firstName} {coach.lastName} - {coach.specialization}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" style={{
        marginTop: '1rem',
        padding: '0.7rem 2rem',
        background: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem'
      }}>
        ✅ Add Team
      </button>
    </form>
  )
}

TeamForm.propTypes = {
  onCreated: PropTypes.func.isRequired,
  coaches: PropTypes.array.isRequired,
}
