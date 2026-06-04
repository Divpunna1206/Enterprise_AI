import { Outlet, Link, useLocation } from 'react-router';
import { Home, TrendingUp, Calendar, FileText, DollarSign, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { title: 'Home', href: '/parent/home', icon: Home },
  { title: 'Progress', href: '/parent/progress', icon: TrendingUp },
  { title: 'Attendance', href: '/parent/attendance', icon: Calendar },
  { title: 'Assignments', href: '/parent/assignments', icon: FileText },
  { title: 'Fees', href: '/parent/fees', icon: DollarSign },
  { title: 'Messages', href: '/parent/messages', icon: MessageSquare },
];

export function ParentLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Header - Mobile */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-success to-success/80 text-white p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">Ascentia Parent Portal</h1>
              <p className="text-sm opacity-90">Monitoring: Alex Johnson</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white font-semibold text-lg">
              P
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation - Mobile First */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden">
        <div className="grid grid-cols-6 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 transition-colors',
                  isActive
                    ? 'text-success'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
