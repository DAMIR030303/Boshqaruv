import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { KanbanBoard } from './KanbanBoard';
import { TaskDetailsPanel } from './TaskDetailsPanel';
import { toast } from 'sonner';
import { 
  CheckSquare, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Users,
  Target,
  Calendar
} from 'lucide-react';

export function TasksPage() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsDetailsPanelOpen(true);
  };

  const handleCreateTask = (status: string) => {
    // In a real app, this would open a create task modal
    console.log('Creating task with status:', status);
    toast.info(`Yangi vazifa yaratish (${status})`);
  };

  const handleMarkComplete = (taskId: string) => {
    // In a real app, this would update the task status via API
    console.log('Marking task as complete:', taskId);
    toast.success('Vazifa bajarildi deb belgilandi');
    setIsDetailsPanelOpen(false);
  };

  const handleUpdateTask = (taskId: string, updates: any) => {
    // In a real app, this would update the task via API
    console.log('Updating task:', taskId, updates);
    toast.success('Vazifa yangilandi');
  };

  const handleCloseDetailsPanel = () => {
    setIsDetailsPanelOpen(false);
    setSelectedTaskId(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Vazifalar boshqaruvi</h2>
          <p className="text-muted-foreground">
            Loyiha vazifalarini boshqaring va jamoaviy ishlarni kuzating
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jami vazifalar
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +3 o'tgan haftaga nisbatan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jarayonda
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">8</div>
            <p className="text-xs text-muted-foreground">
              33% umumiy vazifalardan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tugallangan
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">12</div>
            <p className="text-xs text-muted-foreground">
              +5 o'tgan haftaga nisbatan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Kechikgan
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger">2</div>
            <p className="text-xs text-muted-foreground">
              Tezkor choralar talab etiladi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        onTaskClick={handleTaskClick}
        onCreateTask={handleCreateTask}
      />

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Jamoa samaradorligi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Alisher Fayzullayev</span>
                <span className="text-sm font-medium">5 vazifa</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-success h-2 rounded-full w-4/5"></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sevara Abdullayeva</span>
                <span className="text-sm font-medium">3 vazifa</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-warning h-2 rounded-full w-3/5"></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Jamshid Tursunov</span>
                <span className="text-sm font-medium">4 vazifa</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Yaqinlashayotgan muddatlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-danger rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">Mobil ilovani yangilash</p>
                  <p className="text-xs text-muted-foreground">Alisher Fayzullayev</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-danger">Bugun</p>
                <p className="text-xs text-muted-foreground">16:00</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">Xavfsizlik testlari</p>
                  <p className="text-xs text-muted-foreground">Dilnoza Rahimova</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Ertaga</p>
                <p className="text-xs text-muted-foreground">12:00</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">API dokumentatsiyasini yaratish</p>
                  <p className="text-xs text-muted-foreground">Nozima Karimova</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">22 Yanvar</p>
                <p className="text-xs text-muted-foreground">Dushanba</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Details Panel */}
      <TaskDetailsPanel
        isOpen={isDetailsPanelOpen}
        onClose={handleCloseDetailsPanel}
        taskId={selectedTaskId}
        onMarkComplete={handleMarkComplete}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  );
}