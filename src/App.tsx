import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import WorkoutsPage from './pages/WorkoutsPage'
import WorkoutDetailPage from './pages/WorkoutDetailPage'
import DietsPage from './pages/DietsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/treinos" element={<WorkoutsPage />} />
            <Route path="/treinos/:id" element={<WorkoutDetailPage />} />
            <Route path="/dietas" element={<DietsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/treinos" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
