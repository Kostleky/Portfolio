import { useState } from 'react'
import PropTypes from 'prop-types'
import { API_URL } from '../config/api'

export default function CoachForm({ onCreated }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [specialization, setSpecialization] = useState('Football')

  async function handleSubmit(e) {
    e.preventDefault()

    const res = await fetch(`${API_URL}/coaches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        firstName, 
        lastName, 
        email, 
        phoneNumber,
        specialization
      }),
    })

    if (res.ok) {
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhoneNumber('')
      setSpecialization('Football')
      onCreated()
    } else {
      alert('Failed to add coach')
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
      <h3>➕ Add New Coach</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone (optional)"
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="Football">⚽ Football</option>
          <option value="Rugby">🏉 Rugby</option>
          <option value="Basketball">🏀 Basketball</option>
          <option value="Volleyball">🏐 Volleyball</option>
          <option value="Tennis">🎾 Tennis</option>
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
        ✅ Add Coach
      </button>
    </form>
  )
}

CoachForm.propTypes = {
  onCreated: PropTypes.func.isRequired,
}
