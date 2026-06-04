import {
  Users,
  BookOpen,
  GraduationCap,
  CheckCircle,
  TrendingUp,
  Calendar,
  Activity,
  Brain,
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const performanceData = [
  { month: 'Jan', performance: 75 },
  { month: 'Feb', performance: 78 },
  { month: 'Mar', performance: 82 },
  { month: 'Apr', performance: 85 },
  { month: 'May', performance: 88 },
  { month: 'Jun', performance: 92 },
];

const attendanceData = [
  { class: '10A', attendance: 95 },
  { class: '10B', attendance: 88 },
  { class: '9A', attendance: 92 },
  { class: '9B', attendance: 85 },
  { class: '8A', attendance: 90 },
];

const recentActivities = [
  { teacher: 'Sarah Johnson', action: 'Created assignment', subject: 'Mathematics', time: '2 hours ago' },
  { teacher: 'Michael Chen', action: 'Marked attendance', subject: 'Science', time: '3 hours ago' },
  { teacher: 'Emily Davis', action: 'Published quiz', subject: 'English', time: '5 hours ago' },
  { teacher: 'David Wilson', action: 'Sent parent update', subject: 'History', time: '1 day ago' },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value="2,847"
          change="+12% from last month"
          changeType="positive"
          icon={GraduationCap}
          iconColor="text-primary"
        />
        <StatCard
          title="Active Teachers"
          value="145"
          change="+5 new this month"
          changeType="positive"
          icon={Users}
          iconColor="text-success"
        />
        <StatCard
          title="Active Classes"
          value="68"
          change="Across 12 grades"
          changeType="neutral"
          icon={BookOpen}
          iconColor="text-warning"
        />
        <StatCard
          title="Attendance Rate"
          value="92.5%"
          change="+2.3% this week"
          changeType="positive"
          icon={CheckCircle}
          iconColor="text-success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Overall Performance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Line type="monotone" dataKey="performance" stroke="#2563EB" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance by Class */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-success" />
              Attendance by Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="class" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="attendance" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & AI Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Teacher Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{activity.teacher}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell>
                      <Badge variant="primary">{activity.subject}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{activity.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* AI Usage Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Usage This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">AI Tutor Sessions</span>
                <span className="font-semibold">1,245</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">AI Quiz Generated</span>
                <span className="font-semibold">342</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Doubt Resolutions</span>
                <span className="font-semibold">856</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-warning h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Token Usage</span>
                <Badge variant="success">89% of limit</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
