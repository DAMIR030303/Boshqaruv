import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  Check, 
  Calendar,
  User,
  Paperclip,
  Camera,
  Upload,
  X,
  ChevronRight,
  Flag
} from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedBy: {
    name: string;
    avatar: string;
  };
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
  comments?: Array<{
    id: string;
    text: string;
    author: string;
    timestamp: string;
  }>;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Frontend komponenti yaratish',
    description: 'Login sahifasi uchun responsive komponent yaratish kerak',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2024-12-22T17:00:00',
    assignedBy: {
      name: 'Dilnoza Rahimova',
      avatar: '/api/placeholder/32/32'
    },
    comments: [
      {
        id: '1',
        text: 'Dizayn fayllarni yukladim',
        author: 'Dilnoza Rahimova',
        timestamp: '2024-12-20T09:30:00'
      }
    ]
  },
  {
    id: '2',
    title: 'API dokumentatsiyasini yangilash',
    description: 'Yangi endpointlar uchun dokumentatsiya yozish',
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-12-23T12:00:00',
    assignedBy: {
      name: 'Jamshid Tursunov',
      avatar: '/api/placeholder/32/32'
    }
  },
  {
    id: '3',
    title: 'Database migratsiyasi',
    description: 'Yangi jadvallar uchun migratsiya skriptlari',
    status: 'overdue',
    priority: 'high',
    dueDate: '2024-12-19T15:00:00',
    assignedBy: {
      name: 'Jamshid Tursunov',
      avatar: '/api/placeholder/32/32'
    }
  },
  {
    id: '4',
    title: 'Unit testlar yozish',
    description: 'Barcha komponentlar uchun unit testlar',
    status: 'completed',
    priority: 'low',
    dueDate: '2024-12-18T16:00:00',
    assignedBy: {
      name: 'Dilnoza Rahimova',
      avatar: '/api/placeholder/32/32'
    }
  },
  {
    id: '5',
    title: 'UI/UX ko\'rib chiqish',
    description: 'Yangi dizayn elementlarini tekshirish va tasdiq qilish',
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-12-22T14:00:00',
    assignedBy: {
      name: 'Nozima Karimova',
      avatar: '/api/placeholder/32/32'
    }
  }
];

type FilterType = 'all' | 'today' | 'overdue' | 'completed';

export function MobileTasksScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [comment, setComment] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground">Tugallangan</Badge>;
      case 'in_progress':
        return <Badge className="bg-primary text-primary-foreground">Jarayonda</Badge>;
      case 'overdue':
        return <Badge className="bg-danger text-danger-foreground">Kechikkan</Badge>;
      case 'todo':
        return <Badge variant="secondary">Rejalashtirilgan</Badge>;
      default:
        return <Badge variant="secondary">Noma'lum</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    const color = priority === 'high' ? 'text-danger' : 
                 priority === 'medium' ? 'text-warning' : 'text-muted-foreground';
    return <Flag className={`h-4 w-4 ${color}`} />;
  };

  const filterTasks = (tasks: Task[], filter: FilterType): Task[] => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    switch (filter) {
      case 'today':
        return tasks.filter(task => new Date(task.dueDate) <= today && task.status !== 'completed');
      case 'overdue':
        return tasks.filter(task => task.status === 'overdue');
      case 'completed':
        return tasks.filter(task => task.status === 'completed');
      default:
        return tasks;
    }
  };

  const getFilterCount = (filter: FilterType): number => {
    return filterTasks(mockTasks, filter).length;
  };

  const handleTaskComplete = (taskId: string) => {
    toast.success('Vazifa tugallandi deb belgilandi');
    setIsTaskDetailOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadFiles(prev => [...prev, ...files]);
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      toast.success('Izoh qo\'shildi');
      setComment('');
    }
  };

  const filteredTasks = filterTasks(mockTasks, activeFilter);

  return (
    <div className="p-4 space-y-4">
      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-4">
          <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as FilterType)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="text-xs">
                Barchasi
                <Badge variant="secondary" className="ml-1 text-xs">
                  {getFilterCount('all')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="today" className="text-xs">
                Bugun
                <Badge variant="secondary" className="ml-1 text-xs">
                  {getFilterCount('today')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="overdue" className="text-xs">
                Kechikkan
                <Badge className="ml-1 text-xs bg-danger text-danger-foreground">
                  {getFilterCount('overdue')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs">
                Tugallangan
                <Badge className="ml-1 text-xs bg-success text-success-foreground">
                  {getFilterCount('completed')}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <Card 
            key={task.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setSelectedTask(task);
              setIsTaskDetailOpen(true);
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getPriorityIcon(task.priority)}
                    <h4 className="font-medium line-clamp-1">{task.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {task.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.assignedBy.avatar} alt={task.assignedBy.name} />
                    <AvatarFallback className="text-xs">
                      {task.assignedBy.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {task.assignedBy.name}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {format(new Date(task.dueDate), 'dd.MM', { locale: uz })}
                    </span>
                  </div>
                  {getStatusBadge(task.status)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-lg font-medium mb-2">Vazifalar topilmadi</div>
              <div className="text-sm text-muted-foreground">
                {activeFilter === 'completed' && 'Hali tugallangan vazifalar yo\'q'}
                {activeFilter === 'overdue' && 'Kechikkan vazifalar yo\'q'}
                {activeFilter === 'today' && 'Bugun uchun vazifalar yo\'q'}
                {activeFilter === 'all' && 'Hech qanday vazifa topilmadi'}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Task Detail Modal */}
      <Dialog open={isTaskDetailOpen} onOpenChange={setIsTaskDetailOpen}>
        <DialogContent className="max-w-lg">
          {selectedTask && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DialogTitle className="text-left">{selectedTask.title}</DialogTitle>
                    <DialogDescription className="text-left mt-2">
                      {selectedTask.description}
                    </DialogDescription>
                  </div>
                  {getPriorityIcon(selectedTask.priority)}
                </div>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Task Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Holat</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedTask.status)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Muddat</Label>
                    <div className="mt-1 text-sm">
                      {format(new Date(selectedTask.dueDate), 'dd MMMM, HH:mm', { locale: uz })}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Tayinlovchi</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedTask.assignedBy.avatar} alt={selectedTask.assignedBy.name} />
                      <AvatarFallback className="text-xs">
                        {selectedTask.assignedBy.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{selectedTask.assignedBy.name}</span>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <Label className="text-sm">Fayllar qo'shish</Label>
                  <div className="mt-2 space-y-2">
                    {uploadFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm truncate">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUploadFiles(files => files.filter((_, i) => i !== index))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="flex space-x-2">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileUpload}
                        multiple
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Fayl yuklash
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                {selectedTask.comments && selectedTask.comments.length > 0 && (
                  <div>
                    <Label className="text-sm">Izohlar</Label>
                    <div className="mt-2 space-y-2">
                      {selectedTask.comments.map((comment) => (
                        <div key={comment.id} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(comment.timestamp), 'dd.MM HH:mm')}
                            </span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Comment */}
                <div>
                  <Label htmlFor="comment" className="text-sm">Izoh qo'shish</Label>
                  <div className="mt-2 space-y-2">
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Izohingizni yozing..."
                      rows={3}
                    />
                    <Button onClick={handleCommentSubmit} size="sm" disabled={!comment.trim()}>
                      Izoh qo'shish
                    </Button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedTask.status !== 'completed' && (
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleTaskComplete(selectedTask.id)}
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Tugallandi deb belgilash
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}