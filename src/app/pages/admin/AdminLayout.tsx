import { Outlet } from 'react-router';
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  UserCircle,
  BookOpen,
  FileText,
  ClipboardCheck,
  Calendar,
  BarChart3,
  Megaphone,
  DollarSign,
  Brain,
  Settings,
} from 'lucide-react';
import { Sidebar, SidebarNavItem } from '../../components/layout/Sidebar';
import { TopNav } from '../../components/layout/TopNav';

const navItems: SidebarNavItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Organization', href: '/admin/organization', icon: Building2 },
  { title: 'Teachers', href: '/admin/teachers', icon: Users },
  { title: 'Students', href: '/admin/students', icon: GraduationCap },
  { title: 'Parents', href: '/admin/parents', icon: UserCircle },
  { title: 'Classes', href: '/admin/classes', icon: BookOpen },
  { title: 'Assignments', href: '/admin/assignments', icon: FileText },
  { title: 'Tests', href: '/admin/tests', icon: ClipboardCheck },
  { title: 'Attendance', href: '/admin/attendance', icon: Calendar },
  { title: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { title: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { title: 'Fees', href: '/admin/fees', icon: DollarSign },
  { title: 'AI Usage', href: '/admin/ai-usage', icon: Brain },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        brandName="Ascentia"
        navItems={navItems}
        userRole="Org Admin"
        userName="John Anderson"
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav title="Dashboard" />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
