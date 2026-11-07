import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import CookieBanner from './components/CookieBanner'
import DashboardPage from './pages/DashboardPage'
import DietDetailPage from './pages/DietDetailPage'
import DietsPage from './pages/DietsPage'
import ExercisesPage from './pages/ExercisesPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import UsersPage from './pages/UsersPage'
import WorkoutDetailPage from './pages/WorkoutDetailPage'
import WorkoutFormPage from './pages/WorkoutFormPage'
import WorkoutsPage from './pages/WorkoutsPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import TermsPage from './pages/TermsPage'

export default function App() {
  return (
    <BrowserRouter>
      <CookieBanner />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/privacidade" element={<PrivacyPolicyPage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />
        <Route path="/termos" element={<TermsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/inicio" replace />} />
            <Route path="/inicio" element={<DashboardPage />} />

            <Route path="/treinos" element={<WorkoutsPage />} />
            <Route path="/treinos/novo" element={<WorkoutFormPage />} />
            <Route path="/treinos/:id" element={<WorkoutDetailPage />} />
            <Route path="/treinos/:id/editar" element={<WorkoutFormPage />} />

            <Route path="/exercicios" element={<ExercisesPage />} />

            <Route path="/dietas" element={<DietsPage />} />
            <Route path="/dietas/:id" element={<DietDetailPage />} />

            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/usuarios" element={<UsersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
