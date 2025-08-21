import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Users, 
  Clock, 
  CheckSquare, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  Calendar,
  BarChart3,
  UserCheck,
  Target,
  Activity,
  Zap
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { toast } from 'sonner';
import { useState } from 'react';

interface MobileDashboardProps {
  kpiData: {
    attendance: {
      present: number;
      late: number;
      absent: number;
      total: number;
    };
    tasks: {
      completed: number;
      inProgress: number;
      pending: number;
      total: number;
    };
    penalties: {
      active: number;
      resolved: number;
      total: number;
    };
  };
  userProfile: {
    name: string;
    role: string;
    avatar: string;
    status: string;
  };
  onDataUpdate: (data: any) => void;
  onNavigate?: (tab: string) => void;
}

// Mock chart data
const attendanceChartData = [
  { day: 'Dush', value: 100 },
  { day: 'Sesh', value: 100 },
  { day: 'Chor', value: 100 },
  { day: 'Pay', value: 100 },
  { day: 'Juma', value: 100 },
  { day: 'Shan', value: 100 },
  { day: 'Yak', value: 100 }
];

const recentActivities = [
  {
    id: 1,
    type: 'attendance',
    title: 'Shaxriddin Adizov Sherali o\'g\'li ishga keldi',
    time: '08:00',
    status: 'success'
  },
  {
    id: 2,
    type: 'task',
    title: 'Instagram post yaratish vazifasi',
    time: '09:15',
    status: 'info'
  },
  {
    id: 3,
    type: 'task',
    title: 'Video montaj vazifasi bajarildi',
    time: '14:30',
    status: 'success'
  },
  {
    id: 4,
    type: 'attendance',
    title: 'Marketing bo\'yicha hisobot tayyorlandi',
    time: '16:45',
    status: 'success'
  }
];

// Kengaytirilgan faoliyat ro'yxati
const allActivities = [
  {
    id: 1,
    type: 'attendance',
    title: 'Shaxriddin Adizov Sherali o\'g\'li ishga keldi',
    description: 'QR kod orqali davomat belgilandi',
    time: '08:00',
    date: 'Bugun',
    status: 'success'
  },
  {
    id: 2,
    type: 'task',
    title: 'Instagram post yaratish vazifasi',
    description: 'Marketing kampaniyasi uchun kontent yaratish',
    time: '09:15',
    date: 'Bugun',
    status: 'info'
  },
  {
    id: 3,
    type: 'task',
    title: 'Video montaj vazifasi bajarildi',
    description: 'Reels uchun video montaj tugallandi',
    time: '14:30',
    date: 'Bugun',
    status: 'success'
  },
  {
    id: 4,
    type: 'task',
    title: 'AI yordamida caption yaratish',
    description: 'GPT orqali post matnlari tayyorlandi',
    time: '11:20',
    date: 'Bugun',
    status: 'success'
  },
  {
    id: 5,
    type: 'attendance',
    title: 'Marketing hisoboti tayyorlandi',
    description: 'Haftalik engagement va reach statistikasi',
    time: '16:45',
    date: 'Kecha',
    status: 'success'
  },
  {
    id: 6,
    type: 'task',
    title: 'Social media monitoring',
    description: 'Instagram va Facebook postlarini tahlil qilish',
    time: '15:30',
    date: 'Kecha',
    status: 'success'
  },
  {
    id: 7,
    type: 'task',
    title: 'Kontent kalendari yangilandi',
    description: 'Keyingi haftaga rejalashtirilgan postlar',
    time: '13:20',
    date: 'Kecha',
    status: 'info'
  },
  {
    id: 8,
    type: 'attendance',
    title: 'Marketing strategiya yig\'ilishi',
    description: 'Oylik marketing rejasini muhokama qilish',
    time: '10:00',
    date: 'Kecha',
    status: 'success'
  }
];

