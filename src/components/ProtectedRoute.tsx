import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Carregando...</div>;
  }
  
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export default ProtectedRoute;