import { useState } from 'react'
import PropTypes from 'prop-types'
import { API_URL } from '../config/api'

export default function MatchForm({ onCreated, teams, coaches, facilities }) {
  const [eventDate, setEventDate] = useState('')
  const [eventSlot, setEventSlot] = useState('')
  const [teamId, setTeamId] = useState('')
  const [coachId, setCoachId] = useState('')
  const [facilityId, setFacilityId] = useState('')
  const [opponentTeamName, setOpponentTeamName] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    const matchData = {
      eventType: 'match',
      eventDate,
      eventSlot,
      teamId,
      coachId,
      facilityId,
      opponentTeamName
    }

    const res = await fetch(`${API_URL}/matchSessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchData),
    })

    if (res.ok) {
      setEventDate('')
      setEventSlot('')
      setTeamId('')
      setCoachId('')
      setFacilityId('')
      setOpponentTeamName('')
      onCreated()
    } else {
      const error = await res.json()
      alert(`Failed to add match: ${error.message || 'Unknown error'}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ 
      marginBottom: '2rem',
      padding: '1.5rem',
      background: '#fff3cd',
      borderRadius: '8px',
      border: '2px solid #ffc107'
    }}>
      <h3>⚽ Schedule New Match</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <input
          type="text"
          value={eventSlot}
          onChange={(e) => setEventSlot(e.target.value)}
          placeholder="Time Slot (e.g. 14h00-16h00)"
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Select Team</option>
          {teams.map(team => (
            <option key={team._id} value={team._id}>
              {team.name} ({team.sport})
            </option>
          ))}
        </select>

        <input
          type="text"
          value={opponentTeamName}
          onChange={(e) => setOpponentTeamName(e.target.value)}
          placeholder="Opponent Team Name"
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <select
          value={coachId}
          onChange={(e) => setCoachId(e.target.value)}
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Select Coach</option>
          {coaches.map(coach => (
            <option key={coach._id} value={coach._id}>
              {coach.firstName} {coach.lastName}
            </option>
          ))}
        </select>

        <select
          value={facilityId}
          onChange={(e) => setFacilityId(e.target.value)}
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Select Facility</option>
          {facilities.map(facility => (
            <option key={facility._id} value={facility._id}>
              {facility.name} - {facility.location}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" style={{
        marginTop: '1rem',
        padding: '0.7rem 2rem',
        background: '#ffc107',
        color: '#000',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem'
      }}>
        ⚽ Schedule Match
      </button>
    </form>
  )
}

MatchForm.propTypes = {
  onCreated: PropTypes.func.isRequired,
  teams: PropTypes.array.isRequired,
  coaches: PropTypes.array.isRequired,
  facilities: PropTypes.array.isRequired,
}