export function MobileDashboard({ kpiData, userProfile, onNavigate }: MobileDashboardProps) {
  const [isActivitiesModalOpen, setIsActivitiesModalOpen] = useState(false);
  
  const attendancePercentage = Math.round((kpiData.attendance.present / kpiData.attendance.total) * 100);
  const taskCompletionRate = Math.round((kpiData.tasks.completed / kpiData.tasks.total) * 100);

  const handleQuickAction = (actionType: string) => {
    switch (actionType) {
      case 'employees':
        if (onNavigate) {
          onNavigate('employees');
          toast.success('Xodimlar sahifasiga o\'tildi');
        } else {
          toast.info('Xodim qo\'shish funksiyasi');
        }
        break;
      case 'tasks':
        if (onNavigate) {
          onNavigate('tasks');
          toast.success('Vazifalar sahifasiga o\'tildi');
        } else {
          toast.info('Vazifa yaratish funksiyasi');
        }
        break;
      case 'shifts':
        if (onNavigate) {
          onNavigate('shifts');
          toast.success('Smenalar sahifasiga o\'tildi');
        } else {
          toast.info('Smena rejasi funksiyasi');
        }
        break;
      case 'reports':
        if (onNavigate) {
          onNavigate('reports');
          toast.success('Hisobotlar sahifasiga o\'tildi');
        } else {
          toast.info('Hisobotlar funksiyasi');
        }
        break;
      default:
        toast.info('Funksiya ishlab chiqilmoqda...');
    }
  };

  const quickActions = [
    {
      title: 'Xodim qo\'shish',
      icon: Users,
      color: 'bg-gradient-to-br from-primary to-primary/80',
      action: () => handleQuickAction('employees'),
      description: 'Yangi xodim ma\'lumotlari'
    },
    {
      title: 'Vazifa yaratish',
      icon: CheckSquare,
      color: 'bg-gradient-to-br from-success to-success/80',
      action: () => handleQuickAction('tasks'),
      description: 'Marketing vazifasi'
    },
    {
      title: 'Smena rejasi',
      icon: Calendar,
      color: 'bg-gradient-to-br from-warning to-warning/80',
      action: () => handleQuickAction('shifts'),
      description: 'Ish grafigini sozlash'
    },
    {
      title: 'Hisobotlar',
      icon: BarChart3,
      color: 'bg-gradient-to-br from-danger to-danger/80',
      action: () => handleQuickAction('reports'),
      description: 'Tahlil va statistika'
    }
  ];

  const handleViewMore = (section: string) => {
    switch (section) {
      case 'attendance':
        if (onNavigate) {
          onNavigate('attendance');
          toast.success('Davomat sahifasiga o\'tildi');
        }
        break;
      case 'activities':
        setIsActivitiesModalOpen(true);
        break;
      default:
        toast.info('Ko\'rish funksiyasi ishlab chiqilmoqda...');
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attendance': return <UserCheck className="h-4 w-4" />;
      case 'task': return <CheckSquare className="h-4 w-4" />;
      case 'penalty': return <AlertTriangle className="h-4 w-4" />;
      case 'shift': return <Clock className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="boshqaruv-container space-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border border-primary/20">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Bugungi natijalar
              </h2>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('uz-UZ', { 
                  weekday: 'long', 
                  day: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-success font-medium">Faol</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">5 ta vazifa</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        {/* Attendance KPI */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-success/5 to-success/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-success/10 rounded-xl">
                <UserCheck className="h-5 w-5 text-success" />
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success border-0">
                {attendancePercentage}%
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {kpiData.attendance.present}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {kpiData.attendance.total}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Davomat ko'rsatkichi
              </p>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success font-medium">Mukammal</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks KPI */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <CheckSquare className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                {taskCompletionRate}%
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {kpiData.tasks.completed}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {kpiData.tasks.total}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Bajarilgan vazifalar
              </p>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-primary" />
                <span className="text-xs text-primary font-medium">+20% bu hafta</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* In Progress Tasks */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-warning/5 to-warning/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-warning/10 rounded-xl">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <Badge variant="secondary" className="bg-warning/10 text-warning border-0">
                Jarayonda
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {kpiData.tasks.inProgress}
                </span>
                <span className="text-sm text-muted-foreground">ta</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Jarayondagi vazifalar
              </p>
              <div className="flex items-center space-x-1">
                <Zap className="h-3 w-3 text-warning" />
                <span className="text-xs text-warning font-medium">Faol ishlanmoqda</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Penalties */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-muted/5 to-muted/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-muted/10 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success border-0">
                Tozalandi
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {kpiData.penalties.active}
                </span>
                <span className="text-sm text-muted-foreground">ta</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Faol jarimalar
              </p>
              <div className="flex items-center space-x-1">
                <TrendingDown className="h-3 w-3 text-success" />
                <span className="text-xs text-success font-medium">Yaxshi natija</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Attendance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <span>Haftalik Davomat</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleViewMore('attendance')}>
                <Eye className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceChartData}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis hide />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-success">{attendancePercentage}%</div>
                <div className="text-xs text-muted-foreground">O'rtacha</div>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">7</div>
                <div className="text-xs text-muted-foreground">Kun</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary">0</div>
                <div className="text-xs text-muted-foreground">Kechikish</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Tezkor Harakatlar</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="h-auto p-0 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-background overflow-hidden"
                  onClick={action.action}
                >
                  <div className="w-full p-4 text-left">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </div>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <span>So'ngi Faoliyat</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleViewMore('activities')}>
                <Eye className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'success' ? 'bg-success' :
                  activity.status === 'warning' ? 'bg-warning' :
                  activity.status === 'info' ? 'bg-primary' : 'bg-muted'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-1">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.type === 'attendance' ? 'Davomat' : 'Vazifa'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Activities Detail Modal */}
      <Sheet open={isActivitiesModalOpen} onOpenChange={setIsActivitiesModalOpen}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Barcha Faoliyatlar</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-4">
            {allActivities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  activity.status === 'success' ? 'bg-success text-success-foreground' :
                  activity.status === 'warning' ? 'bg-warning text-warning-foreground' :
                  activity.status === 'info' ? 'bg-primary text-primary-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-foreground text-sm">{activity.title}</h4>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  
                  <Badge 
                    variant={
                      activity.status === 'success' ? 'default' :
                      activity.status === 'warning' ? 'destructive' :
                      activity.status === 'info' ? 'secondary' : 'outline'
                    }
                    className="text-xs"
                  >
                    {activity.type === 'attendance' ? 'Davomat' :
                     activity.type === 'task' ? 'Vazifa' :
                     activity.type === 'penalty' ? 'Jarima' :
                     activity.type === 'shift' ? 'Smena' : 'Boshqa'}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => setIsActivitiesModalOpen(false)}
              className="w-full"
            >
              Yopish
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}