import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import { useAuth } from '../hooks/useAuth';
import type { PlatformRole } from '../types/auth.types';
import { roleRoutes } from './roleRoutes';

export function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles?: PlatformRole[];
  children: ReactNode;
}) {
  const location = useLocation();
  const { isAuthenticated, status, user } = useAuth();

  if (status === 'loading' || status === 'idle') {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={roleRoutes[user.role]} replace />;
  }

  return <>{children}</>;
}

