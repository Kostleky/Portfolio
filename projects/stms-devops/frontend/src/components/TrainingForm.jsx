import { useState } from 'react'
import PropTypes from 'prop-types'
import { API_URL } from '../config/api'

export default function TrainingForm({ onCreated, teams, coaches, facilities }) {
  const [eventDate, setEventDate] = useState('')
  const [eventSlot, setEventSlot] = useState('')
  const [duration, setDuration] = useState('90')
  const [trainingLevel, setTrainingLevel] = useState('intermediate')
  const [trainingType, setTrainingType] = useState('mixed')
  const [teamId, setTeamId] = useState('')
  const [coachId, setCoachId] = useState('')
  const [facilityId, setFacilityId] = useState('')
  const [maxParticipants, setMaxParticipants] = useState('25')
  const [description, setDescription] = useState('')
  const [isMandatory, setIsMandatory] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    const trainingData = {
      eventType: 'training',
      eventDate,
      eventSlot,
      duration: parseInt(duration),
      trainingLevel,
      trainingType,
      teamId,
      coachId,
      facilityId,
      maxParticipants: parseInt(maxParticipants),
      description,
      isMandatory
    }

    const res = await fetch(`${API_URL}/trainingSessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trainingData),
    })

    if (res.ok) {
      setEventDate('')
      setEventSlot('')
      setDuration('90')
      setTrainingLevel('intermediate')
      setTrainingType('mixed')
      setTeamId('')
      setCoachId('')
      setFacilityId('')
      setMaxParticipants('25')
      setDescription('')
      setIsMandatory(false)
      onCreated()
    } else {
      const error = await res.json()
      alert(`Failed to add training: ${error.message || 'Unknown error'}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ 
      marginBottom: '2rem',
      padding: '1.5rem',
      background: '#e8f5e9',
      borderRadius: '8px',
      border: '2px solid #4CAF50'
    }}>
      <h3>🏋️ Schedule Training Session</h3>
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
          placeholder="Time Slot (e.g. 10h00-12h00)"
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (minutes)"
          min="30"
          max="240"
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <select
          value={trainingLevel}
          onChange={(e) => setTrainingLevel(e.target.value)}
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select
          value={trainingType}
          onChange={(e) => setTrainingType(e.target.value)}
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="technical">Technical</option>
          <option value="tactical">Tactical</option>
          <option value="physical">Physical</option>
          <option value="mixed">Mixed</option>
        </select>

        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Select Team</option>
          {teams.map(team => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>

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
              {facility.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(e.target.value)}
          placeholder="Max Participants"
          min="1"
          max="100"
          required
          style={{ padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        maxLength="500"
        rows="3"
        style={{ 
          width: '100%', 
          marginTop: '1rem',
          padding: '0.7rem', 
          borderRadius: '4px', 
          border: '1px solid #ccc',
          fontFamily: 'inherit'
        }}
      />

      <label style={{ display: 'flex', alignItems: 'center', marginTop: '1rem', gap: '0.5rem' }}>
        <input
          type="checkbox"
          checked={isMandatory}
          onChange={(e) => setIsMandatory(e.target.checked)}
        />
        <span>Mandatory Training</span>
      </label>

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
        🏋️ Schedule Training
      </button>
    </form>
  )
}

TrainingForm.propTypes = {
  onCreated: PropTypes.func.isRequired,
  teams: PropTypes.array.isRequired,
  coaches: PropTypes.array.isRequired,
  facilities: PropTypes.array.isRequired,
}
