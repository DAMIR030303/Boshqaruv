import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  Plus, 
  Filter, 
  Search, 
  Calendar,
  Clock,
  Users,
  Flag,
  MessageSquare,
  Paperclip,
  MoreVertical,
  CheckCircle,
  Circle,
  AlertCircle,
  TrendingUp,
  Target,
  Zap,
  Star
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { CreateTaskModal } from '../tasks/CreateTaskModal';
import { CommentModal } from '../tasks/CommentModal';
import { toast } from 'sonner';

interface MobileTasksProps {
  kpiData: {
    tasks: {
      completed: number;
      inProgress: number;
      pending: number;
      total: number;
    };
  };
  userProfile: any;
  onDataUpdate: (data: any) => void;
}

const tasks = [
  {
    id: 1,
    title: 'Instagram post yaratish',
    description: 'Kunlik Instagram uchun 15-18 ta post yaratish va schedule qilish',
    status: 'in-progress',
    priority: 'high',
    assignee: {
      name: 'Shaxriddin Adizov Sherali o\'g\'li',
      avatar: '/api/placeholder/40/40'
    },
    dueDate: '2024-08-17',
    progress: 75,
    comments: 5,
    attachments: 8,
    tags: ['Instagram', 'Social Media', 'Content'],
    estimatedTime: '4 soat',
    difficulty: 'medium'
  },
  {
    id: 2,
    title: 'Video montaj qilish',
    description: 'Reels va Stories uchun 10-15 ta video montaj va editing',
    status: 'in-progress',
    priority: 'high',
    assignee: {
      name: 'Shaxriddin Adizov Sherali o\'g\'li',
      avatar: '/api/placeholder/40/40'
    },
    dueDate: '2024-08-17',
    progress: 60,
    comments: 3,
    attachments: 12,
    tags: ['Video', 'Editing', 'Reels'],
    estimatedTime: '6 soat',
    difficulty: 'hard'
  },
  {
    id: 3,
    title: 'AI caption generator',
    description: 'GPT yordamida post matnlari va hashtag yaratish',
    status: 'completed',
    priority: 'medium',
    assignee: {
      name: 'Shaxriddin Adizov Sherali o\'g\'li',
      avatar: '/api/placeholder/40/40'
    },
    dueDate: '2024-08-16',
    progress: 100,
    comments: 2,
    attachments: 0,
    tags: ['AI', 'GPT', 'Content Writing'],
    estimatedTime: '2 soat',
    difficulty: 'easy'
  },
  {
    id: 4,
    title: 'Kontent monitoring',
    description: 'Social media performance tahlili va competitor monitoring',
    status: 'pending',
    priority: 'medium',
    assignee: {
      name: 'Shaxriddin Adizov Sherali o\'g\'li',
      avatar: '/api/placeholder/40/40'
    },
    dueDate: '2024-08-18',
    progress: 0,
    comments: 1,
    attachments: 0,
    tags: ['Analytics', 'Monitoring', 'Strategy'],
    estimatedTime: '3 soat',
    difficulty: 'medium'
  },
  {
    id: 5,
    title: 'Marketing strategiya',
    description: 'Haftalik marketing rejasi va kontent kalendari tayyorlash',
    status: 'pending',
    priority: 'high',
    assignee: {
      name: 'Shaxriddin Adizov Sherali o\'g\'li',
      avatar: '/api/placeholder/40/40'
    },
    dueDate: '2024-08-19',
    progress: 0,
    comments: 0,
    attachments: 2,
    tags: ['Strategy', 'Planning', 'Calendar'],
    estimatedTime: '5 soat',
    difficulty: 'hard'
  }
];

const priorityColors = {
  high: 'text-danger',
  medium: 'text-warning',
  low: 'text-success'
};

const statusIcons = {
  pending: Circle,
  'in-progress': AlertCircle,
  completed: CheckCircle
};

const statusColors = {
  pending: 'text-muted-foreground',
  'in-progress': 'text-primary',
  completed: 'text-success'
};

const difficultyColors = {
  easy: 'bg-success/10 text-success',
  medium: 'bg-warning/10 text-warning',
  hard: 'bg-danger/10 text-danger'
};

