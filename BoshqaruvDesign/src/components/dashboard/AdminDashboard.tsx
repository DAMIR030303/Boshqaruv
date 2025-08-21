import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { ButtonEnhanced } from '../enhanced/ButtonEnhanced';
import { KPICards } from './KPICards';
import { PenaltyTrendChart, TaskStatusChart } from './Charts';
import { CheckInsTable, OverdueTasksTable } from './DataTables';
import { QuickActions, QuickActionsLoading } from './QuickActions';
import { RefreshCw } from 'lucide-react';

interface AdminDashboardProps {
  loading: boolean;
  error: boolean;
  onRefresh: () => void;
  onCreateTask: () => void;
  onAddEmployee: () => void;
  onDefineShift: () => void;
  onAdjustPenalty: () => void;
}

export function AdminDashboard({
  loading,
  error,
  onRefresh,
  onCreateTask,
  onAddEmployee,
  onDefineShift,
  onAdjustPenalty
}: AdminDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Dashboard Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Tizim holati va asosiy ko'rsatkichlar</p>
        </div>
        <ButtonEnhanced
          variant="outline"
          size="sm"
          iconLeft={<RefreshCw className="h-4 w-4" />}
          onClick={onRefresh}
          loading={loading}
        >
          Yangilash
        </ButtonEnhanced>
      </div>

      {/* KPI Cards */}
      <section>
        <KPICards loading={loading} error={error} />
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 desktop:grid-cols-2 gap-6">
        <PenaltyTrendChart loading={loading} error={error} />
        <TaskStatusChart loading={loading} error={error} />
      </section>

      {/* Data Tables and Quick Actions */}
      <section className="grid grid-cols-1 desktop:grid-cols-3 gap-6">
        {/* Data Tables */}
        <div className="desktop:col-span-2 space-y-6">
          <CheckInsTable loading={loading} error={error} />
          <OverdueTasksTable loading={loading} error={error} />
        </div>

        {/* Quick Actions */}
        <div className="desktop:col-span-1">
          {loading ? (
            <QuickActionsLoading />
          ) : (
            <QuickActions
              onCreateTask={onCreateTask}
              onAddEmployee={onAddEmployee}
              onDefineShift={onDefineShift}
              onAdjustPenalty={onAdjustPenalty}
            />
          )}
        </div>
      </section>

      {/* Performance Overview */}
      {!loading && !error && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Haftalik reja bajarilishi</CardTitle>
              <CardDescription>Joriy hafta bo'yicha vazifalar va maqsadlar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Xodimlar boshqaruvi</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Smenalar nazorati</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Vazifalar bajarilishi</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Hisobotlar tayyorlash</span>
                  <span>65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}