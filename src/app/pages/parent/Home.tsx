import {
  TrendingUp,
  Calendar,
  FileText,
  Trophy,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  MessageSquare,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const todayHighlights = [
  { type: 'attendance', status: 'present', time: '08:45 AM' },
  { type: 'test', score: '92%', subject: 'Mathematics' },
  { type: 'assignment', status: 'submitted', subject: 'Physics' },
];

const recentTests = [
  { subject: 'Mathematics', score: 92, total: 100, date: 'Jun 1', average: 85 },
  { subject: 'Physics', score: 88, total: 100, date: 'May 28', average: 82 },
  { subject: 'English', score: 95, total: 100, date: 'May 25', average: 87 },
];

const teacherRemarks = [
  {
    teacher: 'Mrs. Johnson',
    subject: 'Mathematics',
    remark: 'Alex shows excellent problem-solving skills and consistent improvement.',
    date: '2 days ago',
  },
  {
    teacher: 'Mr. Chen',
    subject: 'Physics',
    remark: 'Good participation in lab activities. Encourage more practice with numericals.',
    date: '5 days ago',
  },
];

export function ParentHome() {
  return (
    <div className="space-y-6">
      {/* Child Profile Card */}
      <Card className="bg-gradient-to-br from-success/10 to-primary/10 border-success/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-white font-semibold text-2xl">
              A
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-1">Alex Johnson</h2>
              <p className="text-muted-foreground mb-3">Grade 10A • Roll No: 2847</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Present Today
                </Badge>
                <Badge variant="primary">
                  <Trophy className="h-3 w-3 mr-1" />
                  Top 10% of Class
                </Badge>
                <Badge variant="warning">
                  <Star className="h-3 w-3 mr-1" />
                  15 Day Streak
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
            <p className="text-2xl font-semibold">88.5%</p>
            <p className="text-xs text-muted-foreground mt-1">Overall Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-semibold">95%</p>
            <p className="text-xs text-muted-foreground mt-1">Attendance</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-lg bg-warning/10">
                <FileText className="h-6 w-6 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-semibold">2</p>
            <p className="text-xs text-muted-foreground mt-1">Pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-lg bg-success/10">
                <Trophy className="h-6 w-6 text-success" />
              </div>
            </div>
            <p className="text-2xl font-semibold">Rank 7</p>
            <p className="text-xs text-muted-foreground mt-1">in Class</p>
          </CardContent>
        </Card>
      </div>

      {/* This Week's Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            This Week's Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-2">Classes Attended</p>
              <p className="text-2xl font-semibold">18/19</p>
              <div className="w-full bg-background rounded-full h-2 mt-3">
                <div className="bg-success h-2 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-2">Assignments Submitted</p>
              <p className="text-2xl font-semibold">5/7</p>
              <div className="w-full bg-background rounded-full h-2 mt-3">
                <div className="bg-warning h-2 rounded-full" style={{ width: '71%' }} />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-2">AI Tutor Sessions</p>
              <p className="text-2xl font-semibold">12</p>
              <div className="w-full bg-background rounded-full h-2 mt-3">
                <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Test Results & Teacher Remarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Test Results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Recent Test Results
              </CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTests.map((test, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-border"
              >
                <div className="flex-1">
                  <p className="font-medium">{test.subject}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {test.date} • Class avg: {test.average}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-success">{test.score}%</p>
                  <p className="text-xs text-muted-foreground">{test.score}/{test.total}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Teacher Remarks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Teacher Remarks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teacherRemarks.map((remark, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{remark.teacher}</p>
                    <p className="text-sm text-muted-foreground">{remark.subject}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{remark.date}</span>
                </div>
                <p className="text-sm mt-2">{remark.remark}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Messages
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      <Card className="border-warning/50 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Pending Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-warning/20 bg-background">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <FileText className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-medium">2 Assignments Due Soon</p>
                <p className="text-sm text-muted-foreground">Physics & English - Due tomorrow</p>
              </div>
            </div>
            <Button variant="warning" size="sm">
              Remind Child
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/20 bg-background">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <DollarSign className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="font-medium">Fee Payment Pending</p>
                <p className="text-sm text-muted-foreground">Quarter 2 Fees - ₹15,000</p>
              </div>
            </div>
            <Button variant="destructive" size="sm">
              Pay Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
