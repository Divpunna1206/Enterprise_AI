import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Building2, GraduationCap, Users, BookOpen } from 'lucide-react';

const roles = [
  {
    id: 'admin',
    title: 'Organization Admin',
    description: 'Manage institute, teachers, students, and settings',
    icon: Building2,
    route: '/admin/dashboard',
    color: 'text-primary',
  },
  {
    id: 'teacher',
    title: 'Teacher',
    description: 'Manage classes, assignments, and student progress',
    icon: BookOpen,
    route: '/teacher/dashboard',
    color: 'text-success',
  },
  {
    id: 'student',
    title: 'Student',
    description: 'Access courses, AI tutor, and track your learning',
    icon: GraduationCap,
    route: '/student/home',
    color: 'text-warning',
  },
  {
    id: 'parent',
    title: 'Parent',
    description: 'Monitor your childs progress and performance',
    icon: Users,
    route: '/parent/home',
    color: 'text-secondary',
  },
];

export function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-2">Select Your Role</h1>
          <p className="text-muted-foreground">Choose how you'd like to access Ascentia</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
                onClick={() => navigate(role.route)}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-accent ${role.color}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <CardTitle>{role.title}</CardTitle>
                      <CardDescription className="mt-1">{role.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
