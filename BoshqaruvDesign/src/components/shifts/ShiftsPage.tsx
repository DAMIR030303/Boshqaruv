import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { WeekCalendar } from './WeekCalendar';
import { ShiftsTable } from './ShiftsTable';
import { ShiftModal } from './ShiftModal';
import { AssignEmployeesDrawer } from './AssignEmployeesDrawer';
import { toast } from 'sonner';
import { Calendar, List, Clock } from 'lucide-react';

interface ShiftData {
  id?: string;
  title: string;
  startTime: string;
  endTime: string;
  graceMinutes: number;
  type: string;
  daysOfWeek: number[];
  description?: string;
}

export function ShiftsPage() {
  const [activeTab, setActiveTab] = useState('calendar');
  
  // Modal and drawer states
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);
  const [shiftModalMode, setShiftModalMode] = useState<'create' | 'edit'>('create');
  const [selectedShiftData, setSelectedShiftData] = useState<ShiftData | null>(null);
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const [selectedShiftTitle, setSelectedShiftTitle] = useState<string>('');

  // Calendar create shift
  const handleCreateShiftFromCalendar = (date: string, dayOfWeek: number) => {
    setShiftModalMode('create');
    setSelectedShiftData({
      title: '',
      startTime: '09:00',
      endTime: '17:00',
      graceMinutes: 15,
      type: 'morning',
      daysOfWeek: [dayOfWeek],
      description: '',
    });
    setIsShiftModalOpen(true);
  };

  // Table create shift
  const handleCreateShift = () => {
    setShiftModalMode('create');
    setSelectedShiftData(null);
    setIsShiftModalOpen(true);
  };

  const handleEditShift = (shiftId: string) => {
    // In a real app, fetch shift data by ID
    setShiftModalMode('edit');
    setSelectedShiftData({
      id: shiftId,
      title: 'Ertalabki smena',
      startTime: '08:00',
      endTime: '16:00',
      graceMinutes: 15,
      type: 'morning',
      daysOfWeek: [1, 2, 3, 4, 5],
      description: 'Asosiy ish smena',
    });
    setIsShiftModalOpen(true);
  };

  const handleAssignEmployees = (shiftId: string) => {
    setSelectedShiftId(shiftId);
    // In a real app, get shift title by ID
    setSelectedShiftTitle('Ertalabki smena');
    setIsAssignDrawerOpen(true);
  };

  const handleDeleteShift = (shiftId: string) => {
    if (confirm('Smenani o\'chirishni xohlaysizmi? Bu amalni bekor qilib bo\'lmaydi.')) {
      // In a real app, call API to delete shift
      toast.success('Smena muvaffaqiyatli o\'chirildi');
      console.log('Delete shift:', shiftId);
    }
  };

  const handleSaveShift = async (shiftData: ShiftData) => {
    try {
      // In a real app, call API to save shift
      console.log('Saving shift:', shiftData);
      
      if (shiftModalMode === 'create') {
        toast.success('Yangi smena muvaffaqiyatli yaratildi');
      } else {
        toast.success('Smena ma\'lumotlari yangilandi');
      }
      
      setIsShiftModalOpen(false);
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    }
  };

  const handleSaveEmployeeAssignments = async (employeeIds: string[]) => {
    try {
      // In a real app, call API to save assignments
      console.log('Saving employee assignments:', employeeIds);
      toast.success(`${employeeIds.length} ta xodim tayinlandi`);
      setIsAssignDrawerOpen(false);
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Smenalar boshqaruvi</h2>
          <p className="text-muted-foreground">
            Ish smenalarini yarating, tahrirlang va xodimlarga tayinlang
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden tablet:inline">Kalendar</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span className="hidden tablet:inline">Ro'yxat</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <WeekCalendar
            onCreateShift={handleCreateShiftFromCalendar}
            onEditShift={handleEditShift}
            onAssignEmployees={handleAssignEmployees}
          />
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <ShiftsTable
            onCreateShift={handleCreateShift}
            onEditShift={handleEditShift}
            onAssignEmployees={handleAssignEmployees}
            onDeleteShift={handleDeleteShift}
          />
        </TabsContent>
      </Tabs>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Smena statistikasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">Jami smenalar</div>
            </div>
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <div className="text-2xl font-bold text-success">12</div>
              <div className="text-sm text-muted-foreground">Tayinlangan xodimlar</div>
            </div>
            <div className="text-center p-4 bg-warning/10 rounded-lg">
              <div className="text-2xl font-bold text-warning">8.5</div>
              <div className="text-sm text-muted-foreground">O'rtacha ish soati</div>
            </div>
            <div className="text-center p-4 bg-muted/10 rounded-lg">
              <div className="text-2xl font-bold text-muted-foreground">15</div>
              <div className="text-sm text-muted-foreground">O'rtacha kechikish (daq)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals and Drawers */}
      <ShiftModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        onSave={handleSaveShift}
        shiftData={selectedShiftData}
        mode={shiftModalMode}
      />

      <AssignEmployeesDrawer
        isOpen={isAssignDrawerOpen}
        onClose={() => setIsAssignDrawerOpen(false)}
        onSave={handleSaveEmployeeAssignments}
        shiftId={selectedShiftId}
        shiftTitle={selectedShiftTitle}
      />
    </div>
  );
}