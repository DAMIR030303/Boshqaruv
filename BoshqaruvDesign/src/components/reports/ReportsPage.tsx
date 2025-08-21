import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { 
  Calendar as CalendarIcon, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { uz } from 'date-fns/locale';

interface AttendanceReport {
  employee: string;
  position: string;
  workingDays: number;
  presentDays: number;
  lateDays: number;
  absentDays: number;
  attendanceRate: number;
  averageWorkingHours: number;
}

interface PenaltyReport {
  employee: string;
  position: string;
  totalPenalties: number;
  totalPoints: number;
  attendancePenalties: number;
  behaviorPenalties: number;
  performancePenalties: number;
}

interface TaskReport {
  employee: string;
  position: string;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
  averageCompletionTime: number;
}

const mockAttendanceReports: AttendanceReport[] = [
  {
    employee: 'Alisher Fayzullayev',
    position: 'Frontend Developer',
    workingDays: 22,
    presentDays: 21,
    lateDays: 1,
    absentDays: 1,
    attendanceRate: 95.5,
    averageWorkingHours: 8.2
  },
  {
    employee: 'Nozima Karimova',
    position: 'UX Designer',
    workingDays: 22,
    presentDays: 20,
    lateDays: 3,
    absentDays: 2,
    attendanceRate: 90.9,
    averageWorkingHours: 7.8
  },
  {
    employee: 'Jamshid Tursunov',
    position: 'Backend Developer',
    workingDays: 22,
    presentDays: 22,
    lateDays: 0,
    absentDays: 0,
    attendanceRate: 100,
    averageWorkingHours: 8.5
  },
  {
    employee: 'Dilnoza Rahimova',
    position: 'Project Manager',
    workingDays: 22,
    presentDays: 19,
    lateDays: 2,
    absentDays: 3,
    attendanceRate: 86.4,
    averageWorkingHours: 7.9
  }
];

const mockPenaltyReports: PenaltyReport[] = [
  {
    employee: 'Alisher Fayzullayev',
    position: 'Frontend Developer',
    totalPenalties: 1,
    totalPoints: 5,
    attendancePenalties: 1,
    behaviorPenalties: 0,
    performancePenalties: 0
  },
  {
    employee: 'Nozima Karimova',
    position: 'UX Designer',
    totalPenalties: 2,
    totalPoints: 13,
    attendancePenalties: 2,
    behaviorPenalties: 0,
    performancePenalties: 0
  },
  {
    employee: 'Jamshid Tursunov',
    position: 'Backend Developer',
    totalPenalties: 0,
    totalPoints: 0,
    attendancePenalties: 0,
    behaviorPenalties: 0,
    performancePenalties: 0
  },
  {
    employee: 'Dilnoza Rahimova',
    position: 'Project Manager',
    totalPenalties: 3,
    totalPoints: 23,
    attendancePenalties: 1,
    behaviorPenalties: 1,
    performancePenalties: 1
  }
];

const mockTaskReports: TaskReport[] = [
  {
    employee: 'Alisher Fayzullayev',
    position: 'Frontend Developer',
    totalTasks: 15,
    completedTasks: 13,
    overdueTasks: 1,
    completionRate: 86.7,
    averageCompletionTime: 2.3
  },
  {
    employee: 'Nozima Karimova',
    position: 'UX Designer',
    totalTasks: 12,
    completedTasks: 11,
    overdueTasks: 0,
    completionRate: 91.7,
    averageCompletionTime: 1.8
  },
  {
    employee: 'Jamshid Tursunov',
    position: 'Backend Developer',
    totalTasks: 18,
    completedTasks: 16,
    overdueTasks: 2,
    completionRate: 88.9,
    averageCompletionTime: 2.7
  },
  {
    employee: 'Dilnoza Rahimova',
    position: 'Project Manager',
    totalTasks: 10,
    completedTasks: 8,
    overdueTasks: 1,
    completionRate: 80.0,
    averageCompletionTime: 3.1
  }
];

export function ReportsPage() {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(startOfMonth(new Date()));
  const [dateTo, setDateTo] = useState<Date | undefined>(endOfMonth(new Date()));
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    const now = new Date();
    
    switch (period) {
      case 'current_month':
        setDateFrom(startOfMonth(now));
        setDateTo(endOfMonth(now));
        break;
      case 'last_month':
        const lastMonth = subMonths(now, 1);
        setDateFrom(startOfMonth(lastMonth));
        setDateTo(endOfMonth(lastMonth));
        break;
      case 'last_3_months':
        setDateFrom(startOfMonth(subMonths(now, 2)));
        setDateTo(endOfMonth(now));
        break;
      case 'custom':
        // Keep current dates
        break;
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]).join(',');
    const csvContent = [
      headers,
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
    toast.success(`${filename} Excel faylda saqlandi`);
  };

  const exportToPDF = (filename: string) => {
    // Mock PDF export
    toast.success(`${filename} PDF faylda saqlandi`);
  };

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 95) return 'text-success';
    if (rate >= 85) return 'text-warning';
    return 'text-danger';
  };

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 90) return 'text-success';
    if (rate >= 80) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="space-6">
      {/* Date Range Selector */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-48">
            <Label>Davr</Label>
            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current_month">Joriy oy</SelectItem>
                <SelectItem value="last_month">O'tgan oy</SelectItem>
                <SelectItem value="last_3_months">So'nggi 3 oy</SelectItem>
                <SelectItem value="custom">Boshqa davr</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedPeriod === 'custom' && (
            <>
              <div className="flex-1 min-w-48">
                <Label>Dan</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, 'PPP', { locale: uz }) : 'Sana tanlang'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      locale={uz}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex-1 min-w-48">
                <Label>Gacha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, 'PPP', { locale: uz }) : 'Sana tanlang'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      locale={uz}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          <div className="text-sm text-muted-foreground">
            {dateFrom && dateTo && (
              <>
                {format(dateFrom, 'dd/MM/yyyy')} - {format(dateTo, 'dd/MM/yyyy')}
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="boshqaruv-grid boshqaruv-grid-mobile tablet:boshqaruv-grid-tablet desktop:boshqaruv-grid-desktop mb-6">
        <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-primary flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              O'rtacha davomat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">93.2%</div>
            <div className="flex items-center text-sm text-success mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +2.1% o'tgan oyga nisbatan
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-warning flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Jami jarimalar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">41 ball</div>
            <div className="flex items-center text-sm text-danger mt-1">
              <TrendingDown className="h-4 w-4 mr-1" />
              +5 ball o'tgan oyga nisbatan
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-success flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Vazifa bajarilishi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">86.8%</div>
            <div className="flex items-center text-sm text-success mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +1.5% o'tgan oyga nisbatan
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-primary flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Faol xodimlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">17</div>
            <div className="text-sm text-muted-foreground mt-1">
              Jami xodimlar soni
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="attendance">Davomat hisoboti</TabsTrigger>
          <TabsTrigger value="penalties">Jarimalar hisoboti</TabsTrigger>
          <TabsTrigger value="tasks">Vazifalar hisoboti</TabsTrigger>
        </TabsList>

        {/* Attendance Report */}
        <TabsContent value="attendance" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3>Davomat hisoboti</h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => exportToCSV(mockAttendanceReports, 'davomat_hisoboti')}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button 
                variant="outline" 
                onClick={() => exportToPDF('davomat_hisoboti')}
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Xodim</TableHead>
                  <TableHead>Ish kunlari</TableHead>
                  <TableHead>Hozir</TableHead>
                  <TableHead>Kech</TableHead>
                  <TableHead>Yo'q</TableHead>
                  <TableHead>Davomat %</TableHead>
                  <TableHead>O'rtacha ish vaqti</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAttendanceReports.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{report.employee}</div>
                        <div className="text-sm text-muted-foreground">{report.position}</div>
                      </div>
                    </TableCell>
                    <TableCell>{report.workingDays}</TableCell>
                    <TableCell>
                      <Badge className="bg-success text-success-foreground">{report.presentDays}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-warning text-warning-foreground">{report.lateDays}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-danger text-danger-foreground">{report.absentDays}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-2">
                        <div className={`font-medium ${getAttendanceRateColor(report.attendanceRate)}`}>
                          {report.attendanceRate}%
                        </div>
                        <Progress value={report.attendanceRate} className="w-16" />
                      </div>
                    </TableCell>
                    <TableCell>{report.averageWorkingHours} soat</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Penalties Report */}
        <TabsContent value="penalties" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3>Jarimalar hisoboti</h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => exportToCSV(mockPenaltyReports, 'jarimalar_hisoboti')}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button 
                variant="outline" 
                onClick={() => exportToPDF('jarimalar_hisoboti')}
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Xodim</TableHead>
                  <TableHead>Jami jarimalar</TableHead>
                  <TableHead>Jami balllar</TableHead>
                  <TableHead>Davomat</TableHead>
                  <TableHead>Xulq-atvor</TableHead>
                  <TableHead>Samaradorlik</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPenaltyReports.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{report.employee}</div>
                        <div className="text-sm text-muted-foreground">{report.position}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.totalPenalties}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-danger border-danger">
                        {report.totalPoints}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.attendancePenalties}</TableCell>
                    <TableCell>{report.behaviorPenalties}</TableCell>
                    <TableCell>{report.performancePenalties}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Tasks Report */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3>Vazifalar hisoboti</h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => exportToCSV(mockTaskReports, 'vazifalar_hisoboti')}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button 
                variant="outline" 
                onClick={() => exportToPDF('vazifalar_hisoboti')}
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Xodim</TableHead>
                  <TableHead>Jami vazifalar</TableHead>
                  <TableHead>Bajarilgan</TableHead>
                  <TableHead>Kechikkan</TableHead>
                  <TableHead>Bajarish %</TableHead>
                  <TableHead>O'rtacha vaqt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTaskReports.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{report.employee}</div>
                        <div className="text-sm text-muted-foreground">{report.position}</div>
                      </div>
                    </TableCell>
                    <TableCell>{report.totalTasks}</TableCell>
                    <TableCell>
                      <Badge className="bg-success text-success-foreground">{report.completedTasks}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-danger text-danger-foreground">{report.overdueTasks}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-2">
                        <div className={`font-medium ${getCompletionRateColor(report.completionRate)}`}>
                          {report.completionRate}%
                        </div>
                        <Progress value={report.completionRate} className="w-16" />
                      </div>
                    </TableCell>
                    <TableCell>{report.averageCompletionTime} kun</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}