import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navigation() {
  const { user, logout } = useAuth()

  return (
    <nav style={{ 
      background: 'white', 
      padding: '1rem',
      display: 'flex',
      gap: '1.5rem',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexWrap: 'wrap'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
        🏠 Home
      </Link>
      <Link to="/coaches" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
        👥 Coaches
      </Link>
      <Link to="/teams" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
        🏆 Teams
      </Link>
      <Link to="/facilities" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
        🏟️ Facilities
      </Link>
      <Link to="/matches" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
        ⚽ Matches
      </Link>
      <Link to="/trainings" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
        🏋️ Trainings
      </Link>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ color: '#666', fontSize: '0.95rem' }}>
              {user.role === 'coach' ? '👔' : '⚽'} 
              <strong style={{ marginLeft: '0.3rem' }}>
                {user.firstName} {user.lastName}
              </strong>
              <span style={{ 
                color: user.role === 'coach' ? '#1976d2' : '#4CAF50', 
                fontWeight: 'bold',
                marginLeft: '0.5rem',
                fontSize: '0.85rem'
              }}>
                ({user.role})
              </span>
            </span>
            <button
              onClick={logout}
              style={{
                padding: '0.5rem 1rem',
                background: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
              🔐 Login
            </Link>
            <Link 
              to="/register" 
              style={{ 
                textDecoration: 'none', 
                background: '#4CAF50',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontWeight: 'bold'
              }}
            >
              📝 Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
