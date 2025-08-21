import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  Clock, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  Filter,
  Download,
  QrCode,
  Fingerprint,
  Users,
  Target,
  TrendingUp,
  Activity
} from 'lucide-react';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';

interface MobileAttendanceProps {
  kpiData: {
    attendance: {
      present: number;
      late: number;
      absent: number;
      total: number;
    };
  };
  userProfile: any;
  onDataUpdate: (data: any) => void;
}

const attendanceData = [
  { name: 'Ishda', value: 1, color: '#10B981' },
  { name: 'Kechikgan', value: 0, color: '#F59E0B' },
  { name: 'Yo\'q', value: 0, color: '#EF4444' }
];

const todayAttendance = [
  {
    id: 1,
    name: 'Shaxriddin Adizov Sherali o\'g\'li',
    avatar: '/api/placeholder/40/40',
    checkIn: '08:00',
    checkOut: null,
    status: 'present',
    location: 'Ofis',
    late: false,
    workingHours: '8 soat',
    efficiency: 95
  }
];

export function MobileAttendance({ kpiData, userProfile, onDataUpdate }: MobileAttendanceProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const attendancePercentage = Math.round((kpiData.attendance.present / kpiData.attendance.total) * 100);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'late': return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'absent': return <XCircle className="h-4 w-4 text-danger" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (employee: any) => {
    if (employee.status === 'absent') {
      return <Badge variant="destructive" className="rounded-full">Yo'q</Badge>;
    }
    if (employee.late) {
      return <Badge variant="outline" className="border-warning text-warning rounded-full">Kechikgan</Badge>;
    }
    return <Badge variant="outline" className="border-success text-success rounded-full">Ishda</Badge>;
  };

  return (
    <div className="boshqaruv-container space-6">
      {/* Enhanced Current Time & Date */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-6 border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Joriy vaqt
                </h2>
                <p className="text-sm text-muted-foreground">
                  Real vaqt ma'lumotlari
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {currentTime.toLocaleTimeString('uz-UZ', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentTime.toLocaleDateString('uz-UZ', { 
                  weekday: 'short', 
                  day: 'numeric',
                  month: 'short'
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Quick Check-in Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2 bg-success/10 rounded-lg">
            <Target className="h-5 w-5 text-success" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Tezkor Davomat</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            size="lg" 
            className="h-20 flex flex-col space-y-2 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
          >
            <QrCode className="h-6 w-6" />
            <span className="font-medium">QR Kod</span>
            <span className="text-xs opacity-90">Tezkor scan</span>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="h-20 flex flex-col space-y-2 border-2 hover:bg-muted/50 shadow-lg"
          >
            <Fingerprint className="h-6 w-6" />
            <span className="font-medium">Barmoq izi</span>
            <span className="text-xs text-muted-foreground">Xavfsiz</span>
          </Button>
        </div>
      </motion.div>

      {/* Enhanced Attendance Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-success/5 to-success/10">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Activity className="h-5 w-5 text-success" />
                </div>
                <span>Bugungi Davomat</span>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full">
                <Filter className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Enhanced Chart */}
              <div className="h-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-success">{attendancePercentage}%</div>
                    <div className="text-xs text-muted-foreground">Davomat</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-success/5 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-sm font-medium">Ishda</span>
                  </div>
                  <span className="font-bold text-success">{kpiData.attendance.present}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/10 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <span className="text-sm font-medium">Kechikgan</span>
                  </div>
                  <span className="font-bold text-muted-foreground">{kpiData.attendance.late}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/10 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-danger" />
                    <span className="text-sm font-medium">Yo'q</span>
                  </div>
                  <span className="font-bold text-muted-foreground">{kpiData.attendance.absent}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-success/10 to-primary/10 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Umumiy davomat</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm font-bold text-success">{attendancePercentage}%</span>
                </div>
              </div>
              <Progress value={attendancePercentage} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced View Mode Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="bg-muted/20 rounded-2xl p-2">
          <div className="flex gap-1">
            {[
              { key: 'today', label: 'Bugun' },
              { key: 'week', label: 'Hafta' },
              { key: 'month', label: 'Oy' }
            ].map((mode) => (
              <Button
                key={mode.key}
                variant={viewMode === mode.key ? "default" : "ghost"}
                size="sm"
                className={`flex-1 rounded-xl transition-all duration-200 ${
                  viewMode === mode.key 
                    ? 'bg-background shadow-md' 
                    : 'hover:bg-background/50'
                }`}
                onClick={() => setViewMode(mode.key as any)}
              >
                {mode.label}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Employee Attendance List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Xodimlar Davomat</h3>
          </div>
          <Button variant="ghost" size="sm" className="rounded-full">
            <Download className="h-4 w-4 mr-2" />
            Eksport
          </Button>
        </div>

        <AnimatePresence>
          {todayAttendance.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="mb-4"
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-14 w-14 ring-2 ring-success/20">
                        <AvatarImage src={employee.avatar} alt={employee.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-success rounded-full p-1">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{employee.name}</h4>
                        {getStatusBadge(employee)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Keldi: </span>
                          <span className="font-medium text-foreground">{employee.checkIn}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium text-foreground">{employee.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Ish vaqti: </span>
                          <span className="font-medium text-foreground">{employee.workingHours}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Samaradorlik: </span>
                          <span className="font-medium text-success">{employee.efficiency}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced Weekly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <span>Haftalik Xulosa</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-success/5 rounded-xl">
                <div className="text-3xl font-bold text-success mb-1">100%</div>
                <div className="text-sm text-muted-foreground">O'rtacha davomat</div>
                <div className="mt-2">
                  <TrendingUp className="h-4 w-4 text-success mx-auto" />
                </div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-xl">
                <div className="text-3xl font-bold text-primary mb-1">40</div>
                <div className="text-sm text-muted-foreground">Jami soatlar</div>
                <div className="mt-2">
                  <Clock className="h-4 w-4 text-primary mx-auto" />
                </div>
              </div>
              <div className="text-center p-4 bg-muted/10 rounded-xl">
                <div className="text-3xl font-bold text-muted-foreground mb-1">0</div>
                <div className="text-sm text-muted-foreground">Kechikishlar</div>
                <div className="mt-2">
                  <CheckCircle className="h-4 w-4 text-success mx-auto" />
                </div>
              </div>
              <div className="text-center p-4 bg-muted/10 rounded-xl">
                <div className="text-3xl font-bold text-muted-foreground mb-1">0</div>
                <div className="text-sm text-muted-foreground">Yo'qliklar</div>
                <div className="mt-2">
                  <CheckCircle className="h-4 w-4 text-success mx-auto" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}