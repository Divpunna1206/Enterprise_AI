import { useState } from 'react';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

const teachers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@ascentia.edu',
    subjects: ['Mathematics', 'Statistics'],
    classes: 5,
    students: 142,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@ascentia.edu',
    subjects: ['Physics', 'Chemistry'],
    classes: 4,
    students: 118,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily.davis@ascentia.edu',
    subjects: ['English', 'Literature'],
    classes: 6,
    students: 165,
    status: 'Active',
  },
  {
    id: 4,
    name: 'David Wilson',
    email: 'david.wilson@ascentia.edu',
    subjects: ['History', 'Geography'],
    classes: 3,
    students: 89,
    status: 'Active',
  },
  {
    id: 5,
    name: 'Jennifer Lee',
    email: 'jennifer.lee@ascentia.edu',
    subjects: ['Biology'],
    classes: 4,
    students: 112,
    status: 'Invited',
  },
];

export function Teachers() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Teacher Management</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all teachers</p>
        </div>
        <Button size="lg">
          <Plus className="h-5 w-5" />
          Add Teacher
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Teachers</p>
            <p className="text-2xl font-semibold mt-1">145</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-semibold mt-1 text-success">138</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Invited</p>
            <p className="text-2xl font-semibold mt-1 text-warning">7</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg Students/Teacher</p>
            <p className="text-2xl font-semibold mt-1">19.6</p>
          </CardContent>
        </Card>
      </div>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Teachers</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search teachers..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell className="text-muted-foreground">{teacher.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((subject, idx) => (
                        <Badge key={idx} variant="primary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{teacher.classes}</TableCell>
                  <TableCell>{teacher.students}</TableCell>
                  <TableCell>
                    <Badge variant={teacher.status === 'Active' ? 'success' : 'warning'}>
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
