import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { 
  Calendar, 
  MessageCircle, 
  Paperclip, 
  User, 
  Clock,
  AlertTriangle,
  CheckCircle2,
  Flag
} from 'lucide-react';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    status: 'new' | 'in-progress' | 'review' | 'done';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignees: Array<{
      id: string;
      name: string;
      avatar: string;
    }>;
    dueDate?: string;
    attachments?: number;
    comments?: number;
    tags?: string[];
    createdDate: string;
    completedDate?: string;
  };
  onClick: () => void;
  isDragging?: boolean;
}

export function TaskCard({ task, onClick, isDragging = false }: TaskCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Bugun';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Ertaga';
    } else {      
      return date.toLocaleDateString('uz-UZ', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'done') return false;
    return new Date(task.dueDate) < new Date();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-danger';
      case 'high':
        return 'text-warning';
      case 'medium':
        return 'text-primary';
      case 'low':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Tezkor';
      case 'high':
        return 'Yuqori';
      case 'medium':
        return 'O\'rta';
      case 'low':
        return 'Past';
      default:
        return priority;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="h-3 w-3" />;
      case 'high':
        return <Flag className="h-3 w-3" />;
      case 'medium':
        return <Clock className="h-3 w-3" />;
      case 'low':
        return <Clock className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'border-l-primary';
      case 'in-progress':
        return 'border-l-warning';
      case 'review':
        return 'border-l-purple-500';
      case 'done':
        return 'border-l-success';
      default:
        return 'border-l-muted';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${getStatusColor(task.status)} ${
        isDragging ? 'opacity-50 rotate-3 scale-105' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header with Priority */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm leading-tight line-clamp-2">
            {task.title}
          </h4>
          <div className={`flex items-center gap-1 text-xs ${getPriorityColor(task.priority)}`}>
            {getPriorityIcon(task.priority)}
            <span className="font-medium">{getPriorityLabel(task.priority)}</span>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 2 && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                +{task.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div className={`flex items-center gap-1 text-xs ${
            isOverdue() ? 'text-danger' : 'text-muted-foreground'
          }`}>
            <Calendar className="h-3 w-3" />
            <span>{formatDate(task.dueDate)}</span>
            {isOverdue() && (
              <Badge variant="destructive" className="text-xs px-1 py-0">
                Kechikgan
              </Badge>
            )}
          </div>
        )}

        {/* Assignees */}
        {task.assignees.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {task.assignees.slice(0, 3).map((assignee) => (
                <Avatar key={assignee.id} className="h-6 w-6 border-2 border-background">
                  <AvatarFallback className="text-xs">
                    {assignee.avatar}
                  </AvatarFallback>
                </Avatar>
              ))}
              {task.assignees.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                  +{task.assignees.length - 3}
                </div>
              )}
            </div>
            {task.assignees.length === 1 && (
              <span className="text-xs text-muted-foreground">
                {task.assignees[0].name}
              </span>
            )}
          </div>
        )}

        {/* Status indicator for completed tasks */}
        {task.status === 'done' && task.completedDate && (
          <div className="flex items-center gap-1 text-xs text-success">
            <CheckCircle2 className="h-3 w-3" />
            <span>Tugallangan: {formatDate(task.completedDate)}</span>
          </div>
        )}

        {/* Footer with attachments and comments */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {task.attachments && task.attachments > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                <span>{task.attachments}</span>
              </div>
            )}
            {task.comments && task.comments > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{task.comments}</span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            {formatDate(task.createdDate)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}