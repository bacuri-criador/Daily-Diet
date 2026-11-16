import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader"><span className="spinner" /> Carregando sua conta...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
