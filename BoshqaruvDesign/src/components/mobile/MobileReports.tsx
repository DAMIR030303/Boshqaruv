import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Download,
  Share2,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  FileText,
  Clock,
  DollarSign,
  Target
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface MobileReportsProps {
  kpiData: any;
  userProfile: any;
  onDataUpdate: (data: any) => void;
}

const attendanceData = [
  { month: 'Yan', present: 95, absent: 5 },
  { month: 'Fev', present: 92, absent: 8 },
  { month: 'Mar', present: 97, absent: 3 },
  { month: 'Apr', present: 89, absent: 11 },
  { month: 'May', present: 94, absent: 6 },
  { month: 'Iyun', present: 96, absent: 4 },
  { month: 'Iyul', present: 91, absent: 9 },
  { month: 'Avg', present: 93, absent: 7 }
];

const taskData = [
  { name: 'Bajarildi', value: 65, color: '#10B981' },
  { name: 'Jarayonda', value: 25, color: '#3B82F6' },
  { name: 'Kechikkan', value: 10, color: '#EF4444' }
];

const departmentPerformance = [
  { department: 'IT', score: 94, trend: 'up' },
  { department: 'Sotuvlar', score: 87, trend: 'up' },
  { department: 'Marketing', score: 91, trend: 'down' },
  { department: 'Boshqaruv', score: 96, trend: 'up' },
  { department: 'Xavfsizlik', score: 89, trend: 'up' }
];

const reportTypes = [
  {
    id: 'attendance',
    title: 'Davomat Hisoboti',
    description: 'Xodimlar davomat statistikasi',
    icon: Users,
    color: 'bg-primary',
    lastGenerated: '2024-08-15'
  },
  {
    id: 'performance',
    title: 'Unumdorlik Hisoboti',
    description: 'Bo\'limlar bo\'yicha unumdorlik',
    icon: TrendingUp,
    color: 'bg-success',
    lastGenerated: '2024-08-14'
  },
  {
    id: 'financial',
    title: 'Moliyaviy Hisobot',
    description: 'Jarimalar va to\'lovlar',
    icon: DollarSign,
    color: 'bg-warning',
    lastGenerated: '2024-08-13'
  },
  {
    id: 'tasks',
    title: 'Vazifalar Hisoboti',
    description: 'Vazifalar bajarilish statistikasi',
    icon: Target,
    color: 'bg-danger',
    lastGenerated: '2024-08-12'
  }
];

export function MobileReports({ kpiData, userProfile, onDataUpdate }: MobileReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const periods = [
    { value: 'week', label: 'Hafta' },
    { value: 'month', label: 'Oy' },
    { value: 'quarter', label: 'Kvartal' },
    { value: 'year', label: 'Yil' }
  ];

  return (
    <div className="boshqaruv-container space-6">
      {/* Period Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex gap-2 overflow-x-auto pb-2">
          {periods.map((period) => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period.value)}
              className="shrink-0"
            >
              {period.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-primary" />
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div className="text-xl font-bold text-foreground">93.2%</div>
            <div className="text-xs text-muted-foreground">O'rtacha davomat</div>
            <div className="text-xs text-success">+2.1% o'sish</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-5 w-5 text-success" />
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div className="text-xl font-bold text-foreground">87.5%</div>
            <div className="text-xs text-muted-foreground">Vazifalar bajarilishi</div>
            <div className="text-xs text-success">+5.3% o'sish</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-warning" />
              <TrendingDown className="h-4 w-4 text-danger" />
            </div>
            <div className="text-xl font-bold text-foreground">42h</div>
            <div className="text-xs text-muted-foreground">O'rtacha ish vaqti</div>
            <div className="text-xs text-danger">-1.2h kamayish</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-danger" />
              <TrendingDown className="h-4 w-4 text-success" />
            </div>
            <div className="text-xl font-bold text-foreground">1.2M</div>
            <div className="text-xs text-muted-foreground">Jarimalar summasi</div>
            <div className="text-xs text-success">-15% kamayish</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Attendance Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span>Davomat Trendi</span>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="present" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tasks Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Vazifalar Taqsimoti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={taskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {taskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {taskData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Department Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Bo'limlar Unumdorligi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {departmentPerformance.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium">{dept.department}</div>
                  {dept.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-danger" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium">{dept.score}%</div>
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${dept.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Report Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4 mb-8"
      >
        <h3 className="font-medium text-foreground">Hisobotlar</h3>
        
        {reportTypes.map((report, index) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${report.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{report.title}</h4>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        Oxirgi: {new Date(report.lastGenerated).toLocaleDateString('uz-UZ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Yuklab olish
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Share2 className="h-4 w-4 mr-2" />
                      Yuborish
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <Button variant="outline" className="h-16 flex-col space-y-2">
          <FileText className="h-5 w-5" />
          <span className="text-xs">Maxsus hisobot</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col space-y-2">
          <Calendar className="h-5 w-5" />
          <span className="text-xs">Rejalashtirilgan</span>
        </Button>
      </motion.div>
    </div>
  );
}