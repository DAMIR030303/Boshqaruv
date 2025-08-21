import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Clock, 
  MapPin, 
  CheckSquare, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Users,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

interface EnhancedMyDayScreenProps {
  onCheckIn: () => void;
  attendanceKPIs?: {
    present: number;
    late: number;
    absent: number;
    total: number;
  };
}

interface ShiftInfo {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  location: string;
  graceMinutes: number;
  isCheckedIn: boolean;
  checkInTime?: string;
  breakTime: {
    start: string;
    end: string;
  };
}

interface TaskSummary {
  total: number;
  completed: number;
  overdue: number;
  today: number;
}

export function EnhancedMyDayScreen({ 
  onCheckIn,
  attendanceKPIs = { present: 12, late: 3, absent: 2, total: 17 }
}: EnhancedMyDayScreenProps) {
  const [currentTime] = useState(new Date());
  const [isAnimating, setIsAnimating] = useState(false);
  
  const todayShift: ShiftInfo = {
    id: '1',
    name: 'Ertalabki smena',
    startTime: '09:00',
    endTime: '18:00',
    location: 'Bosh ofis',
    graceMinutes: 15,
    isCheckedIn: false,
    breakTime: {
      start: '12:00',
      end: '13:00'
    }
  };

  const taskSummary: TaskSummary = {
    total: 8,
    completed: 3,
    overdue: 1,
    today: 5
  };

  const isLate = () => {
    const shiftStart = new Date();
    const [hours, minutes] = todayShift.startTime.split(':').map(Number);
    shiftStart.setHours(hours, minutes, 0, 0);
    
    return currentTime > shiftStart;
  };

  const isWithinGrace = () => {
    const shiftStart = new Date();
    const [hours, minutes] = todayShift.startTime.split(':').map(Number);
    shiftStart.setHours(hours, minutes, 0, 0);
    
    const graceEnd = new Date(shiftStart);
    graceEnd.setMinutes(graceEnd.getMinutes() + todayShift.graceMinutes);
    
    return currentTime <= graceEnd && currentTime > shiftStart;
  };

  const getCheckInStatus = () => {
    if (todayShift.isCheckedIn) {
      return {
        text: 'Kelganingiz qayd etildi',
        variant: 'success' as const,
        icon: CheckCircle
      };
    }
    
    if (isLate() && !isWithinGrace()) {
      return {
        text: 'Kechikdingiz',
        variant: 'danger' as const,
        icon: AlertCircle
      };
    }
    
    if (isWithinGrace()) {
      return {
        text: 'Imtiyozli vaqt',
        variant: 'warning' as const,
        icon: Clock
      };
    }
    
    return {
      text: 'Vaqtida',
      variant: 'success' as const,
      icon: CheckCircle
    };
  };

  const handleCheckInClick = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      onCheckIn();
    }, 200);
  }, [onCheckIn]);

  const status = getCheckInStatus();
  const StatusIcon = status.icon;
  const progressPercentage = (taskSummary.completed / taskSummary.total) * 100;
  const attendanceRate = Math.round((attendanceKPIs.present / attendanceKPIs.total) * 100);

  return (
    <div className="p-4 space-y-4">
      {/* Animated KPI Cards */}
      <motion.div 
        className="grid grid-cols-2 gap-3 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="bg-gradient-to-br from-success/10 to-success/20 border-success/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-success/80">Hozir</div>
                  <motion.div 
                    className="text-lg font-semibold text-success"
                    key={attendanceKPIs.present}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {attendanceKPIs.present}
                  </motion.div>
                </div>
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-primary/80">Davomat</div>
                <div className="text-lg font-semibold text-primary">{attendanceRate}%</div>
              </div>
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Shift Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 overflow-hidden relative">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-full h-full" />
            </motion.div>
          </div>

          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{todayShift.name}</CardTitle>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <Badge 
                  className={`${
                    status.variant === 'success' ? 'bg-success text-success-foreground' :
                    status.variant === 'warning' ? 'bg-warning text-warning-foreground' :
                    'bg-danger text-danger-foreground'
                  }`}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.text}
                </Badge>
              </motion.div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{todayShift.startTime} - {todayShift.endTime}</div>
                  <div className="text-xs text-muted-foreground">Ish vaqti</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{todayShift.location}</div>
                  <div className="text-xs text-muted-foreground">Joylashuv</div>
                </div>
              </div>
            </motion.div>

            {/* Grace Period Info with Animation */}
            <AnimatePresence>
              {isWithinGrace() && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-warning/10 border border-warning/20 rounded-lg p-3 overflow-hidden"
                >
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Clock className="h-4 w-4 text-warning" />
                    </motion.div>
                    <div>
                      <div className="text-sm font-medium text-warning">
                        Imtiyozli vaqt: {todayShift.graceMinutes} daqiqa
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Kechikish jarimi qo'llanilmaydi
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Break Time */}
            <motion.div 
              className="bg-muted/50 rounded-lg p-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Tushlik tanaffusi</span>
                </div>
                <span className="text-sm font-medium">
                  {todayShift.breakTime.start} - {todayShift.breakTime.end}
                </span>
              </div>
            </motion.div>

            {/* Enhanced Check-in Button */}
            {!todayShift.isCheckedIn && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={isAnimating ? { scale: [1, 0.95, 1.05, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Button 
                    onClick={handleCheckInClick}
                    className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg transition-all duration-300"
                    size="lg"
                  >
                    <motion.div
                      animate={isAnimating ? { rotate: 360 } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Clock className="h-5 w-5 mr-2" />
                    </motion.div>
                    Kelganlikni belgilash
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {todayShift.isCheckedIn && todayShift.checkInTime && (
              <motion.div 
                className="text-center p-3 bg-success/10 rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                <div className="text-sm text-success font-medium">
                  Kelgan vaqt: {todayShift.checkInTime}
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Task Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Bugungi vazifalar</CardTitle>
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Button variant="ghost" size="sm">
                  Barchasi
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm">Bajarilish</span>
              </div>
              <span className="text-sm font-medium">
                {taskSummary.completed}/{taskSummary.total}
              </span>
            </div>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Progress value={progressPercentage} className="h-2" />
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-3 gap-4 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              {[
                { value: taskSummary.today, label: 'Bugun', color: 'text-primary' },
                { value: taskSummary.completed, label: 'Bajarilgan', color: 'text-success' },
                { value: taskSummary.overdue, label: 'Kechikkan', color: 'text-danger' }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                >
                  <div className={`text-lg font-semibold ${item.color}`}>{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats with Animations */}
      <motion.div 
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <motion.div
          whileHover={{ scale: 1.02, rotate: 1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Jamoada</div>
                  <div className="text-lg font-semibold">{attendanceKPIs.total} kishi</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, rotate: -1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <CheckSquare className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="text-sm font-medium">Haftalik</div>
                  <div className="text-lg font-semibold">85%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Recent Activity with Staggered Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">So'nggi faoliyat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { text: 'Frontend loyihasi tugallandi', time: 'Bugun, 14:30', color: 'bg-success' },
                { text: 'Yangi vazifa tayinlandi', time: 'Bugun, 10:15', color: 'bg-primary' },
                { text: 'Kecha vaqtida kelgan', time: 'Kecha, 09:15', color: 'bg-muted-foreground' }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                >
                  <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                  <div className="flex-1">
                    <div className="text-sm">{activity.text}</div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}