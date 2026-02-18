import { useState } from 'react'
import PropTypes from 'prop-types'
import { API_URL } from '../config/api'

export default function FacilityForm({ onCreated }) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [capacity, setCapacity] = useState('50')
  const [type, setType] = useState('indoor')

  async function handleSubmit(e) {
    e.preventDefault()

    const facilityData = {
      name,
      location,
      capacity: parseInt(capacity),
      type
    }

    const res = await fetch(`${API_URL}/facilities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(facilityData),
    })

    if (res.ok) {
      setName('')
      setLocation('')
      setCapacity('50')
      setType('indoor')
      onCreated()
    } else {
      const error = await res.json()
      alert(`Failed to add facility: ${error.message || 'Unknown error'}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ 
      marginBottom: '2rem',
      padding: '1.5rem',
      background: '#f3e5f5',
      borderRadius: '8px',
      border: '2px solid #9c27b0'
    }}>
      <h3>🏟️ Add New Facility</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Facility Name"
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder="Capacity"
          min="1"
          max="1000"
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="indoor">🏢 Indoor</option>
          <option value="outdoor">🌳 Outdoor</option>
          <option value="hybrid">🔄 Hybrid</option>
        </select>
      </div>
      <button type="submit" style={{
        marginTop: '1rem',
        padding: '0.7rem 2rem',
        background: '#9c27b0',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem'
      }}>
        ✅ Add Facility
      </button>
    </form>
  )
}

FacilityForm.propTypes = {
  onCreated: PropTypes.func.isRequired,
}
