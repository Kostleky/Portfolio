import PropTypes from 'prop-types'

export default function TrainingList({ trainings, onDelete, canDelete = true }) {
  if (trainings.length === 0) {
    return <p>No trainings scheduled yet. Add one above!</p>
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Scheduled Trainings ({trainings.length})</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {trainings.map((training) => (
          <li key={training._id} style={{ 
            margin: '0.5rem 0', 
            padding: '1rem',
            background: '#f1f8f4',
            borderRadius: '8px',
            borderLeft: '4px solid #4CAF50',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong style={{ fontSize: '1.2rem', color: '#2e7d32' }}>
                  🏋️ {training.teamId?.name || 'Unknown Team'}
                  {training.isMandatory && <span style={{ color: '#d32f2f' }}> ⚠️ Mandatory</span>}
                </strong>
                <br />
                <span style={{ 
                  background: '#4CAF50', 
                  color: 'white', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  marginRight: '0.5rem'
                }}>
                  {training.trainingLevel}
                </span>
                <span style={{ 
                  background: '#2196F3', 
                  color: 'white', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>
                  {training.trainingType}
                </span>
                <br />
                <span style={{ color: '#666' }}>
                  📅 {new Date(training.eventDate).toLocaleDateString()} | 🕐 {training.eventSlot} ({training.duration} min)
                </span>
                <br />
                <span style={{ color: '#666' }}>
                  🏟️ {training.facilityId?.name || 'Unknown'} | 
                  👤 {training.coachId?.firstName} {training.coachId?.lastName} | 
                  👥 Max: {training.maxParticipants}
                </span>
                {training.description && (
                  <>
                    <br />
                    <span style={{ color: '#666', fontStyle: 'italic' }}>
                      📝 {training.description}
                    </span>
                  </>
                )}
              </div>
              {canDelete && (
                <button 
                  onClick={() => onDelete(training._id)}
                  style={{ 
                    background: '#ff4444', 
                    color: 'white', 
                    border: 'none',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

TrainingList.propTypes = {
  trainings: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      eventDate: PropTypes.string.isRequired,
      eventSlot: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      trainingLevel: PropTypes.string.isRequired,
      trainingType: PropTypes.string.isRequired,
      teamId: PropTypes.object,
      coachId: PropTypes.object,
      facilityId: PropTypes.object,
      maxParticipants: PropTypes.number,
      description: PropTypes.string,
      isMandatory: PropTypes.bool,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  canDelete: PropTypes.bool,
}
