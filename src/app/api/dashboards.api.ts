import { getRequest } from './client';
import type { DashboardPayload } from '../types/dashboard.types';

export const dashboardsApi = {
  getSuperAdmin() {
    return getRequest<DashboardPayload>('/dashboards/super-admin');
  },
  getSchoolAdmin() {
    return getRequest<DashboardPayload>('/dashboards/school-admin');
  },
  getPrincipal() {
    return getRequest<DashboardPayload>('/dashboards/principal');
  },
  getTeacher() {
    return getRequest<DashboardPayload>('/dashboards/teacher');
  },
  getStudent() {
    return getRequest<DashboardPayload>('/dashboards/student');
  },
  getParent() {
    return getRequest<DashboardPayload>('/dashboards/parent');
  },
  getAccountant() {
    return getRequest<DashboardPayload>('/dashboards/accountant');
  },
};

