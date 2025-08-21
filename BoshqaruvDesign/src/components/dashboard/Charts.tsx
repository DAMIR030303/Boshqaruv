import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Penalty trend data
const penaltyTrendData = [
  { month: 'Yan', penalties: 12, amount: 2400000 },
  { month: 'Fev', penalties: 8, amount: 1600000 },
  { month: 'Mar', penalties: 15, amount: 3000000 },
  { month: 'Apr', penalties: 6, amount: 1200000 },
  { month: 'May', penalties: 10, amount: 2000000 },
  { month: 'Iyun', penalties: 5, amount: 1000000 },
];

// Task status data
const taskStatusData = [
  { name: 'Bajarilgan', value: 45, count: 89 },
  { name: 'Jarayonda', value: 30, count: 58 },
  { name: 'Muddati o\'tgan', value: 15, count: 29 },
  { name: 'Bekor qilingan', value: 10, count: 19 },
];

const COLORS = {
  'Bajarilgan': '#10B981',
  'Jarayonda': '#2563EB', 
  'Muddati o\'tgan': '#EF4444',
  'Bekor qilingan': '#6B7280'
};

interface PenaltyTrendChartProps {
  loading?: boolean;
  error?: boolean;
}

export function PenaltyTrendChart({ loading, error }: PenaltyTrendChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <div className="h-5 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Jarimalar tendentsiyasi</CardTitle>
          <CardDescription>Oxirgi 6 oy bo'yicha statistika</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="text-muted-foreground">Ma'lumotlarni yuklashda xatolik</div>
            <Badge variant="outline" className="text-danger border-danger">
              Xatolik
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jarimalar tendentsiyasi</CardTitle>
        <CardDescription>Oxirgi 6 oy bo'yicha statistika</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={penaltyTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Oy
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {label}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Jarimalar
                          </span>
                          <span className="font-bold">
                            {payload[0]?.value} ta
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="penalties" 
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface TaskStatusChartProps {
  loading?: boolean;
  error?: boolean;
}

export function TaskStatusChart({ loading, error }: TaskStatusChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <div className="h-5 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-full animate-pulse mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vazifalar holati</CardTitle>
          <CardDescription>Barcha vazifalar bo'yicha taqsimot</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="text-muted-foreground">Ma'lumotlarni yuklashda xatolik</div>
            <Badge variant="outline" className="text-danger border-danger">
              Xatolik
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vazifalar holati</CardTitle>
        <CardDescription>Barcha vazifalar bo'yicha taqsimot</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={taskStatusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {taskStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Holat
                          </span>
                          <span className="font-bold">
                            {data.name}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Soni
                          </span>
                          <span className="font-bold">
                            {data.count} ta ({data.value}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-2 mt-4">
          {taskStatusData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name} ({entry.count})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}