import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Users, 
  Clock, 
  UserX, 
  AlertTriangle, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  error?: boolean;
}

function KPICard({ title, value, change, icon: Icon, loading, error }: KPICardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
          <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted rounded animate-pulse w-16 mb-2"></div>
          <div className="h-3 bg-muted rounded animate-pulse w-20"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-muted-foreground">--</div>
          <Badge variant="outline" className="text-danger border-danger mt-1">
            Xatolik
          </Badge>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = () => {
    if (!change) return null;
    switch (change.type) {
      case 'positive':
        return <TrendingUp className="h-3 w-3" />;
      case 'negative':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = () => {
    if (!change) return '';
    switch (change.type) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-danger';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{change.value > 0 ? '+' : ''}{change.value} {change.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface KPICardsProps {
  loading?: boolean;
  error?: boolean;
}

export function KPICards({ loading, error }: KPICardsProps) {
  const kpiData = [
    {
      title: 'Hozir ishlayotgan',
      value: 18,
      change: {
        value: 3,
        label: 'bugundan',
        type: 'positive' as const
      },
      icon: Users,
    },
    {
      title: 'Kech kelganlar',
      value: 4,
      change: {
        value: -1,
        label: 'kechadan',
        type: 'positive' as const
      },
      icon: Clock,
    },
    {
      title: 'Kelmaganlar',
      value: 2,
      change: {
        value: 1,
        label: 'kechadan',
        type: 'negative' as const
      },
      icon: UserX,
    },
    {
      title: 'Muddati o\'tgan vazifalar',
      value: 12,
      change: {
        value: -3,
        label: 'kechadan',
        type: 'positive' as const
      },
      icon: AlertTriangle,
    },
    {
      title: 'Jami jarimalar',
      value: '2.4 mln',
      change: {
        value: -15,
        label: 'o\'tgan oydan',
        type: 'positive' as const
      },
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-5 gap-6">
      {kpiData.map((kpi, index) => (
        <KPICard
          key={index}
          title={kpi.title}
          value={kpi.value}
          change={kpi.change}
          icon={kpi.icon}
          loading={loading}
          error={error}
        />
      ))}
    </div>
  );
}