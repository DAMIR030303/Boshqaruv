import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  Calendar,
  MoreVertical,
  UserPlus
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { CreateEmployeeModal } from '../employees/CreateEmployeeModal';
import { toast } from 'sonner';

interface MobileEmployeesProps {
  kpiData: any;
  userProfile: any;
  onDataUpdate: (data: any) => void;
}

const employees = [
  {
    id: 1,
    name: 'Shaxriddin Adizov Sherali o\'g\'li',
    role: 'Marketing boshqaruvchisi',
    department: 'Marketing',
    phone: '+998 94 456 78 90',
    email: 'shaxriddin@boshqaruv.uz',
    status: 'online',
    avatar: '/api/placeholder/40/40',
    startDate: '2023-02-01',
    shift: 'Ertalab (08:00-17:00)',
    salary: '9,200,000',
    address: 'Toshkent, Shayxontohur tumani',
    specialization: 'Digital Marketing, Social Media Management, Content Strategy',
    achievements: ['Instagram follower 50K+', 'Engagement rate 8%+', 'Brand awareness 40% oshishi'],
    responsibilities: ['Instagram kontent yaratish', 'Video montaj', 'Marketing strategiya', 'AI tools bilan ishlash']
  }
];

const departments = ['Hammasi', 'Marketing'];
const statuses = ['Hammasi', 'online', 'away', 'offline'];

export function MobileEmployees({ kpiData, userProfile, onDataUpdate }: MobileEmployeesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Hammasi');
  const [selectedStatus, setSelectedStatus] = useState('Hammasi');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredEmployees = employees.filter((employee: any) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'Hammasi' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'Hammasi' || employee.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleCreateEmployee = (employeeData: any) => {
    console.log('Creating new employee:', employeeData);
    
    // Simulate employee creation
    const newEmployee: any = {
      id: employees.length + 1,
      name: employeeData.name,
      role: employeeData.role,
      department: employeeData.department,
      phone: employeeData.phone,
      email: employeeData.email,
      status: 'online',
      avatar: '/api/placeholder/40/40',
      startDate: new Date().toISOString().split('T')[0],
      shift: employeeData.shift || 'Ertalab (08:00-17:00)',
      salary: employeeData.salary,
      address: employeeData.address,
      specialization: employeeData.specialization || '',
      achievements: employeeData.achievements || [],
      responsibilities: employeeData.responsibilities || []
    };
    
    // Add to employees array (in real app, this would be an API call)
    employees.push(newEmployee);
    
    // Close modal
    setIsCreateModalOpen(false);
    
    // Show success message
    toast.success('Yangi xodim muvaffaqiyatli qo\'shildi!');
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'offline': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Faol';
      case 'away': return 'Band';
      case 'offline': return 'Oflayn';
      default: return 'Noma\'lum';
    }
  };

  return (
    <div className="boshqaruv-container space-6">
      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 mb-6"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Xodimlarni qidiring..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="shrink-0">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[400px]">
              <SheetHeader>
                <SheetTitle>Filterlash</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Department Filter */}
                <div>
                  <label className="block mb-2">Bo'lim</label>
                  <div className="grid grid-cols-2 gap-2">
                    {departments.map((dept) => (
                      <Button
                        key={dept}
                        variant={selectedDepartment === dept ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDepartment(dept)}
                        className="text-xs"
                      >
                        {dept}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block mb-2">Holat</label>
                  <div className="grid grid-cols-2 gap-2">
                    {statuses.map((status) => (
                      <Button
                        key={status}
                        variant={selectedStatus === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedStatus(status)}
                        className="text-xs"
                      >
                        {status === 'Hammasi' ? status : getStatusText(status)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <Button size="sm" className="shrink-0" onClick={openCreateModal}>
            <UserPlus className="h-4 w-4 mr-2" />
            Yangi xodim
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-6"
      >
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{employees.length}</p>
            <p className="text-xs text-muted-foreground">Jami xodimlar</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">
              {employees.filter(e => e.status === 'online').length}
            </p>
            <p className="text-xs text-muted-foreground">Faol</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">
              {employees.filter(e => e.status === 'offline').length}
            </p>
            <p className="text-xs text-muted-foreground">Oflayn</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Employees List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3 mb-8"
      >
        <AnimatePresence>
          {filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedEmployee(employee)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={employee.avatar} alt={employee.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(employee.status)}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground truncate">
                          {employee.name}
                        </h3>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{employee.role}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {employee.department}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {getStatusText(employee.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Employee Details Modal */}
      <Sheet open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          {selectedEmployee && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedEmployee.avatar} alt={selectedEmployee.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {selectedEmployee.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <SheetTitle className="text-left">{selectedEmployee.name}</SheetTitle>
                    <p className="text-muted-foreground">{selectedEmployee.role}</p>
                    <Badge variant="secondary" className="mt-2">
                      {selectedEmployee.department}
                    </Badge>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6">
                {/* Contact Info */}
                <div>
                  <h4 className="font-medium mb-3">Aloqa Ma'lumotlari</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEmployee.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEmployee.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEmployee.address}</span>
                    </div>
                  </div>
                </div>

                {/* Work Info */}
                <div>
                  <h4 className="font-medium mb-3">Ish Ma'lumotlari</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Ishga kirgan sana: {selectedEmployee.startDate}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Smena: {selectedEmployee.shift}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">Maosh: {selectedEmployee.salary} so'm</span>
                    </div>
                  </div>
                </div>

                {/* Specialization for Marketing roles */}
                {selectedEmployee.specialization && (
                  <div>
                    <h4 className="font-medium mb-3">Mutaxassislik</h4>
                    <p className="text-sm text-muted-foreground">{selectedEmployee.specialization}</p>
                  </div>
                )}

                {/* Achievements for Marketing roles */}
                {selectedEmployee.achievements && (
                  <div>
                    <h4 className="font-medium mb-3">Yutuqlar</h4>
                    <div className="space-y-2">
                      {selectedEmployee.achievements.map((achievement: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <span className="text-sm text-foreground">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Responsibilities for Marketing roles */}
                {selectedEmployee.responsibilities && (
                  <div>
                    <h4 className="font-medium mb-3">Mas'uliyatlar</h4>
                    <div className="space-y-2">
                      {selectedEmployee.responsibilities.map((responsibility: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm text-foreground">{responsibility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Qo'ng'iroq
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Employee Modal */}
      <CreateEmployeeModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateEmployee}
      />
    </div>
  );
}