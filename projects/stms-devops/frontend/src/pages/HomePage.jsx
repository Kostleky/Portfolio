import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config/api'

export default function HomePage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    coaches: 0,
    teams: 0,
    facilities: 0,
    matches: 0,
    trainings: 0
  })
  const [upcomingMatches, setUpcomingMatches] = useState([])
  const [upcomingTrainings, setUpcomingTrainings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      const [coachesRes, teamsRes, facilitiesRes, matchesRes, trainingsRes] = await Promise.all([
        fetch(`${API_URL}/coaches`),
        fetch(`${API_URL}/teams`),
        fetch(`${API_URL}/facilities`),
        fetch(`${API_URL}/matchSessions`),
        fetch(`${API_URL}/trainingSessions`)
      ])

      const coaches = await coachesRes.json()
      const teams = await teamsRes.json()
      const facilities = await facilitiesRes.json()
      const matches = await matchesRes.json()
      const trainings = await trainingsRes.json()

      setStats({
        coaches: (coaches.data || coaches).length,
        teams: (teams.data || teams).length,
        facilities: (facilities.data || facilities).length,
        matches: (matches.data || matches).length,
        trainings: (trainings.data || trainings).length
      })

      const now = new Date()
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

      const matchesData = matches.data || matches
      const upcoming = matchesData
        .filter(m => {
          const matchDate = new Date(m.eventDate)
          return matchDate >= now && matchDate <= nextWeek
        })
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
        .slice(0, 3)
      setUpcomingMatches(upcoming)

      const trainingsData = trainings.data || trainings
      const upcomingT = trainingsData
        .filter(t => {
          const trainingDate = new Date(t.eventDate)
          return trainingDate >= now && trainingDate <= nextWeek
        })
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
        .slice(0, 3)
      setUpcomingTrainings(upcomingT)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        padding: '3rem', 
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading dashboard...
      </div>
    )
  }

  // Affichage selon le rôle
  const isCoach = user?.role === 'coach'
  const isPlayer = user?.role === 'player'

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1400px', 
      margin: '0 auto',
      background: '#f5f5f5',
      minHeight: 'calc(100vh - 150px)'
    }}>
      {/* Header avec message personnalisé */}
      <div style={{ 
        background: isCoach 
          ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
          : isPlayer 
          ? 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        borderRadius: '12px',
        color: 'white',
        marginBottom: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>
          {isCoach && `👔 Coach Dashboard - Welcome ${user.firstName}!`}
          {isPlayer && `⚽ Player Dashboard - Welcome ${user.firstName}!`}
          {!user && 'Welcome to Sports Management System 🏆'}
        </h1>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem', opacity: 0.9 }}>
          {isCoach && 'Manage teams, schedule trainings and matches'}
          {isPlayer && 'View your upcoming matches and training sessions'}
          {!user && 'Please login to access all features'}
        </p>
      </div>

      {/* Statistiques - Différentes selon le rôle */}
      {isCoach && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard 
            icon="👥" 
            title="Coaches" 
            count={stats.coaches} 
            color="#2196F3"
            link="/coaches"
          />
          <StatCard 
            icon="🏆" 
            title="Teams" 
            count={stats.teams} 
            color="#4CAF50"
            link="/teams"
          />
          <StatCard 
            icon="🏟️" 
            title="Facilities" 
            count={stats.facilities} 
            color="#9C27B0"
            link="/facilities"
          />
          <StatCard 
            icon="⚽" 
            title="Matches" 
            count={stats.matches} 
            color="#FF9800"
            link="/matches"
          />
          <StatCard 
            icon="🏋️" 
            title="Trainings" 
            count={stats.trainings} 
            color="#00BCD4"
            link="/trainings"
          />
        </div>
      )}

      {isPlayer && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard 
            icon="⚽" 
            title="Upcoming Matches" 
            count={upcomingMatches.length} 
            color="#FF9800"
            link="/matches"
          />
          <StatCard 
            icon="🏋️" 
            title="Upcoming Trainings" 
            count={upcomingTrainings.length} 
            color="#00BCD4"
            link="/trainings"
          />
          <StatCard 
            icon="🏆" 
            title="Total Teams" 
            count={stats.teams} 
            color="#4CAF50"
            link="/teams"
          />
        </div>
      )}

      {!user && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard 
            icon="👥" 
            title="Coaches" 
            count={stats.coaches} 
            color="#2196F3"
            link="/coaches"
          />
          <StatCard 
            icon="🏆" 
            title="Teams" 
            count={stats.teams} 
            color="#4CAF50"
            link="/teams"
          />
          <StatCard 
            icon="⚽" 
            title="Matches" 
            count={stats.matches} 
            color="#FF9800"
            link="/matches"
          />
        </div>
      )}

      {/* Prochains événements */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
        gap: '1.5rem'
      }}>
        {/* Prochains matches */}
        <div style={{ 
          background: 'white', 
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            marginTop: 0, 
            color: '#333',
            borderBottom: '3px solid #FF9800',
            paddingBottom: '0.5rem'
          }}>
            ⚽ {isPlayer ? 'Your Upcoming Matches' : 'Upcoming Matches'} (Next 7 Days)
          </h2>
          {upcomingMatches.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {upcomingMatches.map(match => (
                <li key={match._id} style={{ 
                  padding: '1rem',
                  background: '#fff9e6',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  borderLeft: '4px solid #FF9800'
                }}>
                  <strong style={{ fontSize: '1.1rem', color: '#d32f2f' }}>
                    {match.teamId?.name || 'Unknown'} vs {match.opponentTeamName}
                  </strong>
                  <br />
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    📅 {new Date(match.eventDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <br />
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    🕐 {match.eventSlot} | 🏟️ {match.facilityId?.name || 'TBD'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic' }}>
              {isPlayer ? 'You have no matches scheduled in the next 7 days.' : 'No matches scheduled in the next 7 days.'}
            </p>
          )}
          <Link to="/matches" style={{ 
            display: 'inline-block',
            marginTop: '1rem',
            color: '#FF9800',
            fontWeight: 'bold',
            textDecoration: 'none'
          }}>
            View all matches →
          </Link>
        </div>

        {/* Prochains entraînements */}
        <div style={{ 
          background: 'white', 
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            marginTop: 0, 
            color: '#333',
            borderBottom: '3px solid #00BCD4',
            paddingBottom: '0.5rem'
          }}>
            🏋️ {isPlayer ? 'Your Upcoming Trainings' : 'Upcoming Trainings'} (Next 7 Days)
          </h2>
          {upcomingTrainings.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {upcomingTrainings.map(training => (
                <li key={training._id} style={{ 
                  padding: '1rem',
                  background: '#e8f5e9',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  borderLeft: '4px solid #00BCD4'
                }}>
                  <strong style={{ fontSize: '1.1rem', color: '#2e7d32' }}>
                    {training.teamId?.name || 'Unknown Team'}
                    {training.isMandatory && <span style={{ color: '#d32f2f' }}> ⚠️ Mandatory</span>}
                  </strong>
                  <br />
                  <span style={{ 
                    background: '#4CAF50', 
                    color: 'white', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    marginRight: '0.5rem'
                  }}>
                    {training.trainingLevel}
                  </span>
                  <span style={{ 
                    background: '#2196F3', 
                    color: 'white', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '4px',
                    fontSize: '0.75rem'
                  }}>
                    {training.trainingType}
                  </span>
                  <br />
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    📅 {new Date(training.eventDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <br />
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    🕐 {training.eventSlot} ({training.duration} min)
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic' }}>
              {isPlayer ? 'You have no trainings scheduled in the next 7 days.' : 'No trainings scheduled in the next 7 days.'}
            </p>
          )}
          <Link to="/trainings" style={{ 
            display: 'inline-block',
            marginTop: '1rem',
            color: '#00BCD4',
            fontWeight: 'bold',
            textDecoration: 'none'
          }}>
            View all trainings →
          </Link>
        </div>
      </div>

      {/* Quick Actions - Uniquement pour les Coaches */}
      {isCoach && (
        <div style={{ 
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          marginTop: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0, color: '#333' }}>🚀 Quick Actions</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem'
          }}>
            <QuickActionButton icon="👥" text="Add Coach" link="/coaches" color="#2196F3" />
            <QuickActionButton icon="🏆" text="Create Team" link="/teams" color="#4CAF50" />
            <QuickActionButton icon="⚽" text="Schedule Match" link="/matches" color="#FF9800" />
            <QuickActionButton icon="🏋️" text="New Training" link="/trainings" color="#00BCD4" />
            <QuickActionButton icon="🏟️" text="Add Facility" link="/facilities" color="#9C27B0" />
          </div>
        </div>
      )}

      {/* Message pour les Players */}
      {isPlayer && (
        <div style={{ 
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          marginTop: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#4CAF50', margin: '0 0 1rem 0' }}>⚽ Player View</h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            You can view all matches, trainings, teams, and facilities. 
            Contact your coach to schedule new events or make changes.
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/matches" style={{ 
              padding: '0.7rem 1.5rem',
              background: '#FF9800',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}>
              📅 View Schedule
            </Link>
            <Link to="/teams" style={{ 
              padding: '0.7rem 1.5rem',
              background: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}>
              🏆 View Teams
            </Link>
          </div>
        </div>
      )}

      {/* Invitation à se connecter */}
      {!user && (
        <div style={{ 
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginTop: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#667eea', margin: '0 0 1rem 0' }}>🔐 Join Our Platform</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            Login or register to access all features and manage your sports activities!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/login" style={{ 
              padding: '0.8rem 2rem',
              background: '#1976d2',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}>
              🔐 Login
            </Link>
            <Link to="/register" style={{ 
              padding: '0.8rem 2rem',
              background: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}>
              📝 Register
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// Composants
function StatCard({ icon, title, count, color, link }) {
  return (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <div style={{ 
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        borderLeft: `5px solid ${color}`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)'
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: color, marginBottom: '0.3rem' }}>
          {count}
        </div>
        <div style={{ color: '#666', fontSize: '1rem', fontWeight: '500' }}>
          {title}
        </div>
      </div>
    </Link>
  )
}

function QuickActionButton({ icon, text, link, color }) {
  return (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <button style={{
        width: '100%',
        padding: '1rem',
        background: color,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'transform 0.2s, opacity 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)'
        e.currentTarget.style.opacity = '0.9'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.opacity = '1'
      }}>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        {text}
      </button>
    </Link>
  )
}

import PropTypes from 'prop-types'

StatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
}

QuickActionButton.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
}
