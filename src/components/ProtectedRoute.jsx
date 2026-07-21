import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requireAdmin = false, allowedRoles }) {
  const userStr = localStorage.getItem('achl_user');
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // Check custom roles list
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }

    // Fallback logic for legacy requireAdmin parameter
    if (requireAdmin && user.role !== 'Admin' && user.role !== 'SuperAdmin') {
      return <Navigate to="/dashboard" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return children;
}
