import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { 
  Calendar,
  Clock,
  Users,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CreateShiftModal } from '../shifts/CreateShiftModal';
import { toast } from 'sonner';

interface MobileShiftsProps {
  kpiData: any;
  userProfile: any;
  onDataUpdate: (data: any) => void;
}

const shifts = [
  {
    id: 1,
    name: 'Ertalab Smenasi',
    startTime: '08:00',
    endTime: '17:00',
    employees: [
      { name: 'Alisher Fayzullayev', avatar: '/api/placeholder/40/40' },
      { name: 'Nozima Karimova', avatar: '/api/placeholder/40/40' },
      { name: 'Dilnoza Rahimova', avatar: '/api/placeholder/40/40' }
    ],
    status: 'active',
    date: '2024-08-16'
  },
  {
    id: 2,
    name: 'Kechki Smena',
    startTime: '14:00',
    endTime: '23:00',
    employees: [
      { name: 'Jamshid Tursunov', avatar: '/api/placeholder/40/40' }
    ],
    status: 'active',
    date: '2024-08-16'
  },
  {
    id: 3,
    name: 'Tungi Smena',
    startTime: '23:00',
    endTime: '08:00',
    employees: [
      { name: 'Bobur Ismoilov', avatar: '/api/placeholder/40/40' }
    ],
    status: 'scheduled',
    date: '2024-08-16'
  }
];

const weekdays = ['Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan', 'Yak'];

