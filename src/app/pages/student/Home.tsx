import {
  BookOpen,
  FileText,
  Trophy,
  Calendar,
  Brain,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const todaysClasses = [
  { time: '09:00 AM', subject: 'Mathematics', teacher: 'Mrs. Johnson', room: 'Room 205' },
  { time: '11:00 AM', subject: 'Physics', teacher: 'Mr. Chen', room: 'Room 301' },
  { time: '02:00 PM', subject: 'English', teacher: 'Ms. Davis', room: 'Room 105' },
];

const pendingAssignments = [
  { title: 'Algebra Quiz', subject: 'Mathematics', dueDate: 'Today', priority: 'high' },
  { title: 'Essay on Shakespeare', subject: 'English', dueDate: 'Tomorrow', priority: 'medium' },
  { title: 'Lab Report', subject: 'Physics', dueDate: 'Jun 5', priority: 'low' },
];

const upcomingTests = [
  { title: 'Mid-term Math Exam', date: 'Jun 8', subject: 'Mathematics' },
  { title: 'Physics Quiz', date: 'Jun 10', subject: 'Physics' },
];

export function StudentHome() {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Good morning, Alex!</h2>
              <p className="text-muted-foreground">You have 3 classes and 3 pending assignments today</p>
            </div>
            <div className="flex items-center gap-2 bg-warning/10 text-warning px-3 py-1.5 rounded-full">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-medium">15 day streak!</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-semibold">85.2%</p>
            <p className="text-xs text-muted-foreground mt-1">Overall Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </div>
            <p className="text-2xl font-semibold">12/15</p>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-lg bg-warning/10">
                <Calendar className="h-6 w-6 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-semibold">92%</p>
            <p className="text-xs text-muted-foreground mt-1">Attendance</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Brain className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <p className="text-2xl font-semibold">45</p>
            <p className="text-xs text-muted-foreground mt-1">AI Sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning */}
      <Card className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm opacity-90 mb-1">Continue Learning</p>
              <h3 className="text-xl font-semibold mb-2">Quadratic Equations</h3>
              <p className="text-sm opacity-75 mb-4">Chapter 5 • Mathematics • 65% complete</p>
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div className="bg-white h-2 rounded-full" style={{ width: '65%' }} />
              </div>
              <Button variant="secondary" size="sm">
                Continue Learning
              </Button>
            </div>
            <BookOpen className="h-20 w-20 opacity-20 ml-4" />
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule & Pending Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysClasses.map((classItem, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg border border-border"
              >
                <div className="text-center min-w-16">
                  <p className="text-sm font-semibold">{classItem.time.split(' ')[0]}</p>
                  <p className="text-xs text-muted-foreground">{classItem.time.split(' ')[1]}</p>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="flex-1">
                  <p className="font-medium">{classItem.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {classItem.teacher} • {classItem.room}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-warning" />
              Pending Assignments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingAssignments.map((assignment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-border"
              >
                <div className="flex-1">
                  <p className="font-medium">{assignment.title}</p>
                  <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                </div>
                <Badge
                  variant={
                    assignment.priority === 'high'
                      ? 'destructive'
                      : assignment.priority === 'medium'
                      ? 'warning'
                      : 'muted'
                  }
                >
                  {assignment.dueDate}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Assignments
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Tutor CTA & Upcoming Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Tutor */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <Brain className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Need Help? Ask AI Tutor</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Get instant help with any topic, anytime. Your AI tutor is ready 24/7!
                </p>
                <Button variant="primary">
                  Start Learning Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTests.map((test, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted">
                <p className="font-medium text-sm">{test.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{test.subject}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Calendar className="h-3 w-3 text-primary" />
                  <span className="text-xs text-primary font-medium">{test.date}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
