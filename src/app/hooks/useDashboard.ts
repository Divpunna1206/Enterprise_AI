import { useEffect, useState } from 'react';

import { dashboardsApi } from '../api/dashboards.api';
import { normalizeApiError } from '../api/client';
import type { ApiError } from '../types/api.types';
import type { DashboardPayload } from '../types/dashboard.types';
import type { PlatformRole } from '../types/auth.types';

const dashboardLoaders: Record<PlatformRole, () => Promise<DashboardPayload>> = {
  SUPER_ADMIN: () => dashboardsApi.getSuperAdmin(),
  SCHOOL_ADMIN: () => dashboardsApi.getSchoolAdmin(),
  PRINCIPAL: () => dashboardsApi.getPrincipal(),
  TEACHER: () => dashboardsApi.getTeacher(),
  STUDENT: () => dashboardsApi.getStudent(),
  PARENT: () => dashboardsApi.getParent(),
  ACCOUNTANT: () => dashboardsApi.getAccountant(),
};

export function useDashboard(role: PlatformRole, enabled = true) {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<ApiError | null>(null);

  const load = async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await dashboardLoaders[role]();
      setData(response);
    } catch (dashboardError) {
      setError(normalizeApiError(dashboardError));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [enabled, role]);

  return {
    data,
    error,
    loading,
    refetch: load,
  };
}

