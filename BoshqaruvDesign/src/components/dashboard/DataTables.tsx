import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Clock, 
  Users,
  AlertTriangle
} from 'lucide-react';

// Mock data for check-ins
const checkInData = [
  {
    id: '1',
    name: 'Alisher Fayzullayev',
    avatar: 'AF',
    checkIn: '08:45',
    checkOut: '17:30',
    status: 'active',
    department: 'IT bo\'limi',
    late: 0
  },
  {
    id: '2',
    name: 'Nozima Karimova',
    avatar: 'NK',
    checkIn: '09:15',
    checkOut: '--',
    status: 'late',
    department: 'Marketing',
    late: 15
  },
  {
    id: '3',
    name: 'Jamshid Tursunov',
    avatar: 'JT',
    checkIn: '08:30',
    checkOut: '17:00',
    status: 'completed',
    department: 'Moliya',
    late: 0
  },
  {
    id: '4',
    name: 'Dilnoza Rahimova',
    avatar: 'DR',
    checkIn: '09:30',
    checkOut: '--',
    status: 'late',
    department: 'HR',
    late: 30
  },
  {
    id: '5',
    name: 'Bobur Kholmatov',
    avatar: 'BK',
    checkIn: '--',
    checkOut: '--',
    status: 'absent',
    department: 'Logistika',
    late: 0
  },
];

// Mock data for overdue tasks
const overdueTasks = [
  {
    id: '1',
    title: 'Yangi xodimlar uchun training',
    assignee: 'Nozima Karimova',
    assigneeAvatar: 'NK',
    dueDate: '2025-01-08',
    priority: 'high',
    daysOverdue: 3,
    department: 'HR'
  },
  {
    id: '2',
    title: 'Hisobot tayyorlash',
    assignee: 'Jamshid Tursunov',
    assigneeAvatar: 'JT',
    dueDate: '2025-01-10',
    priority: 'medium',
    daysOverdue: 1,
    department: 'Moliya'
  },
  {
    id: '3',
    title: 'Sistema yangilanishi',
    assignee: 'Alisher Fayzullayev',
    assigneeAvatar: 'AF',
    dueDate: '2025-01-05',
    priority: 'high',
    daysOverdue: 6,
    department: 'IT bo\'limi'
  },
];

interface CheckInsTableProps {
  loading?: boolean;
  error?: boolean;
}

export function CheckInsTable({ loading, error }: CheckInsTableProps) {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string, late: number) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Ishlamoqda</Badge>;
      case 'late':
        return <Badge className="bg-warning text-warning-foreground">{late}d kech</Badge>;
      case 'completed':
        return <Badge variant="secondary">Tugagan</Badge>;
      case 'absent':
        return <Badge className="bg-danger text-danger-foreground">Kelmagan</Badge>;
      default:
        return <Badge variant="outline">Noma'lum</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <div className="h-5 bg-muted rounded animate-pulse w-32"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-48 mt-2"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-24"></div>
                </div>
                <div className="h-6 bg-muted rounded animate-pulse w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>So'nggi kirish ma'lumotlari</CardTitle>
              <CardDescription>Bugun kuni xodimlarning kirish holati</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="text-muted-foreground">Ma'lumotlarni yuklashda xatolik</div>
            <Badge variant="outline" className="text-danger border-danger">
              Xatolik
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (checkInData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>So'nggi kirish ma'lumotlari</CardTitle>
              <CardDescription>Bugun kuni xodimlarning kirish holati</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Users className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="font-semibold">Hali kirish ma'lumotlari yo'q</h3>
              <p className="text-muted-foreground text-sm">Xodimlar kirishgach ma'lumotlar ko'rinadi</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>So'nggi kirish ma'lumotlari</CardTitle>
            <CardDescription>Bugun kuni xodimlarning kirish holati</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="h-8 p-0 hover:bg-transparent"
                >
                  Xodim
                  {getSortIcon('name')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('checkIn')}
                  className="h-8 p-0 hover:bg-transparent"
                >
                  Kirish
                  {getSortIcon('checkIn')}
                </Button>
              </TableHead>
              <TableHead>Chiqish</TableHead>
              <TableHead>Bo'lim</TableHead>
              <TableHead>Holat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checkInData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{item.avatar}</AvatarFallback>
                    </Avatar>
                    <span>{item.name}</span>
                  </div>
                </TableCell>
                <TableCell>{item.checkIn}</TableCell>
                <TableCell>{item.checkOut}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.department}</Badge>
                </TableCell>
                <TableCell>
                  {getStatusBadge(item.status, item.late)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface OverdueTasksTableProps {
  loading?: boolean;
  error?: boolean;
}

export function OverdueTasksTable({ loading, error }: OverdueTasksTableProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-danger text-danger-foreground">Yuqori</Badge>;
      case 'medium':
        return <Badge className="bg-warning text-warning-foreground">O'rta</Badge>;
      case 'low':
        return <Badge variant="secondary">Past</Badge>;
      default:
        return <Badge variant="outline">Belgilanmagan</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <div>
              <div className="h-5 bg-muted rounded animate-pulse w-40"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-56 mt-2"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-48"></div>
                    <div className="h-3 bg-muted rounded animate-pulse w-32"></div>
                  </div>
                </div>
                <div className="h-6 bg-muted rounded animate-pulse w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Muddati o'tgan vazifalar</CardTitle>
              <CardDescription>Bajarilmagan va kechikkan vazifalar ro'yxati</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="text-muted-foreground">Ma'lumotlarni yuklashda xatolik</div>
            <Badge variant="outline" className="text-danger border-danger">
              Xatolik
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (overdueTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Muddati o'tgan vazifalar</CardTitle>
              <CardDescription>Bajarilmagan va kechikkan vazifalar ro'yxati</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-success mx-auto" />
            <div>
              <h3 className="font-semibold">Muddati o'tgan vazifalar yo'q</h3>
              <p className="text-muted-foreground text-sm">Barcha vazifalar o'z vaqtida bajarilmoqda</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Muddati o'tgan vazifalar</CardTitle>
            <CardDescription>Bajarilmagan va kechikkan vazifalar ro'yxati</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {overdueTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{task.assigneeAvatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">{task.assignee}</span>
                    <Badge variant="outline" className="text-xs">
                      {task.department}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Muddat: {task.dueDate} • {task.daysOverdue} kun kechikkan
                  </p>
                </div>
              </div>
              <div className="text-right space-y-2">
                {getPriorityBadge(task.priority)}
                <div className="text-xs text-danger">
                  +{task.daysOverdue} kun
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}