import {
  BookOpen,
  FileText,
  Users,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const todaysClasses = [
  { time: '09:00 AM', subject: 'Mathematics', class: 'Grade 10A', room: 'Room 205', status: 'upcoming' },
  { time: '11:00 AM', subject: 'Statistics', class: 'Grade 11B', room: 'Room 205', status: 'upcoming' },
  { time: '02:00 PM', subject: 'Mathematics', class: 'Grade 10B', room: 'Room 205', status: 'pending' },
];

const pendingAssignments = [
  { title: 'Algebra Quiz', class: 'Grade 10A', submissions: 28, total: 32, dueDate: 'Today' },
  { title: 'Calculus Assignment', class: 'Grade 11B', submissions: 19, total: 25, dueDate: 'Tomorrow' },
  { title: 'Geometry Problem Set', class: 'Grade 10B', submissions: 15, total: 30, dueDate: 'Jun 5' },
];

const studentDoubts = [
  { student: 'Emma Wilson', subject: 'Quadratic Equations', class: 'Grade 10A', time: '30 min ago', priority: 'high' },
  { student: 'James Lee', subject: 'Derivatives', class: 'Grade 11B', time: '1 hour ago', priority: 'medium' },
  { student: 'Sophia Chen', subject: 'Trigonometry', class: 'Grade 10B', time: '2 hours ago', priority: 'low' },
];

export function TeacherDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Students"
          value="142"
          change="Across 5 classes"
          changeType="neutral"
          icon={Users}
          iconColor="text-primary"
        />
        <StatCard
          title="Pending Reviews"
          value="23"
          change="Assignments to grade"
          changeType="neutral"
          icon={FileText}
          iconColor="text-warning"
        />
        <StatCard
          title="Classes Today"
          value="3"
          change="Next in 45 mins"
          changeType="neutral"
          icon={BookOpen}
          iconColor="text-success"
        />
        <StatCard
          title="Avg Class Score"
          value="85.2%"
          change="+3.5% this month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Classes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Today's Schedule
              </CardTitle>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4" />
                View Full Schedule
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysClasses.map((classItem, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold">{classItem.time.split(' ')[0]}</span>
                    <span className="text-xs text-muted-foreground">{classItem.time.split(' ')[1]}</span>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <p className="font-semibold">{classItem.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {classItem.class} • {classItem.room}
                    </p>
                  </div>
                </div>
                <Button variant="primary" size="sm">
                  Mark Attendance
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="primary" className="w-full justify-start">
              <FileText className="h-4 w-4" />
              Create Assignment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ClipboardCheck className="h-4 w-4" />
              Create Quiz
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4" />
              Mark Attendance
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4" />
              Send Parent Update
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pending Assignments & Doubts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-warning" />
              Pending Assignment Reviews
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
                  <p className="text-sm text-muted-foreground">{assignment.class}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {assignment.submissions}/{assignment.total}
                  </p>
                  <p className="text-xs text-muted-foreground">submitted</p>
                </div>
                <Badge variant="warning" className="ml-3">
                  {assignment.dueDate}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Student Doubts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Student Doubts via AI Tutor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {studentDoubts.map((doubt, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 rounded-lg border border-border"
              >
                <div className="flex-1">
                  <p className="font-medium">{doubt.student}</p>
                  <p className="text-sm text-muted-foreground">{doubt.subject}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {doubt.class} • {doubt.time}
                  </p>
                </div>
                <Badge
                  variant={
                    doubt.priority === 'high'
                      ? 'destructive'
                      : doubt.priority === 'medium'
                      ? 'warning'
                      : 'muted'
                  }
                >
                  {doubt.priority}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Doubts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
