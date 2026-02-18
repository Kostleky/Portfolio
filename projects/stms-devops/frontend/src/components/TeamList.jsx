import PropTypes from 'prop-types'

export default function TeamList({ teams, onDelete, canDelete = true }) {
  if (teams.length === 0) {
    return <p>No teams yet. Add one above!</p>
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Teams List ({teams.length})</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {teams.map((team) => (
          <li key={team._id} style={{ 
            margin: '0.5rem 0', 
            padding: '1rem',
            background: '#f1f8e9',
            borderRadius: '8px',
            borderLeft: '4px solid #4CAF50',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div>
              <strong style={{ fontSize: '1.2rem' }}>{team.name}</strong>
              {' '}
              <span style={{ 
                background: '#4CAF50', 
                color: 'white', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}>
                {team.sport}
              </span>
              <br />
              <span style={{ color: '#666' }}>
                👤 Coach: {team.coachId?.firstName} {team.coachId?.lastName}
              </span>
            </div>
            {canDelete && (
              <button 
                onClick={() => onDelete(team._id)}
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
          </li>
        ))}
      </ul>
    </div>
  )
}

TeamList.propTypes = {
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      sport: PropTypes.string.isRequired,
      coachId: PropTypes.object,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  canDelete: PropTypes.bool,
}
