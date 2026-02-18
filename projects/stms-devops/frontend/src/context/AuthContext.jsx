import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { API_URL } from '../config/api'

const AuthContext = createContext(null)

// Function to decode and to get the user's token
function getUserFromToken() {
  const token = localStorage.getItem('token')
  if (!token) return null
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { 
      id: payload.userId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      role: payload.role 
    }
  } catch (error) {
    console.error('Invalid token:', error)
    localStorage.removeItem('token')
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUserFromToken)

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (res.ok && data.token) {
      localStorage.setItem('token', data.token)
      const payload = JSON.parse(atob(data.token.split('.')[1]))
      const userData = { 
        id: payload.userId,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        role: payload.role 
      }
      setUser(userData)
      return { success: true, user: userData }
    } else {
      return { success: false, message: data.message || 'Login failed' }
    }
  }

  const register = async (firstName, lastName, email, password, role = 'player') => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password, role })
    })

    const data = await res.json()

    if (res.ok && data.token) {
      localStorage.setItem('token', data.token)
      const payload = JSON.parse(atob(data.token.split('.')[1]))
      const userData = { 
        id: payload.userId,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        role: payload.role 
      }
      setUser(userData)
      return { success: true, user: userData }
    } else {
      return { success: false, message: data.message || 'Registration failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
