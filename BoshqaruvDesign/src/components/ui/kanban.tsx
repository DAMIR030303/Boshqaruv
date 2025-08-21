import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button-enhanced';
import { Badge } from './badge';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Progress } from './progress';
import { cn } from './utils';
import { useKeyboardNavigation, useFocusTrap, UzbekScreenReaderText } from './accessibility';
import { 
  Calendar,
  User,
  Flag,
  MoreVertical,
  Plus,
  Eye,
  GripVertical
} from 'lucide-react';
import { toast } from 'sonner';

// Boshqaruv/Components/Kanban
// Developer-ready Kanban board with full accessibility support

interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: {
    id: string;
    name: string;
    avatar: string;
  };
  dueDate: string;
  progress: number;
  tags: string[];
}

interface KanbanColumn {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  color: string;
  tasks: KanbanTask[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onTaskMove?: (taskId: string, fromColumn: string, toColumn: string) => void;
  onTaskClick?: (task: KanbanTask) => void;
  onCreateTask?: () => void;
  className?: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns: initialColumns,
  onTaskMove,
  onTaskClick,
  onCreateTask,
  className
}) => {
  const [columns, setColumns] = React.useState<KanbanColumn[]>(initialColumns);
  const [draggedTask, setDraggedTask] = React.useState<KanbanTask | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = React.useState<string | null>(null);
  const [focusedTaskId, setFocusedTaskId] = React.useState<string | null>(null);
  const [screenReaderMessage, setScreenReaderMessage] = React.useState('');

  const boardRef = React.useRef<HTMLDivElement>(null);
  const columnsRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const tasksRef = React.useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Update columns when props change
  React.useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  // Keyboard navigation for columns
  const { handleKeyDown: handleColumnNavigation } = useKeyboardNavigation(
    columnsRef.current.filter(Boolean) as HTMLElement[],
    { orientation: 'horizontal' }
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-danger border-danger';
      case 'medium':
        return 'text-warning border-warning';
      case 'low':
        return 'text-success border-success';
      default:
        return 'text-muted-foreground border-muted-foreground';
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
        return priority;
    }
  };

  const announceToScreenReader = (message: string) => {
    setScreenReaderMessage(message);
    setTimeout(() => setScreenReaderMessage(''), 1000);
  };

  const handleDragStart = React.useCallback((e: React.DragEvent, task: KanbanTask) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
    
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
    
    announceToScreenReader(`Vazifa "${task.title}" ko'chirilmoqda`);
  }, []);

  const handleDragEnd = React.useCallback((e: React.DragEvent) => {
    setDraggedTask(null);
    setDraggedOverColumn(null);
    
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  }, []);

  const handleDragOver = React.useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOverColumn(columnId);
  }, []);

  const handleDragLeave = React.useCallback(() => {
    setDraggedOverColumn(null);
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    setDraggedOverColumn(null);

    if (!draggedTask) return;

    const sourceColumnId = draggedTask.status;
    if (sourceColumnId === targetColumnId) return;

    const updatedTask = { ...draggedTask, status: targetColumnId as KanbanTask['status'] };

    setColumns(prev => {
      const newColumns = prev.map(column => {
        if (column.id === sourceColumnId) {
          return {
            ...column,
            tasks: column.tasks.filter(task => task.id !== draggedTask.id)
          };
        } else if (column.id === targetColumnId) {
          return {
            ...column,
            tasks: [...column.tasks, updatedTask]
          };
        }
        return column;
      });
      return newColumns;
    });

    const targetColumn = columns.find(col => col.id === targetColumnId);
    const message = `Vazifa "${draggedTask.title}" ${targetColumn?.title} ga ko'chirildi`;
    
    announceToScreenReader(message);
    toast.success(message, { duration: 3000 });
    onTaskMove?.(draggedTask.id, sourceColumnId, targetColumnId);

    setDraggedTask(null);
  }, [draggedTask, columns, onTaskMove]);

  const handleTaskKeyDown = (e: React.KeyboardEvent, task: KanbanTask) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTaskClick?.(task);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      // Move task between columns with keyboard
      const currentColumnIndex = columns.findIndex(col => 
        col.tasks.some(t => t.id === task.id)
      );
      
      let newColumnIndex;
      if (e.key === 'ArrowRight') {
        newColumnIndex = Math.min(currentColumnIndex + 1, columns.length - 1);
      } else {
        newColumnIndex = Math.max(currentColumnIndex - 1, 0);
      }

      if (newColumnIndex !== currentColumnIndex) {
        const targetColumn = columns[newColumnIndex];
        handleDrop(
          { preventDefault: () => {}, dataTransfer: { dropEffect: 'move' } } as any,
          targetColumn.id
        );
      }
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Screen Reader Live Region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {screenReaderMessage}
      </div>

      {/* Board Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Vazifalar taxtasi</h2>
          <p className="text-sm text-muted-foreground">
            Vazifalarni drag & drop yoki klaviatura yordamida boshqaring
          </p>
        </div>
        {onCreateTask && (
          <Button 
            onClick={onCreateTask} 
            size="sm"
            aria-label="Yangi vazifa yaratish"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yangi vazifa
          </Button>
        )}
      </div>

      {/* Kanban Board */}
      <div 
        ref={boardRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        role="application"
        aria-label="Kanban vazifalar taxtasi"
        onKeyDown={(e) => handleColumnNavigation(e as unknown as KeyboardEvent)}
      >
        {columns.map((column, columnIndex) => (
          <div
            key={column.id}
            ref={el => columnsRef.current[columnIndex] = el}
            className={cn(
              column.color,
              'rounded-lg p-4 min-h-96 transition-all duration-200',
              draggedOverColumn === column.id && 'ring-2 ring-primary ring-opacity-50 scale-105'
            )}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            role="region"
            aria-label={`${column.title} ustuni, ${column.tasks.length} ta vazifa`}
            tabIndex={0}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">{column.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {column.tasks.length}
                </Badge>
              </div>
            </div>

            {/* Tasks */}
            <AnimatePresence>
              <div className="space-y-3" role="list" aria-label={`${column.title} vazifalari`}>
                {column.tasks.map((task, taskIndex) => (
                  <motion.div
                    key={task.id}
                    ref={el => tasksRef.current[task.id] = el}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: taskIndex * 0.05 }}
                    whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    whileDrag={{ scale: 1.05, rotate: 2 }}
                    role="listitem"
                  >
                    <Card
                      className={cn(
                        'cursor-move hover:shadow-md transition-all duration-200 bg-background',
                        focusedTaskId === task.id && 'ring-2 ring-primary'
                      )}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onTaskClick?.(task)}
                      onKeyDown={(e) => handleTaskKeyDown(e, task)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Vazifa: ${task.title}. ${getPriorityText(task.priority)} muhimlik. ${task.assignee.name} mas'ul. Bosish uchun Enter tugmasini bosing.`}
                      onFocus={() => setFocusedTaskId(task.id)}
                      onBlur={() => setFocusedTaskId(null)}
                    >
                      <CardContent className="p-4">
                        {/* Task Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start space-x-2 flex-1">
                            <GripVertical 
                              className="h-4 w-4 text-muted-foreground mt-0.5" 
                              aria-hidden="true"
                            />
                            <h4 className="font-medium text-sm line-clamp-2 flex-1">
                              {task.title}
                            </h4>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon-sm"
                            className="ml-2"
                            aria-label={`${task.title} uchun qo'shimcha amallar`}
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Task Description */}
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {task.description}
                        </p>

                        {/* Progress Bar */}
                        {task.progress > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">Jarayon</span>
                              <span className="text-xs font-medium">{task.progress}%</span>
                            </div>
                            <Progress 
                              value={task.progress} 
                              className="h-2"
                              aria-label={`Vazifa jarayoni: ${task.progress} foiz`}
                            />
                          </div>
                        )}

                        {/* Tags */}
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3" role="list" aria-label="Vazifa teglari">
                            {task.tags.slice(0, 2).map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className="text-xs px-2 py-0.5"
                                role="listitem"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {task.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs px-2 py-0.5">
                                +{task.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Task Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage 
                                src={task.assignee.avatar} 
                                alt={`${task.assignee.name} profil rasmi`}
                              />
                              <AvatarFallback className="text-xs">
                                {task.assignee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                              <time 
                                className="text-xs text-muted-foreground"
                                dateTime={task.dueDate}
                              >
                                {new Date(task.dueDate).toLocaleDateString('uz-UZ')}
                              </time>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            <Flag 
                              className={`h-3 w-3 ${getPriorityColor(task.priority)}`}
                              aria-hidden="true"
                            />
                            <span 
                              className={`text-xs ${getPriorityColor(task.priority)}`}
                              aria-label={`Muhimlik darajasi: ${getPriorityText(task.priority)}`}
                            >
                              {getPriorityText(task.priority)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* Empty State */}
                {column.tasks.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="text-muted-foreground">
                      <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
                      <p className="text-sm">Vazifalar yo'q</p>
                    </div>
                  </motion.div>
                )}

                {/* Drop Zone Indicator */}
                {draggedOverColumn === column.id && draggedTask && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border-2 border-dashed border-primary bg-primary/5 rounded-lg p-4 text-center"
                    role="alert"
                    aria-live="assertive"
                  >
                    <p className="text-sm text-primary">
                      "{draggedTask.title}" ni bu yerga tashlang
                    </p>
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Board Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Statistika</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
            role="region"
            aria-label="Kanban board statistikasi"
          >
            {columns.map((column) => {
              const totalTasks = columns.reduce((sum, col) => sum + col.tasks.length, 0);
              const percentage = totalTasks > 0 
                ? Math.round((column.tasks.length / totalTasks) * 100) 
                : 0;
              
              return (
                <div key={column.id} className="space-y-1">
                  <div className="text-lg font-semibold" aria-label={`${column.tasks.length} ta vazifa`}>
                    {column.tasks.length}
                  </div>
                  <div className="text-sm text-muted-foreground">{column.title}</div>
                  <div className="text-xs text-primary" aria-label={`${percentage} foiz`}>
                    {percentage}%
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Instructions for Screen Readers */}
      <div className="sr-only">
        <p>
          Kanban taxtasida vazifalarni boshqarish uchun quyidagi ko'rsatmalardan foydalaning:
        </p>
        <ul>
          <li>Vazifani tanlash uchun Tab tugmasi va Enter tugmasini ishlating</li>
          <li>Vazifani boshqa ustunga ko'chirish uchun chap yoki o'ng strelka tugmalarini ishlating</li>
          <li>Vazifani sichqoncha bilan sudrab harakatlantirish ham mumkin</li>
          <li>Qo'shimcha ma'lumot olish uchun vazifaga bosing</li>
        </ul>
      </div>
    </div>
  );
};

export type { KanbanTask, KanbanColumn, KanbanBoardProps };