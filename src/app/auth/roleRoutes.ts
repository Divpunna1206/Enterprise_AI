import type { Role } from '../lms/mockData';
import type { PlatformRole } from '../types/auth.types';

export const roleRoutes: Record<PlatformRole, string> = {
  SUPER_ADMIN: '/super-admin/dashboard',
  SCHOOL_ADMIN: '/school-admin/dashboard',
  PRINCIPAL: '/principal/dashboard',
  TEACHER: '/teacher/dashboard',
  STUDENT: '/student/home',
  PARENT: '/parent/home',
  ACCOUNTANT: '/accountant/dashboard',
};

export const platformRoleToAppRole: Record<PlatformRole, Role> = {
  SUPER_ADMIN: 'super-admin',
  SCHOOL_ADMIN: 'school-admin',
  PRINCIPAL: 'principal',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
  ACCOUNTANT: 'accountant',
};

export const appRoleToPlatformRole: Record<Role, PlatformRole> = {
  'super-admin': 'SUPER_ADMIN',
  'school-admin': 'SCHOOL_ADMIN',
  principal: 'PRINCIPAL',
  teacher: 'TEACHER',
  student: 'STUDENT',
  parent: 'PARENT',
  accountant: 'ACCOUNTANT',
};

