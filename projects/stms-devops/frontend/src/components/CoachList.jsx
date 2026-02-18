import PropTypes from 'prop-types'

export default function CoachList({ coaches, onDelete, canDelete = true }) {
  if (coaches.length === 0) {
    return <p>No coaches yet. Add one above!</p>
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Coaches List ({coaches.length})</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {coaches.map((coach) => (
          <li key={coach._id} style={{ 
            margin: '0.5rem 0', 
            padding: '1rem',
            background: '#f0f8ff',
            borderRadius: '8px',
            borderLeft: '4px solid #2196F3',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div>
              <strong style={{ fontSize: '1.2rem' }}>
                {coach.firstName} {coach.lastName}
              </strong>
              <br />
              <span style={{ color: '#666' }}>📧 {coach.email}</span>
              {' | '}
              <span style={{ color: '#666' }}>📞 {coach.phone || 'N/A'}</span>
              {' | '}
              <span style={{ color: '#666' }}>⚽ {coach.sport}</span>
            </div>
            {canDelete && (
              <button 
                onClick={() => onDelete(coach._id)}
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

CoachList.propTypes = {
  coaches: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
      sport: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  canDelete: PropTypes.bool,
}
