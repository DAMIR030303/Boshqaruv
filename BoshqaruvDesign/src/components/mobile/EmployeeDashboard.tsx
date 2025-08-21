import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Calendar,
  Users,
  Star,
  Target,
  Award,
  Zap,
  BarChart3,
  Heart,
  Eye,
  Share2,
  Instagram,
  Video,
  Sparkles,
  MessageCircle,
  PieChart
} from 'lucide-react';

// Import marketing components
import { MarketingContentManager } from './MarketingContentManager';
import { AIContentGenerator } from './AIContentGenerator';
import { MarketingAnalytics } from './MarketingAnalytics';

interface EmployeeDashboardProps {
  userProfile: any;
  kpiData: any;
  onDataUpdate?: (data: any) => void;
  onNavigate?: (tab: string) => void;
}

export function EmployeeDashboard({ 
  userProfile, 
  kpiData, 
  onDataUpdate,
  onNavigate 
}: EmployeeDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [activeWidget, setActiveWidget] = useState<'content' | 'analytics' | null>(null);
  
  // Marketing KPI states for marketolog role
  const [marketingKPIs, setMarketingKPIs] = useState({
    todayPosts: { current: 12, target: 18 },
    todayReels: { current: 8, target: 15 },
    weeklyEngagement: 8.5,
    weeklyReach: 45200,
    pendingContent: 5,
    scheduledContent: 12
  });

  // Real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Sample attendance data for employees
  const [attendanceData] = useState({
    checkInTime: '09:15',
    workHours: '7h 45m',
    breakTime: '45m',
    status: 'Ishda'
  });

  // Sample tasks for all employees
  const [todayTasks] = useState([
    {
      id: '1',
      title: userProfile.role === 'Marketolog' ? 'Instagram uchun 5 ta post yaratish' : 'Oylik hisobot tayyorlash',
      priority: 'high',
      status: 'in-progress',
      deadline: '16:00'
    },
    {
      id: '2', 
      title: userProfile.role === 'Marketolog' ? 'Video montaj - 3 ta reel' : 'Mijozlar bilan uchrashuv',
      priority: 'medium',
      status: 'completed',
      deadline: '14:30'
    },
    {
      id: '3',
      title: userProfile.role === 'Marketolog' ? 'Hashtag tadqiqoti va tahlil' : 'Hujjatlarni tekshirish',
      priority: 'low',
      status: 'pending',
      deadline: '18:00'
    }
  ]);

  // Quick actions based on role
  const getQuickActions = () => {
    if (userProfile.role === 'Marketolog') {
      return [
        {
          id: 'ai-content',
          title: 'AI Kontent',
          subtitle: 'Yangi kontent yaratish',
          icon: Sparkles,
          color: 'bg-primary',
          action: () => setShowAIGenerator(true)
        },
        {
          id: 'schedule-post',
          title: 'Post rejalash',
          subtitle: 'Kontent kalendari',
          icon: Calendar,
          color: 'bg-warning',
          action: () => onNavigate?.('tasks')
        },
        {
          id: 'analytics',
          title: 'Analitika',
          subtitle: 'Natijalar tahlili',
          icon: BarChart3,
          color: 'bg-success',
          action: () => setActiveWidget('analytics')
        },
        {
          id: 'content-manager',
          title: 'Kontent',
          subtitle: 'Boshqarish paneli',
          icon: Instagram,
          color: 'bg-danger',
          action: () => setActiveWidget('content')
        }
      ];
    }

    // Default actions for other employees
    return [
      {
        id: 'check-in',
        title: isCheckedIn ? 'Check Out' : 'Check In',
        subtitle: 'Ish vaqtini belgilash',
        icon: Clock,
        color: isCheckedIn ? 'bg-danger' : 'bg-success',
        action: () => setIsCheckedIn(!isCheckedIn)
      },
      {
        id: 'tasks',
        title: 'Vazifalar',
        subtitle: 'Bugungi rejalar',
        icon: CheckCircle2,
        color: 'bg-primary',
        action: () => onNavigate?.('tasks')
      },
      {
        id: 'attendance',
        title: 'Davomat',
        subtitle: 'Ish vaqti hisoboti',
        icon: Calendar,
        color: 'bg-warning',
        action: () => onNavigate?.('attendance')
      },
      {
        id: 'reports',
        title: 'Hisobotlar',
        subtitle: 'Natijalar ko\'rish',
        icon: BarChart3,
        color: 'bg-success',
        action: () => onNavigate?.('reports')
      }
    ];
  };

  const handleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
    onDataUpdate?.({
      type: 'attendance_update',
      data: {
        present: isCheckedIn ? kpiData.attendance.present - 1 : kpiData.attendance.present + 1
      }
    });
  };

  // Greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Xayrli tong';
    if (hour < 18) return 'Xayrli kun';
    return 'Xayrli kech';
  };

  // Render marketing-specific widgets
  if (activeWidget === 'content') {
    return (
      <div>
        <div className="flex items-center justify-between p-4 border-b">
          <h2>Kontent boshqaruvi</h2>
          <Button variant="ghost" size="sm" onClick={() => setActiveWidget(null)}>
            ← Orqaga
          </Button>
        </div>
        <MarketingContentManager 
          userProfile={userProfile}
          kpiData={marketingKPIs}
          onDataUpdate={onDataUpdate}
        />
      </div>
    );
  }

  if (activeWidget === 'analytics') {
    return (
      <div>
        <div className="flex items-center justify-between p-4 border-b">
          <h2>Marketing Analitika</h2>
          <Button variant="ghost" size="sm" onClick={() => setActiveWidget(null)}>
            ← Orqaga
          </Button>
        </div>
        <MarketingAnalytics 
          userProfile={userProfile}
          kpiData={marketingKPIs}
        />
      </div>
    );
  }

  if (showAIGenerator) {
    return (
      <AIContentGenerator 
        onGenerate={(content) => {
          console.log('Generated content:', content);
          setShowAIGenerator(false);
        }}
        onClose={() => setShowAIGenerator(false)}
      />
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">
              {getGreeting()}, {userProfile.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              {userProfile.role === 'Marketolog' ? 
                'Bugun marketing maqsadlaringizni amalga oshiring' :
                'Bugungi ish kuniga tayyor misiz?'
              }
            </p>
          </div>
          <Avatar className="h-12 w-12">
            <AvatarImage src={userProfile.avatar} />
            <AvatarFallback>{userProfile.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>

        {/* Current Time & Status */}
        <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-mono">
                {currentTime.toLocaleTimeString('uz-UZ', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentTime.toLocaleDateString('uz-UZ', { 
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </div>
            </div>
            <Badge 
              variant={isCheckedIn ? "default" : "secondary"}
              className={isCheckedIn ? "bg-success text-white" : ""}
            >
              {isCheckedIn ? 'Ishda' : 'Tashqarida'}
            </Badge>
          </div>
        </Card>
      </motion.div>

      {/* Marketing KPIs for Marketolog */}
      {userProfile.role === 'Marketolog' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="mb-4 flex items-center gap-2">
            <Instagram className="w-5 h-5 text-pink-500" />
            Bugungi maqsadlar
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span className="text-sm">Postlar</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {marketingKPIs.todayPosts.current}/{marketingKPIs.todayPosts.target}
                </span>
              </div>
              <Progress 
                value={(marketingKPIs.todayPosts.current / marketingKPIs.todayPosts.target) * 100} 
                className="h-2 mb-2"
              />
              <div className="text-xs text-muted-foreground">
                {marketingKPIs.todayPosts.target - marketingKPIs.todayPosts.current} ta qoldi
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Reels</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {marketingKPIs.todayReels.current}/{marketingKPIs.todayReels.target}
                </span>
              </div>
              <Progress 
                value={(marketingKPIs.todayReels.current / marketingKPIs.todayReels.target) * 100} 
                className="h-2 mb-2"
              />
              <div className="text-xs text-muted-foreground">
                {marketingKPIs.todayReels.target - marketingKPIs.todayReels.current} ta qoldi
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Engagement</span>
                </div>
              </div>
              <div className="text-xl font-semibold">{marketingKPIs.weeklyEngagement}%</div>
              <div className="text-xs text-success">+1.2% haftalik</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Qamrov</span>
                </div>
              </div>
              <div className="text-xl font-semibold">{(marketingKPIs.weeklyReach / 1000).toFixed(1)}K</div>
              <div className="text-xs text-success">Haftalik natija</div>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: userProfile.role === 'Marketolog' ? 0.2 : 0.1 }}
      >
        <h2 className="mb-4">Tez harakatlar</h2>
        <div className="grid grid-cols-2 gap-4">
          {getQuickActions().map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="p-4 cursor-pointer hover:shadow-md transition-all duration-200" 
                onClick={action.action}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.subtitle}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Today's Tasks */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: userProfile.role === 'Marketolog' ? 0.3 : 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2>Bugungi vazifalar</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onNavigate?.('tasks')}
          >
            Barchasini ko'rish
          </Button>
        </div>
        
        <div className="space-y-3">
          {todayTasks.slice(0, 3).map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-3 h-3 rounded-full ${
                      task.status === 'completed' ? 'bg-success' :
                      task.status === 'in-progress' ? 'bg-warning' : 'bg-muted'
                    }`} />
                    <div className="flex-1">
                      <h3 className={`font-medium text-sm ${
                        task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            task.priority === 'high' ? 'border-danger text-danger' :
                            task.priority === 'medium' ? 'border-warning text-warning' :
                            'border-muted-foreground text-muted-foreground'
                          }`}
                        >
                          {task.priority === 'high' ? 'Yuqori' :
                           task.priority === 'medium' ? 'O\'rta' : 'Past'}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                  {task.status === 'completed' && (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Work Status for non-marketing employees */}
      {userProfile.role !== 'Marketolog' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="mb-4">Bugungi ish holati</h2>
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Kelish vaqti</div>
                <div className="text-lg font-semibold">{attendanceData.checkInTime}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Ish vaqti</div>
                <div className="text-lg font-semibold">{attendanceData.workHours}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Tanaffus</div>
                <div className="text-lg font-semibold">{attendanceData.breakTime}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Holat</div>
                <Badge className="bg-success text-white">{attendanceData.status}</Badge>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Marketing Quick Stats */}
      {userProfile.role === 'Marketolog' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="mb-4">Tezkor statistika</h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-lg font-semibold">{marketingKPIs.scheduledContent}</div>
              <div className="text-xs text-muted-foreground">Rejalashtirilgan</div>
            </Card>
            <Card className="p-3 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-warning" />
              <div className="text-lg font-semibold">{marketingKPIs.pendingContent}</div>
              <div className="text-xs text-muted-foreground">Kutilayotgan</div>
            </Card>
            <Card className="p-3 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-success" />
              <div className="text-lg font-semibold">+12%</div>
              <div className="text-xs text-muted-foreground">Haftalik o'sish</div>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}