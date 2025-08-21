import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ButtonEnhanced } from '../enhanced/ButtonEnhanced';
import { 
  Plus, 
  UserPlus, 
  Clock, 
  AlertTriangle,
  CheckSquare,
  Calendar,
  FileText,
  Settings
} from 'lucide-react';

interface QuickActionsProps {
  onCreateTask?: () => void;
  onAddEmployee?: () => void;
  onDefineShift?: () => void;
  onAdjustPenalty?: () => void;
}

export function QuickActions({ 
  onCreateTask, 
  onAddEmployee, 
  onDefineShift, 
  onAdjustPenalty 
}: QuickActionsProps) {
  const quickActions = [
    {
      title: 'Vazifa yaratish',
      description: 'Yangi vazifa yaratish va tayinlash',
      icon: CheckSquare,
      action: onCreateTask,
      variant: 'primary' as const,
    },
    {
      title: 'Xodim qo\'shish',
      description: 'Tizimga yangi xodim qo\'shish',
      icon: UserPlus,
      action: onAddEmployee,
      variant: 'success' as const,
    },
    {
      title: 'Smena belgilash',
      description: 'Ish smenasi va jadvalini tuzish',
      icon: Clock,
      action: onDefineShift,
      variant: 'neutral' as const,
    },
    {
      title: 'Jarima sozlash',
      description: 'Jarima miqdori va qoidalarini o\'zgartirish',
      icon: AlertTriangle,
      action: onAdjustPenalty,
      variant: 'warning' as const,
    },
  ];

  const additionalActions = [
    {
      title: 'Hisobot olish',
      icon: FileText,
      onClick: () => console.log('Hisobot olish'),
    },
    {
      title: 'Jadval ko\'rish',
      icon: Calendar,
      onClick: () => console.log('Jadval ko\'rish'),
    },
    {
      title: 'Sozlamalar',
      icon: Settings,
      onClick: () => console.log('Sozlamalar'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Quick Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Plus className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Tezkor harakatlar</CardTitle>
              <CardDescription>Ko'p ishlatiladigan funksiyalar</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
                onClick={action.action}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium group-hover:text-primary transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Boshqa harakatlar</CardTitle>
          <CardDescription>Qo'shimcha funksiyalar va sozlamalar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {additionalActions.map((action, index) => (
              <ButtonEnhanced
                key={index}
                variant="outline"
                size="sm"
                iconLeft={<action.icon className="h-4 w-4" />}
                onClick={action.onClick}
              >
                {action.title}
              </ButtonEnhanced>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading state for Quick Actions
export function QuickActionsLoading() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-5 bg-muted rounded animate-pulse w-32"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-48"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 bg-muted rounded-lg animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
                    <div className="h-3 bg-muted rounded animate-pulse w-36"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="space-y-2">
            <div className="h-5 bg-muted rounded animate-pulse w-32"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-48"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded animate-pulse w-24"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}