import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TaskCard } from './TaskCard';
import { ButtonEnhanced } from '../enhanced/ButtonEnhanced';
import { 
  Plus, 
  Circle, 
  Clock, 
  Eye, 
  CheckCircle2,
  Filter,
  Search
} from 'lucide-react';

// Mock tasks data
const mockTasks = [
  {
    id: '1',
    title: 'Yangi dashboard dizayni yaratish',
    description: 'Boshqaruv tizimi uchun yangi dashboard interfeysi yaratish va foydalanuvchi tajribasini yaxshilash',
    status: 'new' as const,
    priority: 'high' as const,
    assignees: [
      { id: '1', name: 'Alisher Fayzullayev', avatar: 'AF' },
      { id: '2', name: 'Sevara Abdullayeva', avatar: 'SA' }
    ],
    dueDate: '2024-01-20',
    attachments: 3,
    comments: 2,
    tags: ['Dizayn', 'UI/UX'],
    createdDate: '2024-01-15'
  },
  {
    id: '2',
    title: 'Ma\'lumotlar bazasi optimizatsiya',
    description: 'Tizim ishlashini tezlashtirish uchun ma\'lumotlar bazasi so\'rovlarini optimallashtirish',
    status: 'new' as const,
    priority: 'medium' as const,
    assignees: [
      { id: '3', name: 'Jamshid Tursunov', avatar: 'JT' }
    ],
    dueDate: '2024-01-25',
    attachments: 1,
    comments: 0,
    tags: ['Backend', 'Optimallashtirish'],
    createdDate: '2024-01-14'
  },
  {
    id: '3',
    title: 'Mobil ilovani yangilash',
    description: 'Mobil ilova uchun yangi funksiyalarni qo\'shish va xatoliklarni tuzatish',
    status: 'in-progress' as const,
    priority: 'urgent' as const,
    assignees: [
      { id: '1', name: 'Alisher Fayzullayev', avatar: 'AF' },
      { id: '4', name: 'Bobur Kholmatov', avatar: 'BK' }
    ],
    dueDate: '2024-01-18',
    attachments: 5,
    comments: 8,
    tags: ['Mobile', 'Flutter'],
    createdDate: '2024-01-10'
  },
  {
    id: '4',
    title: 'API dokumentatsiyasini yaratish',
    description: 'Tizim API lari uchun to\'liq dokumentatsiya yozish',
    status: 'in-progress' as const,
    priority: 'medium' as const,
    assignees: [
      { id: '5', name: 'Nozima Karimova', avatar: 'NK' }
    ],
    dueDate: '2024-01-22',
    attachments: 2,
    comments: 3,
    tags: ['Dokumentatsiya', 'API'],
    createdDate: '2024-01-12'
  },
  {
    id: '5',
    title: 'Xavfsizlik testlari',
    description: 'Tizim xavfsizligini tekshirish va zaifliklarni aniqlash',
    status: 'review' as const,
    priority: 'high' as const,
    assignees: [
      { id: '6', name: 'Dilnoza Rahimova', avatar: 'DR' }
    ],
    dueDate: '2024-01-19',
    attachments: 4,
    comments: 1,
    tags: ['Xavfsizlik', 'Testing'],
    createdDate: '2024-01-08'
  },
  {
    id: '6',
    title: 'Foydalanuvchi qo\'llanmasi',
    description: 'Tizim foydalanuvchilari uchun to\'liq qo\'llanma tayyorlash',
    status: 'review' as const,
    priority: 'low' as const,
    assignees: [
      { id: '2', name: 'Sevara Abdullayeva', avatar: 'SA' },
      { id: '5', name: 'Nozima Karimova', avatar: 'NK' }
    ],
    dueDate: '2024-01-30',
    attachments: 1,
    comments: 0,
    tags: ['Dokumentatsiya'],
    createdDate: '2024-01-05'
  },
  {
    id: '7',
    title: 'Email xabarnoma tizimi',
    description: 'Foydalanuvchilarga avtomatik email xabarnomalar yuborish tizimini yaratish',
    status: 'done' as const,
    priority: 'medium' as const,
    assignees: [
      { id: '3', name: 'Jamshid Tursunov', avatar: 'JT' }
    ],
    dueDate: '2024-01-15',
    attachments: 2,
    comments: 5,
    tags: ['Backend', 'Email'],
    createdDate: '2024-01-01',
    completedDate: '2024-01-14'
  }
];

