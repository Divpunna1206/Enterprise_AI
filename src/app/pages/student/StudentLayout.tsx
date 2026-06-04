import { Outlet, Link, useLocation } from 'react-router';
import { Home, BookOpen, Brain, FileText, TrendingUp, User } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { title: 'Home', href: '/student/home', icon: Home },
  { title: 'Courses', href: '/student/courses', icon: BookOpen },
  { title: 'AI Tutor', href: '/student/ai-tutor', icon: Brain },
  { title: 'Assignments', href: '/student/assignments', icon: FileText },
  { title: 'Progress', href: '/student/progress', icon: TrendingUp },
  { title: 'Profile', href: '/student/profile', icon: User },
];

export function StudentLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Header - Mobile */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-primary to-primary-hover text-primary-foreground p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">Ascentia</h1>
              <p className="text-sm opacity-90">Welcome back, Alex!</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white font-semibold text-lg">
              A
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
                    ? 'text-primary'
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

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
              A
            </div>
            <div>
              <h2 className="font-semibold">Ascentia</h2>
              <p className="text-xs text-muted-foreground">Student Portal</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="hidden md:block ml-64" />
    </div>
  );
}
