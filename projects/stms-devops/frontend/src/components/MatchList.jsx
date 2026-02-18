import PropTypes from 'prop-types'

export default function MatchList({ matches, onDelete, canDelete = true }) {
  if (matches.length === 0) {
    return <p>No matches scheduled yet. Add one above!</p>
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Scheduled Matches ({matches.length})</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {matches.map((match) => (
          <li key={match._id} style={{ 
            margin: '0.5rem 0', 
            padding: '1rem',
            background: '#fff9e6',
            borderRadius: '8px',
            borderLeft: '4px solid #ffc107',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong style={{ fontSize: '1.2rem', color: '#d32f2f' }}>
                  ⚽ {match.teamId?.name || 'Unknown Team'} vs {match.opponentTeamName}
                </strong>
                <br />
                <span style={{ color: '#666' }}>
                  📅 {new Date(match.eventDate).toLocaleDateString()} | 🕐 {match.eventSlot}
                </span>
                <br />
                <span style={{ color: '#666' }}>
                  🏟️ {match.facilityId?.name || 'Unknown Facility'}
                </span>
                {' | '}
                <span style={{ color: '#666' }}>
                  👤 Coach: {match.coachId?.firstName} {match.coachId?.lastName}
                </span>
              </div>
              {canDelete && (
                <button 
                  onClick={() => onDelete(match._id)}
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

MatchList.propTypes = {
  matches: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      eventDate: PropTypes.string.isRequired,
      eventSlot: PropTypes.string.isRequired,
      opponentTeamName: PropTypes.string,
      teamId: PropTypes.object,
      coachId: PropTypes.object,
      facilityId: PropTypes.object,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  canDelete: PropTypes.bool,
}
