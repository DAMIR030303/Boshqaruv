import { useState } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { ButtonEnhanced } from '../enhanced/ButtonEnhanced';
import { SelectEnhanced, DatePicker } from '../enhanced/FormComponents';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { 
  X,
  Edit,
  Calendar,
  Clock,
  Flag,
  Paperclip,
  MessageCircle,
  Send,
  Download,
  Eye,
  Trash2,
  CheckCircle2,
  User,
  Tag,
  Activity
} from 'lucide-react';

// Mock task details
const mockTaskDetails = {
  '1': {
    id: '1',
    title: 'Yangi dashboard dizayni yaratish',
    description: 'Boshqaruv tizimi uchun yangi dashboard interfeysi yaratish va foydalanuvchi tajribasini yaxshilash. Bu vazifa bir necha bosqichdan iborat bo\'ladi: 1) Foydalanuvchi ehtiyojlarini o\'rganish 2) Wireframe yaratish 3) Vizual dizayn 4) Prototip yaratish',
    status: 'new',
    priority: 'high',
    assignees: [
      { id: '1', name: 'Alisher Fayzullayev', avatar: 'AF', role: 'Senior Developer' },
      { id: '2', name: 'Sevara Abdullayeva', avatar: 'SA', role: 'UI/UX Designer' }
    ],
    reporter: { id: '3', name: 'Nozima Karimova', avatar: 'NK', role: 'Project Manager' },
    dueDate: '2024-01-20',
    createdDate: '2024-01-15',
    updatedDate: '2024-01-16',
    tags: ['Dizayn', 'UI/UX', 'Dashboard'],
    attachments: [
      { id: '1', name: 'dashboard-wireframe.fig', size: '2.4 MB', type: 'figma' },
      { id: '2', name: 'user-research.pdf', size: '1.8 MB', type: 'pdf' },
      { id: '3', name: 'design-guidelines.docx', size: '856 KB', type: 'doc' }
    ],
    comments: [
      {
        id: '1',
        author: { name: 'Nozima Karimova', avatar: 'NK' },
        content: 'Dashboard dizayni uchun foydalanuvchi ehtiyojlarini o\'rganib, wireframe yaratishdan boshlash kerak.',
        createdAt: '2024-01-15T10:30:00Z',
        isEdited: false
      },
      {
        id: '2',
        author: { name: 'Sevara Abdullayeva', avatar: 'SA' },
        content: 'Men wireframe ustida ishlayapman. Bir necha variantni tayyorlab, muhokama qilishimiz mumkin.',
        createdAt: '2024-01-16T14:20:00Z',
        isEdited: false
      }
    ],
    activity: [
      {
        id: '1',
        type: 'created',
        author: { name: 'Nozima Karimova', avatar: 'NK' },
        createdAt: '2024-01-15T09:00:00Z',
        description: 'Vazifani yaratdi'
      },
      {
        id: '2',
        type: 'assigned',
        author: { name: 'Nozima Karimova', avatar: 'NK' },
        createdAt: '2024-01-15T09:05:00Z',
        description: 'Alisher Fayzullayev va Sevara Abdullayevani tayinladi'
      },
      {
        id: '3',
        type: 'attachment',
        author: { name: 'Sevara Abdullayeva', avatar: 'SA' },
        createdAt: '2024-01-16T11:30:00Z',
        description: 'dashboard-wireframe.fig faylini qo\'shdi'
      }
    ]
  }
};

interface TaskDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null;
  onMarkComplete: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: any) => void;
}

