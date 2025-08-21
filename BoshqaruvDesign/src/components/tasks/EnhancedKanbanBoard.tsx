import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  Calendar,
  User,
  Flag,
  MoreVertical,
  Plus,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface Task {
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

interface Column {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  color: string;
  tasks: Task[];
}

interface EnhancedKanbanBoardProps {
  onTaskClick?: (task: Task) => void;
  onCreateTask?: () => void;
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'Rejalashtirilgan',
    status: 'todo',
    color: 'bg-neutral-100',
    tasks: [
      {
        id: '1',
        title: 'Login sahifasi dizayni',
        description: 'Yangi login sahifasi uchun UI/UX dizayn yaratish',
        status: 'todo',
        priority: 'high',
        assignee: {
          id: 'user1',
          name: 'Nozima Karimova',
          avatar: '/api/placeholder/32/32'
        },
        dueDate: '2024-12-25',
        progress: 0,
        tags: ['design', 'ui/ux']
      },
      {
        id: '2',
        title: 'Database migration',
        description: 'Ma\'lumotlar bazasi strukturasini yangilash',
        status: 'todo',
        priority: 'medium',
        assignee: {
          id: 'user2',
          name: 'Jamshid Tursunov',
          avatar: '/api/placeholder/32/32'
        },
        dueDate: '2024-12-28',
        progress: 0,
        tags: ['backend', 'database']
      }
    ]
  },
  {
    id: 'in_progress',
    title: 'Jarayonda',
    status: 'in_progress',
    color: 'bg-primary/10',
    tasks: [
      {
        id: '3',
        title: 'API integratsiyasi',
        description: 'Frontend va backend o\'rtasidagi API integratsiyasi',
        status: 'in_progress',
        priority: 'high',
        assignee: {
          id: 'user3',
          name: 'Alisher Fayzullayev',
          avatar: '/api/placeholder/32/32'
        },
        dueDate: '2024-12-24',
        progress: 65,
        tags: ['frontend', 'api']
      }
    ]
  },
  {
    id: 'review',
    title: 'Ko\'rib chiqilmoqda',
    status: 'review',
    color: 'bg-warning/10',
    tasks: [
      {
        id: '4',
        title: 'Unit testlar',
        description: 'Barcha komponentlar uchun unit testlar yozish',
        status: 'review',
        priority: 'low',
        assignee: {
          id: 'user1',
          name: 'Nozima Karimova',
          avatar: '/api/placeholder/32/32'
        },
        dueDate: '2024-12-26',
        progress: 90,
        tags: ['testing', 'quality']
      }
    ]
  },
  {
    id: 'completed',
    title: 'Tugallangan',
    status: 'completed',
    color: 'bg-success/10',
    tasks: [
      {
        id: '5',
        title: 'Dashboard optimizatsiyasi',
        description: 'Dashboard sahifasining yuklanish tezligini oshirish',
        status: 'completed',
        priority: 'medium',
        assignee: {
          id: 'user3',
          name: 'Alisher Fayzullayev',
          avatar: '/api/placeholder/32/32'
        },
        dueDate: '2024-12-20',
        progress: 100,
        tags: ['performance', 'optimization']
      }
    ]
  }
];

export function EnhancedKanbanBoard({ onTaskClick, onCreateTask }: EnhancedKanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

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

  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', ''); // For Firefox
    
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedTask(null);
    setDraggedOverColumn(null);
    
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOverColumn(columnId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDraggedOverColumn(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    setDraggedOverColumn(null);

    if (!draggedTask) return;

    const sourceColumnId = draggedTask.status;
    if (sourceColumnId === targetColumnId) return;

    // Update task status and move between columns
    const updatedTask = {
      ...draggedTask,
      status: targetColumnId as 'todo' | 'in_progress' | 'review' | 'completed'
    };

    setColumns(prev => {
      const newColumns = prev.map(column => {
        if (column.id === sourceColumnId) {
          // Remove task from source column
          return {
            ...column,
            tasks: column.tasks.filter(task => task.id !== draggedTask.id)
          };
        } else if (column.id === targetColumnId) {
          // Add task to target column
          return {
            ...column,
            tasks: [...column.tasks, updatedTask]
          };
        }
        return column;
      });
      
      return newColumns;
    });

    // Show success toast with animation
    toast.success(`Vazifa "${draggedTask.title}" ${getColumnTitle(targetColumnId)} ga ko'chirildi`, {
      duration: 3000,
    });

    setDraggedTask(null);
  }, [draggedTask]);

  const getColumnTitle = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    return column ? column.title : columnId;
  };

  const handleTaskClick = useCallback((task: Task) => {
    onTaskClick?.(task);
  }, [onTaskClick]);

  return (
    <div className="space-y-6">
      {/* Kanban Board Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Vazifalar taxtasi</h3>
          <p className="text-sm text-muted-foreground">
            Vazifalarni drag & drop yordamida boshqaring
          </p>
        </div>
        <Button onClick={onCreateTask} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Yangi vazifa
        </Button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`${column.color} rounded-lg p-4 min-h-96 transition-all duration-200 ${
              draggedOverColumn === column.id ? 'ring-2 ring-primary ring-opacity-50 scale-105' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium">{column.title}</h4>
                <Badge variant="secondary" className="text-xs">
                  {column.tasks.length}
                </Badge>
              </div>
            </div>

            {/* Tasks */}
            <AnimatePresence>
              <div className="space-y-3">
                {column.tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    whileDrag={{ scale: 1.05, rotate: 2 }}
                  >
                    <Card
                      className="cursor-move hover:shadow-md transition-all duration-200 bg-background"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleTaskClick(task)}
                    >
                      <CardContent className="p-4">
                        {/* Task Header */}
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-sm line-clamp-2 flex-1">
                            {task.title}
                          </h5>
                          <Button variant="ghost" size="sm" className="p-1 h-6 w-6 ml-2">
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
                            <Progress value={task.progress} className="h-2" />
                          </div>
                        )}

                        {/* Tags */}
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {task.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">
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
                              <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                              <AvatarFallback className="text-xs">
                                {task.assignee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {new Date(task.dueDate).toLocaleDateString('uz-UZ')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            <Flag className={`h-3 w-3 ${getPriorityColor(task.priority)}`} />
                            <span className={`text-xs ${getPriorityColor(task.priority)}`}>
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
                      <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {columns.map((column) => {
              const percentage = columns.length > 0 
                ? Math.round((column.tasks.length / columns.reduce((sum, col) => sum + col.tasks.length, 0)) * 100) 
                : 0;
              
              return (
                <div key={column.id} className="space-y-1">
                  <div className="text-lg font-semibold">{column.tasks.length}</div>
                  <div className="text-sm text-muted-foreground">{column.title}</div>
                  <div className="text-xs text-primary">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}