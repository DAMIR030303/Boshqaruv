import { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { ButtonEnhanced } from '../enhanced/ButtonEnhanced';
import { SelectEnhanced } from '../enhanced/FormComponents';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { 
  Users,
  Search,
  Plus,
  X,
  Check,
  User,
  Building,
  Mail,
  Phone,
  Save,
  AlertTriangle
} from 'lucide-react';

// Mock employee data
const mockEmployees = [
  {
    id: '1',
    name: 'Alisher Fayzullayev',
    dept: 'IT bo\'limi',
    role: 'Senior Developer',
    email: 'alisher.f@company.uz',
    phone: '+998 90 123 45 67',
    avatar: 'AF',
    status: 'active',
    isAssigned: true
  },
  {
    id: '2',
    name: 'Nozima Karimova',
    dept: 'Marketing',
    role: 'Marketing Manager',
    email: 'nozima.k@company.uz',
    phone: '+998 91 234 56 78',
    avatar: 'NK',
    status: 'active',
    isAssigned: false
  },
  {
    id: '3',
    name: 'Jamshid Tursunov',
    dept: 'Moliya',
    role: 'Financial Analyst',
    email: 'jamshid.t@company.uz',
    phone: '+998 93 345 67 89',
    avatar: 'JT',
    status: 'active',
    isAssigned: true
  },
  {
    id: '4',
    name: 'Dilnoza Rahimova',
    dept: 'HR',
    role: 'HR Specialist',
    email: 'dilnoza.r@company.uz',
    phone: '+998 94 456 78 90',
    avatar: 'DR',
    status: 'active',
    isAssigned: false
  },
  {
    id: '5',
    name: 'Bobur Kholmatov',
    dept: 'Logistika',
    role: 'Logistics Coordinator',
    email: 'bobur.k@company.uz',
    phone: '+998 95 567 89 01',
    avatar: 'BK',
    status: 'active',
    isAssigned: false
  },
  {
    id: '6',
    name: 'Sevara Abdullayeva',
    dept: 'IT bo\'limi',
    role: 'UI/UX Designer',
    email: 'sevara.a@company.uz',
    phone: '+998 97 678 90 12',
    avatar: 'SA',
    status: 'inactive',
    isAssigned: false
  },
];

interface AssignEmployeesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeIds: string[]) => void;
  shiftId: string | null;
  shiftTitle?: string;
}

export function AssignEmployeesDrawer({ isOpen, onClose, onSave, shiftId, shiftTitle }: AssignEmployeesDrawerProps) {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen && shiftId) {
      // Reset state when drawer opens
      setEmployees(mockEmployees);
      setSearchQuery('');
      setSelectedDept('all');
      setSelectedStatus('all');
      setHasChanges(false);
    }
  }, [isOpen, shiftId]);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' || emp.dept === selectedDept;
    const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus;
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  const assignedEmployees = employees.filter(emp => emp.isAssigned);
  const availableEmployees = filteredEmployees.filter(emp => !emp.isAssigned);

  const handleToggleEmployee = (employeeId: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { ...emp, isAssigned: !emp.isAssigned }
        : emp
    ));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const assignedIds = employees.filter(emp => emp.isAssigned).map(emp => emp.id);
      await onSave(assignedIds);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving employee assignments:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      if (confirm('Saqlanmagan o\'zgarishlar bor. Chiqishni xohlaysizmi?')) {
        setHasChanges(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  const departmentOptions = [
    { value: 'all', label: 'Barcha bo\'limlar' },
    { value: 'IT bo\'limi', label: 'IT bo\'limi' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Moliya', label: 'Moliya' },
    { value: 'HR', label: 'HR' },
    { value: 'Logistika', label: 'Logistika' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Barcha holatlar' },
    { value: 'active', label: 'Faol xodimlar' },
    { value: 'inactive', label: 'Faol emas' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full tablet:w-[500px] desktop:w-[600px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div>
            <SheetTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Xodimlarni tayinlash
            </SheetTitle>
            <SheetDescription>
              "{shiftTitle}" smenasiga xodimlarni tayinlang
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Currently Assigned */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Tayinlangan xodimlar</h4>
              <Badge variant="secondary">{assignedEmployees.length} xodim</Badge>
            </div>
            
            {assignedEmployees.length === 0 ? (
              <div className="p-4 border border-dashed rounded-lg text-center">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Hali xodimlar tayinlanmagan
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {assignedEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{employee.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-muted-foreground">{employee.role}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleEmployee(employee.id)}
                      className="text-danger hover:bg-danger/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Search and Filters */}
          <div className="space-y-4">
            <h4 className="font-medium">Mavjud xodimlar</h4>
            
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Xodimni qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <SelectEnhanced
                  placeholder="Bo'lim"
                  options={departmentOptions}
                  value={selectedDept}
                  onValueChange={setSelectedDept}
                />
                <SelectEnhanced
                  placeholder="Holat"
                  options={statusOptions}
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                />
              </div>
            </div>
          </div>

          {/* Available Employees */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {availableEmployees.length} ta xodim topildi
              </span>
            </div>

            {availableEmployees.length === 0 ? (
              <div className="p-4 border border-dashed rounded-lg text-center">
                <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Mavjud xodimlar topilmadi
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Qidiruv shartlarini o'zgartiring
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableEmployees.map((employee) => (
                  <div 
                    key={employee.id} 
                    className={`flex items-center gap-3 p-3 border rounded-lg transition-colors hover:bg-muted/50 cursor-pointer ${
                      employee.status === 'inactive' ? 'opacity-60' : ''
                    }`}
                    onClick={() => employee.status === 'active' && handleToggleEmployee(employee.id)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{employee.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{employee.name}</p>
                        {employee.status === 'inactive' && (
                          <Badge variant="outline" className="text-xs">Faol emas</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          <span>{employee.dept}</span>
                        </div>
                        <span>{employee.role}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{employee.phone}</span>
                        </div>
                      </div>
                    </div>
                    {employee.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                    {employee.status === 'inactive' && (
                      <div className="flex items-center text-muted-foreground">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {assignedEmployees.length} xodim tayinlangan
              {hasChanges && (
                <span className="text-warning ml-2">• Saqlanmagan o'zgarishlar</span>
              )}
            </div>
            <div className="flex gap-2">
              <ButtonEnhanced
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Bekor qilish
              </ButtonEnhanced>
              <ButtonEnhanced
                variant="primary"
                iconLeft={<Save className="h-4 w-4" />}
                onClick={handleSave}
                loading={isSubmitting}
                disabled={!hasChanges}
              >
                Saqlash
              </ButtonEnhanced>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}