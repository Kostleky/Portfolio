import PropTypes from 'prop-types'

export default function FacilityList({ facilities, onDelete, canDelete = true }) {
  if (facilities.length === 0) {
    return <p>No facilities yet. Add one above!</p>
  }

  const typeIcons = {
    indoor: '🏢',
    outdoor: '🌳',
    hybrid: '🔄'
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Facilities List ({facilities.length})</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {facilities.map((facility) => (
          <li key={facility._id} style={{ 
            margin: '0.5rem 0', 
            padding: '1rem',
            background: '#faf5ff',
            borderRadius: '8px',
            borderLeft: '4px solid #9c27b0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div>
              <strong style={{ fontSize: '1.2rem' }}>
                {typeIcons[facility.type]} {facility.name}
              </strong>
              {' '}
              <span style={{ 
                background: '#9c27b0', 
                color: 'white', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}>
                {facility.type}
              </span>
              <br />
              <span style={{ color: '#666' }}>
                📍 {facility.location || 'Not specified'}
              </span>
              {' | '}
              <span style={{ color: '#666' }}>
                👥 Capacity: {facility.capacity}
              </span>
            </div>
            {canDelete && (
              <button 
                onClick={() => onDelete(facility._id)}
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

FacilityList.propTypes = {
  facilities: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      location: PropTypes.string,
      capacity: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  canDelete: PropTypes.bool,
}