interface KanbanBoardProps {
  onTaskClick: (taskId: string) => void;
  onCreateTask: (status: string) => void;
}

const columns = [
  {
    id: 'new',
    title: 'Yangi',
    icon: <Circle className="h-4 w-4" />,
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  {
    id: 'in-progress',
    title: 'Jarayonda',
    icon: <Clock className="h-4 w-4" />,
    color: 'text-warning',
    bgColor: 'bg-warning/10'
  },
  {
    id: 'review',
    title: 'Ko\'rib chiqish',
    icon: <Eye className="h-4 w-4" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    id: 'done',
    title: 'Tugagan',
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'text-success',
    bgColor: 'bg-success/10'
  }
];

export function KanbanBoard({ onTaskClick, onCreateTask }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const getTasksByStatus = (status: string) => {
    return mockTasks.filter(task => task.status === status);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (draggedTask) {
      // In a real app, this would update the task status via API
      console.log(`Moving task ${draggedTask} to ${columnId}`);
      setDraggedTask(null);
      setDragOverColumn(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const getColumnStats = (status: string) => {
    const tasks = getTasksByStatus(status);
    const urgentTasks = tasks.filter(task => task.priority === 'urgent').length;
    const overdueTasks = tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && status !== 'done'
    ).length;
    
    return { total: tasks.length, urgent: urgentTasks, overdue: overdueTasks };
  };

  return (
    <div className="space-y-6">
      {/* Board Header */}
      <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Vazifalar taxtasi</h3>
          <p className="text-muted-foreground">
            Jami {mockTasks.length} ta vazifa
          </p>
        </div>
        <div className="flex gap-2">
          <ButtonEnhanced
            variant="outline"
            size="sm"
            iconLeft={<Search className="h-4 w-4" />}
          >
            Qidiruv
          </ButtonEnhanced>
          <ButtonEnhanced
            variant="outline"
            size="sm"
            iconLeft={<Filter className="h-4 w-4" />}
          >
            Filtrlash
          </ButtonEnhanced>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-6">
        {columns.map((column) => {
          const tasks = getTasksByStatus(column.id);
          const stats = getColumnStats(column.id);
          
          return (
            <div
              key={column.id}
              className={`space-y-4 ${
                dragOverColumn === column.id ? 'opacity-75 scale-105' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <Card className={column.bgColor}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-sm flex items-center gap-2 ${column.color}`}>
                      {column.icon}
                      {column.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {stats.total}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => onCreateTask(column.id)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Column Stats */}
                  {(stats.urgent > 0 || stats.overdue > 0) && (
                    <div className="flex gap-2 mt-2">
                      {stats.urgent > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {stats.urgent} tezkor
                        </Badge>
                      )}
                      {stats.overdue > 0 && (
                        <Badge variant="outline" className="text-xs border-danger text-danger">
                          {stats.overdue} kechikgan
                        </Badge>
                      )}
                    </div>
                  )}
                </CardHeader>
              </Card>

              {/* Tasks */}
              <div className="space-y-3 min-h-64">
                {tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className={`p-2 rounded-full ${column.bgColor} mb-2`}>
                      {column.icon}
                    </div>
                    <p className="text-sm text-muted-foreground">Vazifalar yo'q</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs mt-1"
                      onClick={() => onCreateTask(column.id)}
                    >
                      Vazifa qo'shish
                    </Button>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <TaskCard
                        task={task}
                        onClick={() => onTaskClick(task.id)}
                        isDragging={draggedTask === task.id}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}