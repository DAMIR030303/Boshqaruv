import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ButtonEnhanced } from '../enhanced/ButtonEnhanced';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Users, 
  Plus,
  Edit,
  MoreHorizontal 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

// Mock shift data
const mockShifts = [
  {
    id: '1',
    title: 'Ertalabki smena',
    startTime: '08:00',
    endTime: '16:00',
    graceMinutes: 15,
    employees: [
      { id: '1', name: 'Alisher Fayzullayev', avatar: 'AF' },
      { id: '2', name: 'Nozima Karimova', avatar: 'NK' },
    ],
    date: '2024-01-15',
    dayOfWeek: 1, // Monday
    color: 'bg-primary'
  },
  {
    id: '2',
    title: 'Tushdan keyin smena',
    startTime: '14:00',
    endTime: '22:00',
    graceMinutes: 10,
    employees: [
      { id: '3', name: 'Jamshid Tursunov', avatar: 'JT' },
    ],
    date: '2024-01-15',
    dayOfWeek: 1,
    color: 'bg-success'
  },
  {
    id: '3',
    title: 'Kechki smena',
    startTime: '22:00',
    endTime: '06:00',
    graceMinutes: 20,
    employees: [
      { id: '4', name: 'Dilnoza Rahimova', avatar: 'DR' },
      { id: '5', name: 'Bobur Kholmatov', avatar: 'BK' },
    ],
    date: '2024-01-16',
    dayOfWeek: 2,
    color: 'bg-warning'
  },
];

interface WeekCalendarProps {
  onCreateShift: (date: string, dayOfWeek: number) => void;
  onEditShift: (shiftId: string) => void;
  onAssignEmployees: (shiftId: string) => void;
}

export function WeekCalendar({ onCreateShift, onEditShift, onAssignEmployees }: WeekCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Get the start of the current week (Monday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentWeek);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  const weekDayNames = ['Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan', 'Yak'];
  const monthNames = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const getShiftsForDay = (dayIndex: number) => {
    return mockShifts.filter(shift => shift.dayOfWeek === dayIndex);
  };

  const formatWeekRange = () => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${weekStart.getDate()}-${weekEnd.getDate()} ${monthNames[weekStart.getMonth()]} ${weekStart.getFullYear()}`;
    } else {
      return `${weekStart.getDate()} ${monthNames[weekStart.getMonth()]} - ${weekEnd.getDate()} ${monthNames[weekEnd.getMonth()]} ${weekStart.getFullYear()}`;
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Haftalik kalendar
            </CardTitle>
            <p className="text-muted-foreground mt-1">
              {formatWeekRange()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(new Date())}
            >
              Bugun
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 tablet:gap-2">
          {/* Header row */}
          {weekDays.map((date, index) => (
            <div
              key={index}
              className={`p-2 tablet:p-3 text-center border-b ${
                isToday(date) ? 'bg-primary/10 border-primary' : 'border-border'
              }`}
            >
              <div className="text-xs tablet:text-sm text-muted-foreground">
                {weekDayNames[index]}
              </div>
              <div className={`text-sm tablet:text-base font-medium ${
                isToday(date) ? 'text-primary' : 'text-foreground'
              }`}>
                {date.getDate()}
              </div>
            </div>
          ))}

          {/* Calendar body */}
          {weekDays.map((date, dayIndex) => {
            const dayShifts = getShiftsForDay(dayIndex);
            return (
              <div
                key={dayIndex}
                className={`min-h-32 tablet:min-h-40 p-1 tablet:p-2 border-r border-border relative group ${
                  isToday(date) ? 'bg-primary/5' : ''
                }`}
              >
                {/* Add shift button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onCreateShift(date.toISOString(), dayIndex)}
                >
                  <Plus className="h-3 w-3" />
                </Button>

                {/* Shifts for this day */}
                <div className="space-y-1">
                  {dayShifts.map((shift) => (
                    <div
                      key={shift.id}
                      className={`${shift.color} text-white rounded text-xs p-1 tablet:p-2 cursor-pointer hover:opacity-90 transition-opacity`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{shift.title}</div>
                          <div className="text-xs opacity-90">
                            {shift.startTime}-{shift.endTime}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 text-white hover:bg-white/20"
                            >
                              <MoreHorizontal className="h-3 w-3" />
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
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {/* Employee avatars */}
                      {shift.employees.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3 opacity-70" />
                          <div className="flex -space-x-1">
                            {shift.employees.slice(0, 3).map((employee) => (
                              <Avatar key={employee.id} className="h-4 w-4 border border-white">
                                <AvatarFallback className="text-xs bg-white/20 text-white">
                                  {employee.avatar}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {shift.employees.length > 3 && (
                              <div className="h-4 w-4 rounded-full bg-white/20 text-white flex items-center justify-center text-xs border border-white">
                                +{shift.employees.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Empty state */}
                {dayShifts.length === 0 && (
                  <div className="h-full flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-center">
                      <Plus className="h-4 w-4 mx-auto mb-1" />
                      <div className="text-xs">Smena qo'shish</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Ertalabki</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span>Tushdan keyin</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-warning rounded"></div>
              <span>Kechki</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-danger rounded"></div>
              <span>Tungi</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}