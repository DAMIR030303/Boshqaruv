import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { ButtonEnhanced } from '../enhanced/ButtonEnhanced';
import { SelectEnhanced } from '../enhanced/FormComponents';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  UserX,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  Download,
  Plus
} from 'lucide-react';

// Mock employee data
const mockEmployees = [
  {
    id: '1',
    name: 'Alisher Fayzullayev',
    dept: 'IT bo\'limi',
    role: 'Senior Developer',
    status: 'active',
    phone: '+998 90 123 45 67',
    email: 'alisher.f@company.uz',
    startDate: '2022-03-15',
    avatar: 'AF'
  },
  {
    id: '2',
    name: 'Nozima Karimova',
    dept: 'Marketing',
    role: 'Marketing Manager',
    status: 'active',
    phone: '+998 91 234 56 78',
    email: 'nozima.k@company.uz',
    startDate: '2021-08-20',
    avatar: 'NK'
  },
  {
    id: '3',
    name: 'Jamshid Tursunov',
    dept: 'Moliya',
    role: 'Financial Analyst',
    status: 'inactive',
    phone: '+998 93 345 67 89',
    email: 'jamshid.t@company.uz',
    startDate: '2020-12-10',
    avatar: 'JT'
  },
  {
    id: '4',
    name: 'Dilnoza Rahimova',
    dept: 'HR',
    role: 'HR Specialist',
    status: 'active',
    phone: '+998 94 456 78 90',
    email: 'dilnoza.r@company.uz',
    startDate: '2023-01-25',
    avatar: 'DR'
  },
  {
    id: '5',
    name: 'Bobur Kholmatov',
    dept: 'Logistika',
    role: 'Logistics Coordinator',
    status: 'active',
    phone: '+998 95 567 89 01',
    email: 'bobur.k@company.uz',
    startDate: '2022-07-03',
    avatar: 'BK'
  },
  {
    id: '6',
    name: 'Sevara Abdullayeva',
    dept: 'IT bo\'limi',
    role: 'UI/UX Designer',
    status: 'active',
    phone: '+998 97 678 90 12',
    email: 'sevara.a@company.uz',
    startDate: '2023-05-18',
    avatar: 'SA'
  },
];

interface EmployeesTableProps {
  onViewEmployee: (employeeId: string) => void;
  onEditEmployee: (employeeId: string) => void;
  onDeactivateEmployee: (employeeId: string) => void;
  onImportCSV: () => void;
  onAddEmployee: () => void;
  loading?: boolean;
}

export function EmployeesTable({ 
  onViewEmployee, 
  onEditEmployee, 
  onDeactivateEmployee,
  onImportCSV,
  onAddEmployee,
  loading = false 
}: EmployeesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter and sort employees
  const filteredEmployees = mockEmployees
    .filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           emp.phone.includes(searchQuery);
      const matchesDept = selectedDept === 'all' || emp.dept === selectedDept;
      const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus;
      
      return matchesSearch && matchesDept && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      let aValue = a[sortField as keyof typeof a] as unknown as string | number;
      let bValue = b[sortField as keyof typeof b] as unknown as string | number;
      
      if (sortField === 'startDate') {
        aValue = new Date(String(aValue)).getTime();
        bValue = new Date(String(bValue)).getTime();
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

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
      month: '2-digit',
      day: '2-digit'
    });
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
    { value: 'active', label: 'Faol' },
    { value: 'inactive', label: 'Faol emas' },
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 bg-muted rounded animate-pulse w-32 mb-2"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-48"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-9 bg-muted rounded animate-pulse w-24"></div>
              <div className="h-9 bg-muted rounded animate-pulse w-32"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-48"></div>
                </div>
                <div className="h-6 bg-muted rounded animate-pulse w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Xodimlar ro'yxati</h2>
          <p className="text-muted-foreground">
            Jami {filteredEmployees.length} ta xodim
          </p>
        </div>
        <div className="flex gap-2">
          <ButtonEnhanced
            variant="outline"
            size="sm"
            iconLeft={<Download className="h-4 w-4" />}
            onClick={onImportCSV}
          >
            CSV import
          </ButtonEnhanced>
          <ButtonEnhanced
            variant="primary"
            size="sm"
            iconLeft={<Plus className="h-4 w-4" />}
            onClick={onAddEmployee}
          >
            Yangi xodim
          </ButtonEnhanced>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Qidiruv va filtrlash
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 tablet:grid-cols-4 gap-4">
            <div className="tablet:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Ism, email yoki telefon bo'yicha qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <SelectEnhanced
              placeholder="Bo'limni tanlang"
              options={departmentOptions}
              value={selectedDept}
              onValueChange={setSelectedDept}
            />
            <SelectEnhanced
              placeholder="Holatni tanlang"
              options={statusOptions}
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            />
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
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
                      onClick={() => handleSort('dept')}
                      className="h-8 p-0 hover:bg-transparent"
                    >
                      Bo'lim
                      {getSortIcon('dept')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('role')}
                      className="h-8 p-0 hover:bg-transparent"
                    >
                      Lavozim
                      {getSortIcon('role')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('status')}
                      className="h-8 p-0 hover:bg-transparent"
                    >
                      Holat
                      {getSortIcon('status')}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden tablet:table-cell">Telefon</TableHead>
                  <TableHead className="hidden desktop:table-cell">Email</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('startDate')}
                      className="h-8 p-0 hover:bg-transparent"
                    >
                      Ish boshlagan sana
                      {getSortIcon('startDate')}
                    </Button>
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">Xodimlar topilmadi</p>
                        <p className="text-sm text-muted-foreground">
                          Qidiruv shartlarini o'zgartiring yoki yangi xodim qo'shing
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{employee.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground tablet:hidden">
                              {employee.dept}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden tablet:table-cell">
                        <Badge variant="outline">{employee.dept}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{employee.role}</span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(employee.status)}
                      </TableCell>
                      <TableCell className="hidden tablet:table-cell">
                        <span className="text-sm">{employee.phone}</span>
                      </TableCell>
                      <TableCell className="hidden desktop:table-cell">
                        <span className="text-sm">{employee.email}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatDate(employee.startDate)}</span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Harakatlar</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onViewEmployee(employee.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ko'rish
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEditEmployee(employee.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Tahrirlash
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDeactivateEmployee(employee.id)}
                              className="text-danger"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              {employee.status === 'active' ? 'Faolsizlashtirish' : 'Faollashtirish'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}