import { useState } from 'react';
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
  Target
} from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

interface MyDayScreenProps {
  onCheckIn: () => void;
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

export function MyDayScreen({ onCheckIn }: MyDayScreenProps) {
  const [currentTime] = useState(new Date());
  
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

  const status = getCheckInStatus();
  const StatusIcon = status.icon;
  const progressPercentage = (taskSummary.completed / taskSummary.total) * 100;

  return (
    <div className="p-4 space-y-4">
      {/* Shift Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{todayShift.name}</CardTitle>
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
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          {/* Grace Period Info */}
          {isWithinGrace() && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-warning" />
                <div>
                  <div className="text-sm font-medium text-warning">
                    Imtiyozli vaqt: {todayShift.graceMinutes} daqiqa
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Kechikish jarimi qo'llanilmaydi
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Break Time */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Tushlik tanaffusi</span>
              </div>
              <span className="text-sm font-medium">
                {todayShift.breakTime.start} - {todayShift.breakTime.end}
              </span>
            </div>
          </div>

          {/* Check-in Button */}
          {!todayShift.isCheckedIn && (
            <Button 
              onClick={onCheckIn}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              <Clock className="h-5 w-5 mr-2" />
              Kelganlikni belgilash
            </Button>
          )}

          {todayShift.isCheckedIn && todayShift.checkInTime && (
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <div className="text-sm text-success font-medium">
                Kelgan vaqt: {todayShift.checkInTime}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Bugungi vazifalar</CardTitle>
            <Button variant="ghost" size="sm">
              Barchasi
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
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
          
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-primary">{taskSummary.today}</div>
              <div className="text-xs text-muted-foreground">Bugun</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-success">{taskSummary.completed}</div>
              <div className="text-xs text-muted-foreground">Bajarilgan</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-danger">{taskSummary.overdue}</div>
              <div className="text-xs text-muted-foreground">Kechikkan</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">Jamoada</div>
                <div className="text-lg font-semibold">12 kishi</div>
              </div>
            </div>
          </CardContent>
        </Card>

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
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">So'nggi faoliyat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm">Frontend loyihasi tugallandi</div>
                <div className="text-xs text-muted-foreground">Bugun, 14:30</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm">Yangi vazifa tayinlandi</div>
                <div className="text-xs text-muted-foreground">Bugun, 10:15</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm">Kecha vaqtida kelgan</div>
                <div className="text-xs text-muted-foreground">Kecha, 09:15</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}