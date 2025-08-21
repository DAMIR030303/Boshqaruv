import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { ButtonEnhanced } from '../enhanced/ButtonEnhanced';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase,
  Edit,
  X,
  Clock,
  Award,
  Activity
} from 'lucide-react';

// Mock detailed employee data
const mockEmployeeDetails = {
  '1': {
    id: '1',
    name: 'Alisher Fayzullayev',
    dept: 'IT bo\'limi',
    role: 'Senior Developer',
    status: 'active',
    phone: '+998 90 123 45 67',
    email: 'alisher.f@company.uz',
    startDate: '2022-03-15',
    avatar: 'AF',
    address: 'Toshkent sh., Yunusobod tumani, 5-uy',
    birthDate: '1990-05-12',
    salary: '8,000,000',
    workSchedule: '09:00 - 18:00',
    manager: 'Nozima Karimova',
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    education: 'TATU - Kompyuter injiniringi',
    experience: '5 yil',
    projects: [
      { name: 'CRM tizimi', status: 'Faol', completion: 85 },
      { name: 'Mobile ilovasi', status: 'Tugagan', completion: 100 },
      { name: 'Dashboard loyihasi', status: 'Rejalashtirish', completion: 15 }
    ],
    performance: {
      thisMonth: 92,
      lastMonth: 88,
      avgRating: 4.5
    },
    attendance: {
      present: 22,
      late: 2,
      absent: 1,
      totalDays: 25
    }
  },
  // Add more mock data for other employees as needed
};

interface EmployeeDrawerProps {
  employeeId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (employeeId: string) => void;
}

export function EmployeeDrawer({ employeeId, isOpen, onClose, onEdit }: EmployeeDrawerProps) {
  const employee = employeeId ? mockEmployeeDetails[employeeId as keyof typeof mockEmployeeDetails] : null;

  if (!employee) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full tablet:w-[400px] desktop:w-[500px]">
          <SheetHeader>
            <SheetTitle>Xodim ma'lumotlari</SheetTitle>
            <SheetDescription>Xodim haqida batafsil ma'lumotlar</SheetDescription>
          </SheetHeader>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Xodim ma'lumotlari topilmadi</p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Faol</Badge>;
      case 'inactive':
        return <Badge className="bg-danger text-danger-foreground">Faol emas</Badge>;
      default:
        return <Badge variant="outline">Noma'lum</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-danger';
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full tablet:w-[400px] desktop:w-[500px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Xodim profili</SheetTitle>
              <SheetDescription>
                {employee.name} haqida batafsil ma'lumotlar
              </SheetDescription>
            </div>
            <ButtonEnhanced
              variant="outline"
              size="sm"
              iconLeft={<Edit className="h-4 w-4" />}
              onClick={() => onEdit(employee.id)}
            >
              Tahrirlash
            </ButtonEnhanced>
          </div>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Basic Information */}
          <div className="text-center space-y-4">
            <Avatar className="h-20 w-20 mx-auto">
              <AvatarFallback className="text-lg">{employee.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{employee.name}</h3>
              <p className="text-muted-foreground">{employee.role}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant="outline">{employee.dept}</Badge>
                {getStatusBadge(employee.status)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Aloqa ma'lumotlari
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.address}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Work Information */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Ish ma'lumotlari
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ish boshlagan sana:</span>
                <span className="text-sm">{formatDate(employee.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ish vaqti:</span>
                <span className="text-sm">{employee.workSchedule}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Rahbar:</span>
                <span className="text-sm">{employee.manager}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Maosh:</span>
                <span className="text-sm font-medium">{employee.salary} so'm</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Performance */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Samaradorlik
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Joriy oy:</span>
                <span className={`text-sm font-medium ${getPerformanceColor(employee.performance.thisMonth)}`}>
                  {employee.performance.thisMonth}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">O'tgan oy:</span>
                <span className={`text-sm font-medium ${getPerformanceColor(employee.performance.lastMonth)}`}>
                  {employee.performance.lastMonth}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">O'rtacha reyting:</span>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">{employee.performance.avgRating}/5</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Attendance */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Davomat (joriy oy)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">{employee.attendance.present}</div>
                <div className="text-xs text-muted-foreground">Kelgan</div>
              </div>
              <div className="text-center p-3 bg-warning/10 rounded-lg">
                <div className="text-2xl font-bold text-warning">{employee.attendance.late}</div>
                <div className="text-xs text-muted-foreground">Kech kelgan</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-danger/10 rounded-lg">
                <div className="text-2xl font-bold text-danger">{employee.attendance.absent}</div>
                <div className="text-xs text-muted-foreground">Kelmagan</div>
              </div>
              <div className="text-center p-3 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-muted-foreground">{employee.attendance.totalDays}</div>
                <div className="text-xs text-muted-foreground">Jami kunlar</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Skills */}
          <div className="space-y-4">
            <h4 className="font-medium">Ko'nikmalar</h4>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Current Projects */}
          <div className="space-y-4">
            <h4 className="font-medium">Joriy loyihalar</h4>
            <div className="space-y-3">
              {employee.projects.map((project, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-sm">{project.name}</h5>
                    <Badge 
                      variant={project.status === 'Faol' ? 'default' : 
                              project.status === 'Tugagan' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${project.completion}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{project.completion}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Education & Experience */}
          <div className="space-y-4">
            <h4 className="font-medium">Ta'lim va tajriba</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ta'lim:</span>
                <span className="text-sm">{employee.education}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tajriba:</span>
                <span className="text-sm">{employee.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tug'ilgan sana:</span>
                <span className="text-sm">{formatDate(employee.birthDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}