export function MobileShifts({ kpiData, userProfile, onDataUpdate }: MobileShiftsProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'month'>('today');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleCreateShift = (shiftData: any) => {
    console.log('Creating new shift:', shiftData);
    
    // Simulate shift creation
    const newShift = {
      id: shifts.length + 1,
      name: shiftData.name,
      startTime: shiftData.startTime,
      endTime: shiftData.endTime,
      employees: [],
      status: 'scheduled',
      date: new Date().toISOString().split('T')[0],
      location: shiftData.location,
      maxEmployees: parseInt(shiftData.maxEmployees),
      breakDuration: parseInt(shiftData.breakDuration),
      gracePeriod: parseInt(shiftData.gracePeriod)
    };
    
    // Add to shifts array (in real app, this would be an API call)
    shifts.push(newShift);
    
    // Close modal
    setIsCreateModalOpen(false);
    
    // Show success message
    toast.success('Yangi smena muvaffaqiyatli yaratildi!');
  };

  const handleEditShift = (shiftData: any) => {
    console.log('Editing shift:', selectedShift?.id, shiftData);
    
    // Find and update the shift
    const shiftIndex = shifts.findIndex(s => s.id === selectedShift?.id);
    if (shiftIndex !== -1) {
      shifts[shiftIndex] = {
        ...shifts[shiftIndex],
        ...shiftData,
        maxEmployees: parseInt(shiftData.maxEmployees),
        breakDuration: parseInt(shiftData.breakDuration),
        gracePeriod: parseInt(shiftData.gracePeriod)
      };
    }
    
    // Close modal
    setIsEditModalOpen(false);
    setSelectedShift(null);
    
    // Show success message
    toast.success('Smena muvaffaqiyatli yangilandi!');
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const openEditModal = (shift: any) => {
    setSelectedShift(shift);
    setIsEditModalOpen(true);
  };

  const handleAddEmployee = (shift: any) => {
    toast.info(`${shift.name} smenasiga xodim qo'shish funksiyasi ishlab chiqilmoqda...`);
  };

  const handleMoreActions = (shift: any) => {
    toast.info(`${shift.name} uchun qo'shimcha amallar menusi`);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    if (!isFilterOpen) {
      toast.info('Filter funksiyasi ishlab chiqilmoqda...');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Faol</Badge>;
      case 'scheduled':
        return <Badge variant="outline">Rejalashtirilgan</Badge>;
      case 'completed':
        return <Badge variant="secondary">Tugagan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCurrentWeek = () => {
    const week = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedDate(newDate);
  };

  return (
    <div className="boshqaruv-container space-6">
      {/* View Mode Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Bugun</TabsTrigger>
            <TabsTrigger value="week">Hafta</TabsTrigger>
            <TabsTrigger value="month">Oy</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Week Navigation */}
      {viewMode === 'week' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-6"
        >
          <Button variant="ghost" size="sm" onClick={() => navigateWeek('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <div className="font-medium">
              {selectedDate.toLocaleDateString('uz-UZ', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
            <div className="text-sm text-muted-foreground">
              {getCurrentWeek()[0].getDate()} - {getCurrentWeek()[6].getDate()}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigateWeek('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {/* Week Calendar View */}
      {viewMode === 'week' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1">
                {getCurrentWeek().map((day, index) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  const dayShifts = shifts.filter(shift => 
                    new Date(shift.date).toDateString() === day.toDateString()
                  );

                  return (
                    <div key={index} className="text-center">
                      <div className="text-xs text-muted-foreground mb-2">
                        {weekdays[index]}
                      </div>
                      <div className={`text-sm p-2 rounded-lg ${
                        isToday ? 'bg-primary text-primary-foreground' : ''
                      }`}>
                        {day.getDate()}
                      </div>
                      <div className="mt-2 space-y-1">
                        {dayShifts.map(shift => (
                          <div 
                            key={shift.id}
                            className="w-full h-2 bg-primary rounded-full"
                            title={shift.name}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Add New Shift Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Button className="w-full" size="lg" onClick={openCreateModal}>
          <Plus className="h-5 w-5 mr-2" />
          Yangi smena yaratish
        </Button>
      </motion.div>

      {/* Shifts Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-4 mb-6"
      >
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{shifts.length}</div>
            <div className="text-xs text-muted-foreground">Jami smenalar</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {shifts.filter(s => s.status === 'active').length}
            </div>
            <div className="text-xs text-muted-foreground">Faol</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {shifts.reduce((acc, shift) => acc + shift.employees.length, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Xodimlar</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Shifts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4 mb-8"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground">Bugungi Smenalar</h3>
          <Button variant="ghost" size="sm" onClick={toggleFilter}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <AnimatePresence>
          {shifts.map((shift, index) => (
            <motion.div
              key={shift.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{shift.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {shift.startTime} - {shift.endTime}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(shift.status)}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleMoreActions(shift)}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Employees */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {shift.employees.length} xodim
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {shift.employees.slice(0, 3).map((employee, i) => (
                          <Avatar key={i} className="h-8 w-8">
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                            <AvatarFallback className="text-xs">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {shift.employees.length > 3 && (
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">
                              +{shift.employees.length - 3}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Employee names */}
                      <div className="mt-2 text-xs text-muted-foreground">
                        {shift.employees.map(emp => emp.name.split(' ')[0]).join(', ')}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditModal(shift)}>
                        Tahrirlash
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleAddEmployee(shift)}>
                        Xodim qo'shish
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <Button variant="outline" className="h-16 flex-col space-y-2">
          <Calendar className="h-5 w-5" />
          <span className="text-xs">Haftalik rejani ko'rish</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col space-y-2">
          <Users className="h-5 w-5" />
          <span className="text-xs">Xodimlarni tayinlash</span>
        </Button>
      </motion.div>

      {/* Create Shift Modal */}
      <CreateShiftModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateShift}
      />

      {/* Edit Shift Modal */}
      {selectedShift && (
        <CreateShiftModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditShift}
          initialData={{
            name: selectedShift.name,
            startTime: selectedShift.startTime,
            endTime: selectedShift.endTime,
            location: selectedShift.location || '',
            maxEmployees: selectedShift.maxEmployees?.toString() || '10',
            breakDuration: selectedShift.breakDuration?.toString() || '60',
            gracePeriod: selectedShift.gracePeriod?.toString() || '15'
          }}
        />
      )}
    </div>
  );
}