export function TaskDetailsPanel({ isOpen, onClose, taskId, onMarkComplete, onUpdateTask }: TaskDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'activity'>('details');
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const task = taskId ? mockTaskDetails[taskId as keyof typeof mockTaskDetails] : null;

  if (!task) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full tablet:w-[500px] desktop:w-[600px]">
          <SheetHeader>
            <SheetTitle>Vazifa ma'lumotlari</SheetTitle>
            <SheetDescription>
              Vazifa ma'lumotlari topilmadi
            </SheetDescription>
          </SheetHeader>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Vazifa ma'lumotlari topilmadi</p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmittingComment(true);
    try {
      // In a real app, submit comment via API
      console.log('Adding comment:', newComment);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Hozir';
    if (diffHours < 24) return `${diffHours} soat oldin`;
    return Math.floor(diffHours / 24) + ' kun oldin';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-danger';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Tezkor';
      case 'high': return 'Yuqori';
      case 'medium': return 'O\'rta';
      case 'low': return 'Past';
      default: return priority;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Yangi';
      case 'in-progress': return 'Jarayonda';
      case 'review': return 'Ko\'rib chiqish';
      case 'done': return 'Tugagan';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-primary text-primary-foreground';
      case 'in-progress': return 'bg-warning text-warning-foreground';
      case 'review': return 'bg-purple-600 text-white';
      case 'done': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'doc': return '📝';
      case 'figma': return '🎨';
      default: return '📎';
    }
  };

  const statusOptions = [
    { value: 'new', label: 'Yangi' },
    { value: 'in-progress', label: 'Jarayonda' },
    { value: 'review', label: 'Ko\'rib chiqish' },
    { value: 'done', label: 'Tugagan' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Past' },
    { value: 'medium', label: 'O\'rta' },
    { value: 'high', label: 'Yuqori' },
    { value: 'urgent', label: 'Tezkor' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full tablet:w-[500px] desktop:w-[700px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg leading-tight pr-8">
                {task.title}
              </SheetTitle>
              <SheetDescription>
                Vazifa #{task.id} - Yaratilgan: {formatDate(task.createdDate)}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Quick Actions */}
        <div className="flex gap-2 py-4 border-b">
          {task.status !== 'done' && (
            <ButtonEnhanced
              variant="primary"
              size="sm"
              iconLeft={<CheckCircle2 className="h-4 w-4" />}
              onClick={() => onMarkComplete(task.id)}
            >
              Bajarildi deb belgilash
            </ButtonEnhanced>
          )}
          <ButtonEnhanced
            variant="outline"
            size="sm"
            iconLeft={<Edit className="h-4 w-4" />}
          >
            Tahrirlash
          </ButtonEnhanced>
        </div>

        {/* Tabs */}
        <div className="space-y-6 py-6">
          <div className="flex gap-4 border-b">
            <Button
              variant={activeTab === 'details' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('details')}
            >
              Ma'lumotlar
            </Button>
            <Button
              variant={activeTab === 'comments' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('comments')}
              className="relative"
            >
              Izohlar
              {task.comments.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {task.comments.length}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeTab === 'activity' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('activity')}
            >
              Faollik
            </Button>
          </div>

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Holat</label>
                  <SelectEnhanced
                    options={statusOptions}
                    value={task.status}
                    onValueChange={(value) => onUpdateTask(task.id, { status: value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Muhimlik</label>
                  <SelectEnhanced
                    options={priorityOptions}
                    value={task.priority}
                    onValueChange={(value) => onUpdateTask(task.id, { priority: value })}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-medium mb-2">Ta'rif</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Assignees */}
              <div>
                <h4 className="font-medium mb-3">Javobgar xodimlar</h4>
                <div className="space-y-2">
                  {task.assignees.map((assignee) => (
                    <div key={assignee.id} className="flex items-center gap-3 p-2 border rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{assignee.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{assignee.name}</p>
                        <p className="text-xs text-muted-foreground">{assignee.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <h4 className="font-medium mb-2">Tugash sanasi</h4>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(task.dueDate)}</span>
                  {new Date(task.dueDate) < new Date() && task.status !== 'done' && (
                    <Badge variant="destructive" className="text-xs">
                      Kechikgan
                    </Badge>
                  )}
                </div>
              </div>

              {/* Tags */}
              {task.tags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Teglar</h4>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {task.attachments.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Qo'shimcha fayllar</h4>
                  <div className="space-y-2">
                    {task.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50">
                        <div className="text-2xl">{getFileIcon(attachment.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">{attachment.size}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reporter */}
              <div>
                <h4 className="font-medium mb-2">Muallif</h4>
                <div className="flex items-center gap-3 p-2 border rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{task.reporter.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{task.reporter.name}</p>
                    <p className="text-xs text-muted-foreground">{task.reporter.role}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              {/* Add Comment */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Izoh yozing..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-20"
                />
                <div className="flex justify-end">
                  <ButtonEnhanced
                    variant="primary"
                    size="sm"
                    iconLeft={<Send className="h-4 w-4" />}
                    onClick={handleSubmitComment}
                    loading={isSubmittingComment}
                    disabled={!newComment.trim()}
                  >
                    Yuborish
                  </ButtonEnhanced>
                </div>
              </div>

              <Separator />

              {/* Comments List */}
              <div className="space-y-4">
                {task.comments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Hali izohlar yo'q</p>
                    <p className="text-sm text-muted-foreground">Birinchi izohni qoldiring</p>
                  </div>
                ) : (
                  task.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{comment.author.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{comment.author.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                          {comment.isEdited && (
                            <Badge variant="outline" className="text-xs">Tahrirlangan</Badge>
                          )}
                        </div>
                        <div className="text-sm bg-muted p-3 rounded-lg">
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              {task.activity.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{activity.author.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{activity.author.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {activity.description}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatRelativeTime(activity.createdAt)}
                    </div>
                  </div>
                  <Activity className="h-4 w-4 text-muted-foreground mt-1" />
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}