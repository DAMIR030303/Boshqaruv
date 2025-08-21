import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Tag,
  Instagram,
  Video,
  Hash,
  Camera,
  Edit3,
  BarChart3,
  Target,
  Sparkles,
  MessageCircle,
  Share2,
  Eye,
  Heart,
  FileText,
  Music,
  MapPin,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'review';
  priority: 'low' | 'medium' | 'high';
  category: string;
  assignee: string;
  dueDate: string;
  dueTime: string;
  tags: string[];
  progress?: number;
  contentType?: 'post' | 'reel' | 'story' | 'carousel';
  scheduledTime?: string;
  platform?: string;
  hashtags?: string[];
  location?: string;
  attachments?: string[];
}

interface EmployeeTasksProps {
  userProfile: any;
  kpiData: any;
  onDataUpdate?: (data: any) => void;
}

export function EmployeeTasks({ userProfile, kpiData, onDataUpdate }: EmployeeTasksProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Sample tasks based on user role
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (userProfile.role === 'Marketolog') {
      return [
        {
          id: '1',
          title: 'Instagram uchun 5 ta post yaratish',
          description: 'Navoiy shahridagi yangi loyihalar haqida postlar tayyorlash',
          status: 'in-progress',
          priority: 'high',
          category: 'Content Creation',
          assignee: 'Shaxriddin Nazarov',
          dueDate: '2025-01-16',
          dueTime: '16:00',
          tags: ['Instagram', 'Post', 'Yangilik'],
          progress: 60,
          contentType: 'post',
          scheduledTime: '09:00, 12:00, 15:00, 18:00, 21:00',
          platform: 'Instagram',
          hashtags: ['#NavoiydaBugun', '#Yangilik', '#Rivojlanish', '#Shahar'],
          location: 'Navoiy, O\'zbekiston'
        },
        {
          id: '2',
          title: 'Video montaj - 3 ta reel',
          description: 'Shahar ko\'chalari va yangi binolar haqida qisqa videolar',
          status: 'pending',
          priority: 'high',
          category: 'Video Production',
          assignee: 'Shaxriddin Nazarov',
          dueDate: '2025-01-16',
          dueTime: '14:30',
          tags: ['Reels', 'Video', 'Montaj'],
          contentType: 'reel',
          platform: 'Instagram',
          hashtags: ['#NavoiyReels', '#ShaharKo\'chalari', '#ZamonaviyBinolar']
        },
        {
          id: '3',
          title: 'Hashtag tadqiqoti va tahlil',
          description: 'Eng mashhur va samarali hashtaglarni aniqlash',
          status: 'completed',
          priority: 'medium',
          category: 'Research',
          assignee: 'Shaxriddin Nazarov',
          dueDate: '2025-01-15',
          dueTime: '18:00',
          tags: ['Hashtag', 'Tadqiqot', 'Analitika'],
          progress: 100
        },
        {
          id: '4',
          title: 'AI yordamida caption yaratish',
          description: 'GPT dan foydalanib 20 ta post uchun caption tayyorlash',
          status: 'review',
          priority: 'medium',
          category: 'AI Content',
          assignee: 'Shaxriddin Nazarov',
          dueDate: '2025-01-17',
          dueTime: '10:00',
          tags: ['AI', 'Caption', 'GPT'],
          progress: 85
        },
        {
          id: '5',
          title: 'Haftalik analitika hisoboti',
          description: 'Instagram sahifasi uchun batafsil tahlil va xulosalar',
          status: 'pending',
          priority: 'medium',
          category: 'Analytics',
          assignee: 'Shaxriddin Nazarov',
          dueDate: '2025-01-18',
          dueTime: '17:00',
          tags: ['Analitika', 'Hisobot', 'KPI']
        },
        {
          id: '6',
          title: 'Kontent kalendari tuzish',
          description: 'Keyingi oy uchun kontent rejasini ishlab chiqish',
          status: 'pending',
          priority: 'low',
          category: 'Planning',
          assignee: 'Shaxriddin Nazarov',
          dueDate: '2025-01-20',
          dueTime: '12:00',
          tags: ['Kalendarlar', 'Rejalashtirish', 'Strategiya']
        }
      ];
    }

    // Default tasks for other employees
    return [
      {
        id: '1',
        title: 'Oylik hisobot tayyorlash',
        description: 'Dekabr oyi uchun ish faoliyati hisoboti',
        status: 'in-progress',
        priority: 'high',
        category: 'Reports',
        assignee: userProfile.name,
        dueDate: '2025-01-16',
        dueTime: '16:00',
        tags: ['Hisobot', 'Oylik'],
        progress: 70
      },
      {
        id: '2',
        title: 'Mijozlar bilan uchrashuv',
        description: 'Yangi loyiha bo\'yicha muhokama',
        status: 'completed',
        priority: 'medium',
        category: 'Meetings',
        assignee: userProfile.name,
        dueDate: '2025-01-15',
        dueTime: '14:30',
        tags: ['Uchrashuv', 'Mijoz'],
        progress: 100
      },
      {
        id: '3',
        title: 'Hujjatlarni tekshirish',
        description: 'Yangi kelgan hujjatlarni ko\'rib chiqish',
        status: 'pending',
        priority: 'low',
        category: 'Documentation',
        assignee: userProfile.name,
        dueDate: '2025-01-17',
        dueTime: '18:00',
        tags: ['Hujjat', 'Tekshirish']
      }
    ];
  });

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    category: '',
    dueDate: '',
    dueTime: '',
    tags: [],
    contentType: userProfile.role === 'Marketolog' ? 'post' : undefined,
    platform: userProfile.role === 'Marketolog' ? 'Instagram' : undefined,
    hashtags: [],
    location: ''
  });

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'my-tasks' && task.assignee === userProfile.name) ||
                      (activeTab === 'content' && userProfile.role === 'Marketolog' && 
                       ['Content Creation', 'Video Production', 'AI Content'].includes(task.category)) ||
                      (activeTab === 'analytics' && userProfile.role === 'Marketolog' && 
                       ['Analytics', 'Research'].includes(task.category));
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTab;
  });

  // Task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white';
      case 'in-progress':
        return 'bg-warning text-white';
      case 'review':
        return 'bg-primary text-white';
      case 'pending':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tugallangan';
      case 'in-progress':
        return 'Jarayonda';
      case 'review':
        return 'Ko\'rib chiqilmoqda';
      case 'pending':
        return 'Kutilmoqda';
      default:
        return 'Noma\'lum';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-danger text-danger';
      case 'medium':
        return 'border-warning text-warning';
      case 'low':
        return 'border-muted-foreground text-muted-foreground';
      default:
        return 'border-muted-foreground text-muted-foreground';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Yuqori';
      case 'medium':
        return 'O\'rta';
      case 'low':
        return 'Past';
      default:
        return 'Noma\'lum';
    }
  };

  const getContentTypeIcon = (contentType?: string) => {
    switch (contentType) {
      case 'post':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'reel':
        return <Video className="w-4 h-4 text-red-500" />;
      case 'story':
        return <Camera className="w-4 h-4 text-blue-500" />;
      case 'carousel':
        return <FileText className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.description) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: newTask.status as Task['status'],
      priority: newTask.priority as Task['priority'],
      category: newTask.category || 'General',
      assignee: userProfile.name,
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      dueTime: newTask.dueTime || '17:00',
      tags: newTask.tags || [],
      contentType: newTask.contentType,
      platform: newTask.platform,
      hashtags: newTask.hashtags,
      location: newTask.location
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      category: '',
      dueDate: '',
      dueTime: '',
      tags: [],
      contentType: userProfile.role === 'Marketolog' ? 'post' : undefined,
      platform: userProfile.role === 'Marketolog' ? 'Instagram' : undefined,
      hashtags: [],
      location: ''
    });
    setShowCreateDialog(false);

    // Update KPI data
    onDataUpdate?.({
      type: 'task_update',
      data: {
        total: taskStats.total + 1
      }
    });
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));

    // Update KPI data
    const updatedStats = {
      completed: newStatus === 'completed' ? taskStats.completed + 1 : taskStats.completed,
      inProgress: newStatus === 'in-progress' ? taskStats.inProgress + 1 : taskStats.inProgress
    };

    onDataUpdate?.({
      type: 'task_update',
      data: updatedStats
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Vazifalar</h1>
          <p className="text-sm text-muted-foreground">
            {userProfile.role === 'Marketolog' ? 
              'Marketing vazifalarini boshqaring' : 
              'Kundalik vazifalarni kuzatib boring'
            }
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Yangi vazifa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle>Yangi vazifa yaratish</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nomi</label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Vazifa nomi"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tavsif</label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Vazifa tavsifi"
                  className="min-h-[80px]"
                />
              </div>

              {userProfile.role === 'Marketolog' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Kontent turi</label>
                    <Select 
                      value={newTask.contentType} 
                      onValueChange={(value: any) => setNewTask(prev => ({ ...prev, contentType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Turni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="post">Post</SelectItem>
                        <SelectItem value="reel">Reel</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Platforma</label>
                    <Select 
                      value={newTask.platform} 
                      onValueChange={(value) => setNewTask(prev => ({ ...prev, platform: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Platformani tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Telegram">Telegram</SelectItem>
                        <SelectItem value="YouTube">YouTube</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Muhimlik</label>
                  <Select 
                    value={newTask.priority} 
                    onValueChange={(value: any) => setNewTask(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Past</SelectItem>
                      <SelectItem value="medium">O'rta</SelectItem>
                      <SelectItem value="high">Yuqori</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Kategoriya</label>
                  <Input
                    value={newTask.category}
                    onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Kategoriya"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Muddat</label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Vaqt</label>
                  <Input
                    type="time"
                    value={newTask.dueTime}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1"
                >
                  Bekor qilish
                </Button>
                <Button onClick={handleCreateTask} className="flex-1">
                  Yaratish
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3 text-center">
          <div className="text-lg font-semibold">{taskStats.total}</div>
          <div className="text-xs text-muted-foreground">Jami</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-lg font-semibold text-success">{taskStats.completed}</div>
          <div className="text-xs text-muted-foreground">Tugallangan</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-lg font-semibold text-warning">{taskStats.inProgress}</div>
          <div className="text-xs text-muted-foreground">Jarayonda</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-lg font-semibold text-danger">{taskStats.overdue}</div>
          <div className="text-xs text-muted-foreground">Kechikkan</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Vazifalarni qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Holat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha holatlar</SelectItem>
              <SelectItem value="pending">Kutilmoqda</SelectItem>
              <SelectItem value="in-progress">Jarayonda</SelectItem>
              <SelectItem value="review">Ko'rib chiqilmoqda</SelectItem>
              <SelectItem value="completed">Tugallangan</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Muhimlik" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha muhimliklar</SelectItem>
              <SelectItem value="high">Yuqori</SelectItem>
              <SelectItem value="medium">O'rta</SelectItem>
              <SelectItem value="low">Past</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs for Marketing employees */}
      {userProfile.role === 'Marketolog' && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Barchasi</TabsTrigger>
            <TabsTrigger value="content">Kontent</TabsTrigger>
            <TabsTrigger value="analytics">Analitika</TabsTrigger>
            <TabsTrigger value="my-tasks">Mening</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-4 cursor-pointer" onClick={() => setSelectedTask(task)}>
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      {task.contentType && getContentTypeIcon(task.contentType)}
                      <div className="flex-1">
                        <h3 className={`font-medium text-sm ${
                          task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                        }`}>
                          {task.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      </div>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                      {getStatusText(task.status)}
                    </Badge>
                  </div>

                  {/* Progress bar for in-progress tasks */}
                  {task.progress !== undefined && task.status === 'in-progress' && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Bajarilishi</span>
                        <span>{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  )}

                  {/* Tags and metadata */}
                  <div className="flex flex-wrap gap-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPriorityColor(task.priority)}`}
                    >
                      {getPriorityText(task.priority)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {task.category}
                    </Badge>
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString('uz-UZ')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.dueTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {task.assignee}
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="flex items-center gap-1">
                      {task.status !== 'completed' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTaskStatus(task.id, 'completed');
                          }}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Marketing specific content */}
                  {userProfile.role === 'Marketolog' && task.hashtags && task.hashtags.length > 0 && (
                    <div className="pt-2 border-t border-border">
                      <div className="flex flex-wrap gap-1">
                        {task.hashtags.slice(0, 4).map((hashtag) => (
                          <Badge key={hashtag} variant="outline" className="text-xs text-blue-600">
                            {hashtag}
                          </Badge>
                        ))}
                        {task.hashtags.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{task.hashtags.length - 4} ta
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <Card className="p-8 text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3>Vazifalar topilmadi</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Qidiruv parametrlarini o'zgartiring yoki yangi vazifa yarating
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Yangi vazifa
            </Button>
          </Card>
        )}
      </div>

      {/* Task Detail Dialog */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="max-w-sm mx-auto max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedTask.contentType && getContentTypeIcon(selectedTask.contentType)}
                {selectedTask.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Tavsif</h4>
                <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Holat</h4>
                  <Badge className={getStatusColor(selectedTask.status)}>
                    {getStatusText(selectedTask.status)}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Muhimlik</h4>
                  <Badge variant="outline" className={getPriorityColor(selectedTask.priority)}>
                    {getPriorityText(selectedTask.priority)}
                  </Badge>
                </div>
              </div>

              {selectedTask.progress !== undefined && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-sm">Bajarilishi</h4>
                    <span className="text-sm">{selectedTask.progress}%</span>
                  </div>
                  <Progress value={selectedTask.progress} className="h-2" />
                </div>
              )}

              {userProfile.role === 'Marketolog' && (
                <>
                  {selectedTask.platform && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Platforma</h4>
                      <p className="text-sm text-muted-foreground">{selectedTask.platform}</p>
                    </div>
                  )}

                  {selectedTask.hashtags && selectedTask.hashtags.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Hashtags</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedTask.hashtags.map((hashtag) => (
                          <Badge key={hashtag} variant="outline" className="text-xs">
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTask.location && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Joylashuv</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {selectedTask.location}
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Muddat</h4>
                  <p className="text-muted-foreground">
                    {new Date(selectedTask.dueDate).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Vaqt</h4>
                  <p className="text-muted-foreground">{selectedTask.dueTime}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTask(null)}
                  className="flex-1"
                >
                  Yopish
                </Button>
                {selectedTask.status !== 'completed' && (
                  <Button 
                    onClick={() => {
                      updateTaskStatus(selectedTask.id, 'completed');
                      setSelectedTask(null);
                    }}
                    className="flex-1"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Tugatish
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}