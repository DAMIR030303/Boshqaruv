import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Instagram, 
  Video, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Target,
  Activity,
  BarChart3,
  Users,
  Play,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface MarketingDashboardProps {
  kpiData?: any;
  userProfile?: any;
  onDataUpdate?: (data: any) => void;
  onNavigate?: (tab: string) => void;
}

export function MarketingDashboard({ 
  kpiData, 
  userProfile, 
  onDataUpdate, 
  onNavigate 
}: MarketingDashboardProps) {
  // Marketing specific state
  const [instagramPosts, setInstagramPosts] = useState({ completed: 15, target: 18 });
  const [videoProjects, setVideoProjects] = useState({ completed: 10, target: 15 });
  const [contentMonitoring, setContentMonitoring] = useState('Aktiv');
  const [todayTasks, setTodayTasks] = useState({ completed: 1, total: 5 });
  const [arrivalTime, setArrivalTime] = useState('08:30');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        setInstagramPosts(prev => ({
          ...prev,
          completed: Math.min(prev.completed + 1, prev.target)
        }));
      }
      
      if (Math.random() < 0.08) {
        setVideoProjects(prev => ({
          ...prev,
          completed: Math.min(prev.completed + 1, prev.target)
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleQuickAction = (action: string) => {
    if (onNavigate) {
      onNavigate(action);
    }
  };

  const instagramProgress = (instagramPosts.completed / instagramPosts.target) * 100;
  const videoProgress = (videoProjects.completed / videoProjects.target) * 100;
  const tasksProgress = (todayTasks.completed / todayTasks.total) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 rounded-b-lg mb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-xl font-semibold text-foreground mb-2">
            Marketing vazifalarini boshqarish
          </h1>
          <p className="text-sm text-muted-foreground">
            Bugungi kun uchun marketing faoliyati
          </p>
        </motion.div>
      </div>

      <div className="px-4 space-y-6">
        {/* Marketing KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          {/* Instagram Posts */}
          <Card className="border-0 shadow-md bg-gradient-to-r from-pink-500/10 to-purple-600/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Instagram className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Instagram postlar</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-foreground">
                        {instagramPosts.completed}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /{instagramPosts.target}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={instagramProgress >= 80 ? "default" : "destructive"}
                    className="mb-2"
                  >
                    {instagramProgress.toFixed(0)}%
                  </Badge>
                  <p className="text-xs text-muted-foreground">Kunlik maqsad</p>
                </div>
              </div>
              <div className="space-y-2">
                <Progress value={instagramProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {instagramPosts.target - instagramPosts.completed} ta post qoldi
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Video Montage */}
          <Card className="border-0 shadow-md bg-gradient-to-r from-blue-500/10 to-cyan-600/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Video className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Video montaj</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-foreground">
                        {videoProjects.completed}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /{videoProjects.target}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={videoProgress >= 80 ? "default" : "destructive"}
                    className="mb-2"
                  >
                    {videoProgress.toFixed(0)}%
                  </Badge>
                  <p className="text-xs text-muted-foreground">Kunlik maqsad</p>
                </div>
              </div>
              <div className="space-y-2">
                <Progress value={videoProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {videoProjects.target - videoProjects.completed} ta video qoldi
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Monitoring */}
          <Card className="border-0 shadow-md bg-gradient-to-r from-green-500/10 to-emerald-600/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kontent monitoring</p>
                    <p className="text-lg font-semibold text-foreground">
                      {contentMonitoring}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <Badge variant="outline" className="border-blue-500 text-blue-600">
                    Real vaqtda
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Tezkor amallar</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center gap-2 border-primary/20 hover:bg-primary/10"
              onClick={() => handleQuickAction('tasks')}
            >
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-sm">Vazifalar</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center gap-2 border-blue-500/20 hover:bg-blue-500/10"
              onClick={() => handleQuickAction('attendance')}
            >
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Davomat</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center gap-2 border-green-500/20 hover:bg-green-500/10"
              onClick={() => handleQuickAction('reports')}
            >
              <BarChart3 className="h-5 w-5 text-green-600" />
              <span className="text-sm">Hisobot</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center gap-2 border-purple-500/20 hover:bg-purple-500/10"
              onClick={() => onNavigate?.('dashboard')}
            >
              <Activity className="h-5 w-5 text-purple-600" />
              <span className="text-sm">Tahlil</span>
            </Button>
          </div>
        </motion.div>

        {/* Today's Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Bugungi xulosa</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Kelish vaqti</p>
                    <p className="text-lg font-semibold text-foreground">
                      {arrivalTime}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Target className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Vazifalar</p>
                    <p className="text-lg font-semibold text-foreground">
                      {todayTasks.completed}/{todayTasks.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pb-8"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Bugungi vazifalar</h2>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-danger rounded-full mt-2"></div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">
                    Oylik hisobot tayyorlash
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Marketing faoliyati bo'yicha oy yakunida hisobot tayyorlash
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      16:00
                    </Badge>
                    <Badge variant="destructive" className="text-xs">
                      Yuqori
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}