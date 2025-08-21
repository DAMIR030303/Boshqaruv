import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { 
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar as CalendarIcon,
  TrendingUp,
  Target,
  Coffee,
  LogOut as LogOutIcon,
  LogIn,
  Timer
} from 'lucide-react';
import { toast } from 'sonner';

interface EmployeeAttendanceProps {
  kpiData: any;
  userProfile: {
    name: string;
    role: string;
    avatar: string;
    status: string;
  };
  onDataUpdate: (data: any) => void;
}

export function EmployeeAttendance({ 
  kpiData, 
  userProfile, 
  onDataUpdate 
}: EmployeeAttendanceProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Employee attendance data
  const attendanceData = {
    today: {
      checkIn: isCheckedIn ? '09:15:00' : null,
      checkOut: null,
      breakStart: null,
      breakEnd: null,
      status: isCheckedIn ? 'hozir' : 'kelmadi',
      location: 'Ofis - Toshkent',
      totalHours: isCheckedIn ? '3:45' : '0:00',
      expectedHours: '8:00'
    },
    thisMonth: {
      workDays: 18,
      presentDays: 16,
      lateDays: 2,
      absentDays: 0,
      totalHours: '144:30',
      overtimeHours: '8:30',
      averageArrival: '09:05'
    },
    recentHistory: [
      {
        date: '2024-08-19',
        checkIn: '08:45:00',
        checkOut: '17:15:00',
        totalHours: '8:30',
        status: 'present',
        late: false
      },
      {
        date: '2024-08-16',
        checkIn: '09:20:00',
        checkOut: '17:45:00',
        totalHours: '8:25',
        status: 'present',
        late: true
      },
      {
        date: '2024-08-15',
        checkIn: '08:30:00',
        checkOut: '17:00:00',
        totalHours: '8:30',
        status: 'present',
        late: false
      },
      {
        date: '2024-08-14',
        checkIn: '09:10:00',
        checkOut: '17:20:00',
        totalHours: '8:10',
        status: 'present',
        late: true
      }
    ]
  };

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    toast.success('Muvaffaqiyatli ro\'yxatga olindingiz!', {
      description: `Vaqt: ${new Date().toLocaleTimeString('uz-UZ')}`
    });
    onDataUpdate({ type: 'check_in', time: new Date() });
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    toast.success('Muvaffaqiyatli chiqib ketdingiz!', {
      description: `Vaqt: ${new Date().toLocaleTimeString('uz-UZ')}`
    });
    onDataUpdate({ type: 'check_out', time: new Date() });
  };

  const handleBreakStart = () => {
    toast.success('Tanaffus boshlandi');
    onDataUpdate({ type: 'break_start', time: new Date() });
  };

  const handleBreakEnd = () => {
    toast.success('Tanaffus tugadi');
    onDataUpdate({ type: 'break_end', time: new Date() });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-success text-success-foreground';
      case 'late': return 'bg-warning text-warning-foreground';
      case 'absent': return 'bg-danger text-danger-foreground';
      case 'hozir': return 'bg-primary text-primary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return CheckCircle;
      case 'late': return AlertTriangle;
      case 'absent': return XCircle;
      case 'hozir': return Clock;
      default: return Clock;
    }
  };

  return (
    <div className="boshqaruv-container space-6">
      {/* Today's Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Bugun</span>
              <Badge className={getStatusColor(attendanceData.today.status)}>
                {attendanceData.today.status === 'hozir' ? 'Ishda' : 'Kelmadi'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Current time */}
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-primary">
                  {new Date().toLocaleTimeString('uz-UZ')}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('uz-UZ', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              {/* Check in/out buttons */}
              <div className="flex gap-3">
                {!isCheckedIn ? (
                  <Button onClick={handleCheckIn} className="flex-1">
                    <LogIn className="h-4 w-4 mr-2" />
                    Kirish
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleBreakStart} variant="outline" className="flex-1">
                      <Coffee className="h-4 w-4 mr-2" />
                      Tanaffus
                    </Button>
                    <Button onClick={handleCheckOut} variant="destructive" className="flex-1">
                      <LogOutIcon className="h-4 w-4 mr-2" />
                      Chiqish
                    </Button>
                  </>
                )}
              </div>

              {/* Today's details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold text-foreground">
                    {attendanceData.today.checkIn || '--:--'}
                  </div>
                  <div className="text-xs text-muted-foreground">Kelish vaqti</div>
                </div>
                
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold text-foreground">
                    {attendanceData.today.totalHours}
                  </div>
                  <div className="text-xs text-muted-foreground">Ishlagan vaqt</div>
                </div>
                
                <div className="text-center p-3 bg-muted/50 rounded-lg col-span-2">
                  <div className="flex items-center justify-center space-x-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{attendanceData.today.location}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Joylashuv</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Oylik xulosalar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <div className="text-xl font-bold text-success">
                  {attendanceData.thisMonth.presentDays}
                </div>
                <div className="text-xs text-muted-foreground">Kelgan kunlar</div>
              </div>
              
              <div className="text-center p-3 bg-warning/10 rounded-lg">
                <div className="text-xl font-bold text-warning">
                  {attendanceData.thisMonth.lateDays}
                </div>
                <div className="text-xs text-muted-foreground">Kechikkan kunlar</div>
              </div>
              
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <div className="text-xl font-bold text-primary">
                  {attendanceData.thisMonth.totalHours}
                </div>
                <div className="text-xs text-muted-foreground">Jami soatlar</div>
              </div>
              
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-xl font-bold text-foreground">
                  {attendanceData.thisMonth.averageArrival}
                </div>
                <div className="text-xs text-muted-foreground">O'rtacha kelish</div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Ish kunlari</span>
                <span>{attendanceData.thisMonth.presentDays}/{attendanceData.thisMonth.workDays}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${(attendanceData.thisMonth.presentDays / attendanceData.thisMonth.workDays) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Kalendar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>So'nggi davomat tarixi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendanceData.recentHistory.map((record, index) => {
                const StatusIcon = getStatusIcon(record.status);
                return (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <StatusIcon className={`h-4 w-4 ${
                          record.late ? 'text-warning' : 'text-success'
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {new Date(record.date).toLocaleDateString('uz-UZ')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {record.checkIn} - {record.checkOut}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-foreground">{record.totalHours}</div>
                      {record.late && (
                        <Badge variant="secondary" className="text-xs">
                          Kechikkan
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Button variant="outline" className="w-full mt-4">
              <Timer className="h-4 w-4 mr-2" />
              To'liq tarixi ko'rish
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Natijalar tahlili</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">Yaxshi natija</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Bu oyda davomat 89% ni tashkil etdi. Juda yaxshi ko'rsatkich!
                </p>
              </div>

              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium text-warning">Tavsiya</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ertalab soat 8:30 gacha kelishga harakat qiling.
                </p>
              </div>

              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Maqsad</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Keyingi oyda 95% davomat maqsadini belgilang.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}