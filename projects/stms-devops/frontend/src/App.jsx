import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import CoachesPage from './pages/CoachesPage'
import TeamsPage from './pages/TeamsPage'
import MatchesPage from './pages/MatchesPage'
import TrainingsPage from './pages/TrainingsPage'
import FacilitiesPage from './pages/FacilitiesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/coaches" element={<CoachesPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/trainings" element={<TrainingsPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