export function MobileTasks({ kpiData, userProfile, onDataUpdate }: MobileTasksProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && task.status === activeTab;
  });

  const handleCreateTask = (taskData: any) => {
    console.log('Creating new task:', taskData);
    
    // Simulate task creation
    const newTask = {
      id: tasks.length + 1,
      title: taskData.title,
      description: taskData.description,
      status: 'pending',
      priority: taskData.priority,
      assignee: {
        name: 'Shaxriddin Adizov Sherali o\'g\'li',
        avatar: '/api/placeholder/40/40'
      },
      dueDate: taskData.dueDate,
      progress: 0,
      comments: 0,
      attachments: 0,
      tags: taskData.project ? [taskData.project] : [],
      estimatedTime: '2 soat',
      difficulty: 'medium'
    };
    
    // Add to tasks array (in real app, this would be an API call)
    tasks.push(newTask);
    
    // Update KPI data
    const updatedKpiData = {
      ...kpiData,
      tasks: {
        ...kpiData.tasks,
        pending: kpiData.tasks.pending + 1,
        total: kpiData.tasks.total + 1
      }
    };
    
    onDataUpdate(updatedKpiData);
    
    // Close modal
    setIsCreateModalOpen(false);
    
    // Show success message
    toast.success('Yangi vazifa muvaffaqiyatli yaratildi!');
  };

  const handleEditTask = (taskData: any) => {
    console.log('Editing task:', taskData);
    
    // Simulate task update
    const taskIndex = tasks.findIndex(t => t.id === editingTask.id);
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        assignee: {
          name: 'Shaxriddin Adizov Sherali o\'g\'li',
          avatar: '/api/placeholder/40/40'
        },
        dueDate: taskData.dueDate,
        tags: taskData.project ? [taskData.project] : []
      };
    }
    
    // Close modals and reset state
    setIsEditModalOpen(false);
    setEditingTask(null);
    setSelectedTask(null);
    
    // Show success message
    toast.success('Vazifa muvaffaqiyatli tahrirlandi!');
  };

  const openEditModal = () => {
    if (selectedTask) {
      setEditingTask(selectedTask);
      setIsEditModalOpen(true);
    }
  };

  const openCommentModal = () => {
    if (selectedTask) {
      setIsCommentModalOpen(true);
    }
  };

  const handleAddComment = (commentText: string) => {
    if (selectedTask && commentText.trim()) {
      console.log('Adding comment to task:', selectedTask.id, commentText);
      
      // Simulate adding comment to task
      const taskIndex = tasks.findIndex(t => t.id === selectedTask.id);
      if (taskIndex !== -1) {
        tasks[taskIndex] = {
          ...tasks[taskIndex],
          comments: tasks[taskIndex].comments + 1
        };
        
        // Update selected task
        setSelectedTask({
          ...selectedTask,
          comments: selectedTask.comments + 1
        });
      }
      
      // Close comment modal
      setIsCommentModalOpen(false);
      
      // Show success message
      toast.success('Izoh muvaffaqiyatli qo\'shildi!');
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: 'destructive',
      medium: 'outline',
      low: 'secondary'
    };
    
    const labels = {
      high: 'Yuqori',
      medium: 'O\'rta',
      low: 'Past'
    };

    return (
      <Badge variant={variants[priority as keyof typeof variants] as any} className="rounded-full">
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  const getDifficultyBadge = (difficulty: string) => {
    const labels = {
      easy: 'Oson',
      medium: 'O\'rta',
      hard: 'Qiyin'
    };

    return (
      <Badge variant="outline" className={`rounded-full ${difficultyColors[difficulty as keyof typeof difficultyColors]}`}>
        {labels[difficulty as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusText = (status: string) => {
    const labels = {
      pending: 'Kutilmoqda',
      'in-progress': 'Jarayonda',
      completed: 'Bajarildi'
    };
    return labels[status as keyof typeof labels];
  };

  const taskStats = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  return (
    <div className="boshqaruv-container space-6">
      {/* Enhanced Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Vazifalarni qidiring..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-2xl border-2 focus:border-primary"
          />
        </div>
      </motion.div>

      {/* Enhanced Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-success/5 to-success/10">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-success/10 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <Badge variant="secondary" className="bg-success/10 text-success border-0">
                  {Math.round((kpiData.tasks.completed / kpiData.tasks.total) * 100)}%
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {kpiData.tasks.completed}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Bajarilgan vazifalar
                </p>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success font-medium">+20% bu hafta</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                  Faol
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {kpiData.tasks.inProgress}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Jarayondagi vazifalar
                </p>
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="text-xs text-primary font-medium">Ishlanmoqda</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Enhanced Add New Task Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Button 
          className="w-full h-14 text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg rounded-2xl" 
          size="lg" 
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-5 w-5 mr-3" />
          Yangi vazifa yaratish
        </Button>
      </motion.div>

      {/* Enhanced Tasks Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="bg-muted/20 rounded-2xl p-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-transparent gap-1">
              <TabsTrigger 
                value="all" 
                className="rounded-xl text-xs data-[state=active]:bg-background data-[state=active]:shadow-md"
              >
                Hammasi ({taskStats.all})
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="rounded-xl text-xs data-[state=active]:bg-background data-[state=active]:shadow-md"
              >
                Kutilmoqda ({taskStats.pending})
              </TabsTrigger>
              <TabsTrigger 
                value="in-progress" 
                className="rounded-xl text-xs data-[state=active]:bg-background data-[state=active]:shadow-md"
              >
                Jarayonda ({taskStats['in-progress']})
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="rounded-xl text-xs data-[state=active]:bg-background data-[state=active]:shadow-md"
              >
                Bajarildi ({taskStats.completed})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </motion.div>

      {/* Enhanced Tasks List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 mb-8"
      >
        <AnimatePresence>
          {filteredTasks.map((task, index) => {
            const StatusIcon = statusIcons[task.status as keyof typeof statusIcons];
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
                  onClick={() => setSelectedTask(task)}
                >
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      {/* Enhanced Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`p-2 rounded-xl ${
                            task.status === 'completed' ? 'bg-success/10' :
                            task.status === 'in-progress' ? 'bg-primary/10' :
                            'bg-muted/20'
                          }`}>
                            <StatusIcon className={`h-4 w-4 ${statusColors[task.status as keyof typeof statusColors]}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
                              {task.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {getPriorityBadge(task.priority)}
                              {getDifficultyBadge(task.difficulty)}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Enhanced Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2 pl-12">
                        {task.description}
                      </p>

                      {/* Enhanced Progress */}
                      {task.status === 'in-progress' && (
                        <div className="space-y-2 pl-12">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Jarayon</span>
                            <span className="text-xs font-medium">{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </div>
                      )}

                      {/* Enhanced Tags */}
                      <div className="flex flex-wrap gap-1 pl-12">
                        {task.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Enhanced Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div className="flex items-center space-x-4">
                          {/* Assignee */}
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {task.assignee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {task.assignee.name.split(' ')[0]}
                            </span>
                          </div>

                          {/* Estimated Time */}
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{task.estimatedTime}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {/* Due date */}
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {new Date(task.dueDate).toLocaleDateString('uz-UZ')}
                            </span>
                          </div>

                          {/* Comments & Attachments */}
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{task.comments}</span>
                            </div>
                            {task.attachments > 0 && (
                              <div className="flex items-center space-x-1">
                                <Paperclip className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{task.attachments}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-2">Vazifalar topilmadi</div>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Filterni tozalash
            </Button>
          </div>
        )}
      </motion.div>

      {/* Enhanced Task Details Sheet */}
      <Sheet open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          {selectedTask && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <SheetTitle className="text-left mb-3">{selectedTask.title}</SheetTitle>
                    <div className="flex items-center space-x-2 mb-3">
                      {getPriorityBadge(selectedTask.priority)}
                      <Badge variant="outline" className="rounded-full">
                        {getStatusText(selectedTask.status)}
                      </Badge>
                      {getDifficultyBadge(selectedTask.difficulty)}
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center space-x-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span>Tavsif</span>
                  </h4>
                  <p className="text-muted-foreground bg-muted/20 p-4 rounded-xl">{selectedTask.description}</p>
                </div>

                {/* Progress */}
                {selectedTask.status === 'in-progress' && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>Jarayon</span>
                    </h4>
                    <div className="space-y-3 bg-primary/5 p-4 rounded-xl">
                      <div className="flex justify-between">
                        <span className="text-sm">Bajarilgan</span>
                        <span className="text-sm font-medium">{selectedTask.progress}%</span>
                      </div>
                      <Progress value={selectedTask.progress} className="h-3" />
                    </div>
                  </div>
                )}

                {/* Details */}
                <div>
                  <h4 className="font-medium mb-3">Ma'lumotlar</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Mas'ul:</span>
                      </div>
                      <span className="font-medium">{selectedTask.assignee.name}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Muddat:</span>
                      </div>
                      <span className="font-medium">{new Date(selectedTask.dueDate).toLocaleDateString('uz-UZ')}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Baholangan vaqt:</span>
                      </div>
                      <span className="font-medium">{selectedTask.estimatedTime}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span>Izohlar:</span>
                      </div>
                      <span className="font-medium">{selectedTask.comments} ta</span>
                    </div>
                    {selectedTask.attachments > 0 && (
                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <span>Fayllar:</span>
                        </div>
                        <span className="font-medium">{selectedTask.attachments} ta</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="font-medium mb-3">Teglar</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map((tag: string, i: number) => (
                      <Badge key={i} variant="secondary" className="rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button variant="outline" onClick={openEditModal} className="rounded-xl">
                    Tahrirlash
                  </Button>
                  <Button onClick={openCommentModal} className="rounded-xl">
                    Izoh qoldirish
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Task Modal */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTask}
      />

      {/* Edit Task Modal */}
      <CreateTaskModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditTask}
        editingTask={editingTask}
      />

      {/* Comment Modal */}
      <CommentModal 
        isOpen={isCommentModalOpen} 
        onClose={() => setIsCommentModalOpen(false)}
        onSave={handleAddComment}
        taskTitle={selectedTask?.title || ''}
      />
    </div>
  );
}