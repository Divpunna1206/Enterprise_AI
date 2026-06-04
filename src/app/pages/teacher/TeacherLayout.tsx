import { Outlet } from 'react-router';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  ClipboardCheck,
  Calendar,
  MessageSquare,
  Brain,
  BarChart3,
} from 'lucide-react';
import { Sidebar, SidebarNavItem } from '../../components/layout/Sidebar';
import { TopNav } from '../../components/layout/TopNav';

const navItems: SidebarNavItem[] = [
  { title: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
  { title: 'My Classes', href: '/teacher/classes', icon: BookOpen },
  { title: 'Students', href: '/teacher/students', icon: Users },
  { title: 'Lessons', href: '/teacher/lessons', icon: FileText },
  { title: 'Assignments', href: '/teacher/assignments', icon: FileText },
  { title: 'Tests & Quizzes', href: '/teacher/tests', icon: ClipboardCheck },
  { title: 'Attendance', href: '/teacher/attendance', icon: Calendar },
  { title: 'AI Tutor Logs', href: '/teacher/ai-logs', icon: Brain },
  { title: 'Reports', href: '/teacher/reports', icon: BarChart3 },
  { title: 'Messages', href: '/teacher/messages', icon: MessageSquare },
];

export function TeacherLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        brandName="Ascentia"
        navItems={navItems}
        userRole="Teacher"
        userName="Sarah Johnson"
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
