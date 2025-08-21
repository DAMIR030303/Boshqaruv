import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
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
  MoreHorizontal, 
  Edit, 
  Users,
  Clock,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2
} from 'lucide-react';

// Mock shifts data
const mockShifts = [
  {
    id: '1',
    title: 'Ertalabki smena',
    startTime: '08:00',
    endTime: '16:00',
    graceMinutes: 15,
    type: 'morning',
    employees: [
      { id: '1', name: 'Alisher Fayzullayev', avatar: 'AF' },
      { id: '2', name: 'Nozima Karimova', avatar: 'NK' },
      { id: '3', name: 'Jamshid Tursunov', avatar: 'JT' },
    ],
    daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
    status: 'active',
    createdDate: '2024-01-10'
  },
  {
    id: '2',
    title: 'Tushdan keyin smena',
    startTime: '14:00',
    endTime: '22:00',
    graceMinutes: 10,
    type: 'afternoon',
    employees: [
      { id: '4', name: 'Dilnoza Rahimova', avatar: 'DR' },
      { id: '5', name: 'Bobur Kholmatov', avatar: 'BK' },
    ],
    daysOfWeek: [1, 2, 3, 4, 5],
    status: 'active',
    createdDate: '2024-01-08'
  },
  {
    id: '3',
    title: 'Kechki smena',
    startTime: '22:00',
    endTime: '06:00',
    graceMinutes: 20,
    type: 'night',
    employees: [
      { id: '6', name: 'Sevara Abdullayeva', avatar: 'SA' },
    ],
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    status: 'active',
    createdDate: '2024-01-05'
  },
  {
    id: '4',
    title: 'Dam olish kuni',
    startTime: '10:00',
    endTime: '18:00',
    graceMinutes: 30,
    type: 'weekend',
    employees: [
      { id: '1', name: 'Alisher Fayzullayev', avatar: 'AF' },
    ],
    daysOfWeek: [6, 7], // Weekend
    status: 'inactive',
    createdDate: '2024-01-03'
  },
];

interface ShiftsTableProps {
  onCreateShift: () => void;
  onEditShift: (shiftId: string) => void;
  onAssignEmployees: (shiftId: string) => void;
  onDeleteShift: (shiftId: string) => void;
}

export function ShiftsTable({ onCreateShift, onEditShift, onAssignEmployees, onDeleteShift }: ShiftsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter and sort shifts
  const filteredShifts = mockShifts
    .filter(shift => {
      const matchesSearch = shift.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || shift.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || shift.status === selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      let aValue = a[sortField as keyof typeof a];
      let bValue = b[sortField as keyof typeof b];
      
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'morning': return 'Ertalabki';
      case 'afternoon': return 'Tushdan keyin';
      case 'night': return 'Kechki';
      case 'weekend': return 'Dam olish';
      default: return type;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeColors = {
      morning: 'bg-primary text-primary-foreground',
      afternoon: 'bg-success text-success-foreground',
      night: 'bg-warning text-warning-foreground',
      weekend: 'bg-secondary text-secondary-foreground'
    };
    
    return (
      <Badge className={typeColors[type as keyof typeof typeColors] || 'bg-secondary'}>
        {getTypeLabel(type)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Faol</Badge>;
      case 'inactive':
        return <Badge className="bg-muted text-muted-foreground">Faol emas</Badge>;
      default:
        return <Badge variant="outline">Noma'lum</Badge>;
    }
  };

  const getDaysText = (daysOfWeek: number[]) => {
    const dayNames = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan'];
    return daysOfWeek.map(day => dayNames[day]).join(', ');
  };

  const typeOptions = [
    { value: 'all', label: 'Barcha turlar' },
    { value: 'morning', label: 'Ertalabki' },
    { value: 'afternoon', label: 'Tushdan keyin' },
    { value: 'night', label: 'Kechki' },
    { value: 'weekend', label: 'Dam olish' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Barcha holatlar' },
    { value: 'active', label: 'Faol' },
    { value: 'inactive', label: 'Faol emas' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Smenalar ro'yxati</h3>
          <p className="text-muted-foreground">
            Jami {filteredShifts.length} ta smena
          </p>
        </div>
        <ButtonEnhanced
          variant="primary"
          size="sm"
          iconLeft={<Plus className="h-4 w-4" />}
          onClick={onCreateShift}
        >
          Yangi smena
        </ButtonEnhanced>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Qidiruv va filtrlash
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Smena nomini qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <SelectEnhanced
              placeholder="Turini tanlang"
              options={typeOptions}
              value={selectedType}
              onValueChange={setSelectedType}
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

      {/* Shifts Table */}
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
                      onClick={() => handleSort('title')}
                      className="h-8 p-0 hover:bg-transparent"
                    >
                      Smena nomi
                      {getSortIcon('title')}
                    </Button>
                  </TableHead>
                  <TableHead>Turi</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('startTime')}
                      className="h-8 p-0 hover:bg-transparent"
                    >
                      Vaqt
                      {getSortIcon('startTime')}
                    </Button>
                  </TableHead>
                  <TableHead>Kunlar</TableHead>
                  <TableHead>Xodimlar</TableHead>
                  <TableHead>Holat</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShifts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">Smenalar topilmadi</p>
                        <p className="text-sm text-muted-foreground">
                          Qidiruv shartlarini o'zgartiring yoki yangi smena qo'shing
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShifts.map((shift) => (
                    <TableRow key={shift.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{shift.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Kechikish: {shift.graceMinutes} daqiqa
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(shift.type)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {shift.startTime} - {shift.endTime}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {getDaysText(shift.daysOfWeek)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {shift.employees.slice(0, 3).map((employee) => (
                              <Avatar key={employee.id} className="h-8 w-8 border-2 border-background">
                                <AvatarFallback className="text-xs">
                                  {employee.avatar}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {shift.employees.length > 3 && (
                              <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                                +{shift.employees.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {shift.employees.length} xodim
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(shift.status)}
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
                            <DropdownMenuItem onClick={() => onEditShift(shift.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Tahrirlash
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAssignEmployees(shift.id)}>
                              <Users className="mr-2 h-4 w-4" />
                              Xodimlarni tayinlash
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDeleteShift(shift.id)}
                              className="text-danger"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              O'chirish
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