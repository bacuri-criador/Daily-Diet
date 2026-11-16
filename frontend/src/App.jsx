import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './components/AppLayout.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import MealsPage from './pages/MealsPage.jsx';
import MealFormPage from './pages/MealFormPage.jsx';
import MealDetailsPage from './pages/MealDetailsPage.jsx';

export default function App() {
  const { loading } = useAuth();
  if (loading) return <div className="page-loader"><span className="spinner" /> Preparando seu espaço...</div>;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/refeicoes" element={<MealsPage />} />
          <Route path="/refeicoes/nova" element={<MealFormPage />} />
          <Route path="/refeicoes/:id" element={<MealDetailsPage />} />
          <Route path="/refeicoes/:id/editar" element={<MealFormPage editing />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
