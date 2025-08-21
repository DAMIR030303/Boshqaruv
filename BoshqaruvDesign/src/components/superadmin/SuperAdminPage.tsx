import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Activity, 
  Shield, 
  Users, 
  Database, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Server, 
  Cpu, 
  HardDrive, 
  Wifi,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Play,
  Pause,
  Settings,
  Lock,
  Unlock
} from 'lucide-react';
import { toast } from 'sonner';

interface SystemKPI {
  activeOrgs: number;
  totalUsers: number;
  activeUsers: number;
  cronJobs: {
    total: number;
    running: number;
    failed: number;
  };
  errors24h: number;
}

interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  userCount: number;
  active: boolean;
}

interface BackupInfo {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  type: 'automatic' | 'manual';
  status: 'completed' | 'failed' | 'in_progress';
}

const mockSystemKPI: SystemKPI = {
  activeOrgs: 15,
  totalUsers: 342,
  activeUsers: 28,
  cronJobs: {
    total: 12,
    running: 10,
    failed: 2
  },
  errors24h: 5
};

const mockUserRoles: UserRole[] = [
  {
    id: '1',
    name: 'Super Admin',
    permissions: ['all_permissions', 'system_access', 'user_management', 'backup_management'],
    userCount: 2,
    active: true
  },
  {
    id: '2',
    name: 'Admin',
    permissions: ['employee_management', 'report_access', 'settings_access'],
    userCount: 5,
    active: true
  },
  {
    id: '3',
    name: 'Manager',
    permissions: ['employee_view', 'task_management', 'report_view'],
    userCount: 12,
    active: true
  },
  {
    id: '4',
    name: 'Employee',
    permissions: ['task_view', 'attendance_self'],
    userCount: 323,
    active: true
  }
];

const mockBackups: BackupInfo[] = [
  {
    id: '1',
    name: 'backup_2024_12_20_full',
    size: '2.3 GB',
    createdAt: '2024-12-20T03:00:00Z',
    type: 'automatic',
    status: 'completed'
  },
  {
    id: '2',
    name: 'backup_2024_12_19_incremental',
    size: '456 MB',
    createdAt: '2024-12-19T15:30:00Z',
    type: 'manual',
    status: 'completed'
  },
  {
    id: '3',
    name: 'backup_2024_12_18_full',
    size: '2.1 GB',
    createdAt: '2024-12-18T03:00:00Z',
    type: 'automatic',
    status: 'failed'
  }
];

export function SuperAdminPage() {
  const [systemStatus, setSystemStatus] = useState({
    cpuUsage: 45,
    memoryUsage: 67,
    diskUsage: 23,
    networkStatus: 'online'
  });

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground">Tugallangan</Badge>;
      case 'failed':
        return <Badge className="bg-danger text-danger-foreground">Xatolik</Badge>;
      case 'in_progress':
        return <Badge className="bg-warning text-warning-foreground">Jarayonda</Badge>;
      default:
        return <Badge variant="secondary">Noma'lum</Badge>;
    }
  };

  const handleCreateBackup = () => {
    toast.success('Zaxira nusxa yaratish boshlandi');
  };

  const handleRestoreBackup = (backupId: string) => {
    toast.success('Zaxira nusxa tiklash boshlandi');
  };

  const handleDeleteBackup = (backupId: string) => {
    toast.success('Zaxira nusxa o\'chirildi');
  };

  const handleSystemMaintenance = () => {
    toast.success('Tizim texnik xizmat rejimi yoqildi');
  };

  return (
    <div className="space-6">
      <Tabs defaultValue="kpi" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="kpi" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Tizim KPI
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Xavfsizlik
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Foydalanuvchilar
          </TabsTrigger>
          <TabsTrigger value="backups" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Zaxira
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Audit
          </TabsTrigger>
        </TabsList>

        {/* System KPI Tab */}
        <TabsContent value="kpi" className="space-y-6">
          {/* Main Stats */}
          <div className="boshqaruv-grid boshqaruv-grid-mobile tablet:boshqaruv-grid-tablet desktop:boshqaruv-grid-desktop">
            <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-primary">Faol tashkilotlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-2">
                  <Activity className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-semibold">{mockSystemKPI.activeOrgs}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-success">Jami foydalanuvchilar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-2">
                  <Users className="h-8 w-8 text-success" />
                  <span className="text-2xl font-semibold">{mockSystemKPI.totalUsers}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-warning">Faol foydalanuvchilar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-2">
                  <CheckCircle className="h-8 w-8 text-warning" />
                  <span className="text-2xl font-semibold">{mockSystemKPI.activeUsers}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-danger">24 soatlik xatoliklar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-2">
                  <AlertTriangle className="h-8 w-8 text-danger" />
                  <span className="text-2xl font-semibold">{mockSystemKPI.errors24h}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Tizim resurslari
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center gap-2">
                      <Cpu className="h-4 w-4" />
                      CPU
                    </Label>
                    <span className="text-sm font-medium">{systemStatus.cpuUsage}%</span>
                  </div>
                  <Progress value={systemStatus.cpuUsage} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Xotira
                    </Label>
                    <span className="text-sm font-medium">{systemStatus.memoryUsage}%</span>
                  </div>
                  <Progress value={systemStatus.memoryUsage} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      Disk
                    </Label>
                    <span className="text-sm font-medium">{systemStatus.diskUsage}%</span>
                  </div>
                  <Progress value={systemStatus.diskUsage} className="h-2" />
                </div>

                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    Tarmoq
                  </Label>
                  <Badge className="bg-success text-success-foreground">Onlayn</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Cron ishlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Jami ishlar</Label>
                  <Badge variant="secondary">{mockSystemKPI.cronJobs.total}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <Label>Ishlamoqda</Label>
                  <Badge className="bg-success text-success-foreground">
                    {mockSystemKPI.cronJobs.running}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <Label>Xatoliklar</Label>
                  <Badge className="bg-danger text-danger-foreground">
                    {mockSystemKPI.cronJobs.failed}
                  </Badge>
                </div>

                <Button className="w-full" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Cron ishlarni boshqarish
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Xavfsizlik sozlamalari
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Row Level Security (RLS)</Label>
                    <div className="text-sm text-muted-foreground">
                      Ma'lumotlar bazasi qator darajasida xavfsizlik
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-success text-success-foreground">Faol</Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ko'rish
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>API Rate Limiting</Label>
                    <div className="text-sm text-muted-foreground">
                      So'rovlar chastotasini cheklash
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-success text-success-foreground">Faol</Badge>
                    <span className="text-sm text-muted-foreground">100/min</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SSL/TLS</Label>
                    <div className="text-sm text-muted-foreground">
                      Ma'lumotlarni shifrlash
                    </div>
                  </div>
                  <Badge className="bg-success text-success-foreground">TLS 1.3</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Brute Force himoyasi</Label>
                    <div className="text-sm text-muted-foreground">
                      Parol buzish urinishlaridan himoya
                    </div>
                  </div>
                  <Badge className="bg-success text-success-foreground">Faol</Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="mb-4">So'nggi xavfsizlik hodisalari</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-danger/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-danger" />
                      <div>
                        <div className="text-sm font-medium">Noto'g'ri kirish urinishi</div>
                        <div className="text-xs text-muted-foreground">IP: 192.168.1.150</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">5 daqiqa oldin</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-warning" />
                      <div>
                        <div className="text-sm font-medium">Rate limit oshirildi</div>
                        <div className="text-xs text-muted-foreground">IP: 10.0.0.25</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">2 soat oldin</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <div>
                        <div className="text-sm font-medium">SSL sertifikat yangilandi</div>
                        <div className="text-xs text-muted-foreground">Avtomatik yangilash</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">1 kun oldin</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users & Roles Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3>Foydalanuvchi rollari</h3>
            <Button onClick={() => setIsRoleModalOpen(true)}>
              <Users className="h-4 w-4 mr-2" />
              Yangi rol qo'shish
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rol nomi</TableHead>
                  <TableHead>Foydalanuvchilar</TableHead>
                  <TableHead>Ruxsatlar</TableHead>
                  <TableHead>Holat</TableHead>
                  <TableHead>Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUserRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{role.userCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-64">
                        {role.permissions.slice(0, 3).map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {role.active ? (
                        <Badge className="bg-success text-success-foreground">Faol</Badge>
                      ) : (
                        <Badge variant="secondary">Nofaol</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          {role.active ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Backups Tab */}
        <TabsContent value="backups" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3>Zaxira nusxalar va texnik xizmat</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSystemMaintenance}>
                <Settings className="h-4 w-4 mr-2" />
                Texnik xizmat
              </Button>
              <Button onClick={handleCreateBackup}>
                <Database className="h-4 w-4 mr-2" />
                Zaxira yaratish
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Zaxira nusxalar</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nomi</TableHead>
                    <TableHead>Hajmi</TableHead>
                    <TableHead>Yaratilgan</TableHead>
                    <TableHead>Turi</TableHead>
                    <TableHead>Holat</TableHead>
                    <TableHead>Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBackups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell className="font-mono text-sm">{backup.name}</TableCell>
                      <TableCell>{backup.size}</TableCell>
                      <TableCell>
                        {new Date(backup.createdAt).toLocaleDateString('uz-UZ')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={backup.type === 'automatic' ? 'secondary' : 'outline'}>
                          {backup.type === 'automatic' ? 'Avtomatik' : 'Qo\'lda'}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(backup.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestoreBackup(backup.id)}
                            disabled={backup.status !== 'completed'}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBackup(backup.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Maintenance Section */}
          <Card>
            <CardHeader>
              <CardTitle>Tizim texnik xizmati</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Texnik xizmat rejimi</Label>
                  <div className="text-sm text-muted-foreground">
                    Tizimni texnik xizmat uchun yopish
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Faol emas</Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Yoqish
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Ma'lumotlar bazasini tozalash</Label>
                  <div className="text-sm text-muted-foreground">
                    Eski ma'lumotlarni o'chirish
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tozalash
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Log fayllarini tozalash</Label>
                  <div className="text-sm text-muted-foreground">
                    Eski log fayllarini o'chirish
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Tozalash
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Tizimni qayta ishga tushirish</Label>
                  <div className="text-sm text-muted-foreground">
                    Tizimni to'liq qayta ishga tushirish
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-danger hover:text-danger">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Qayta ishga tushirish
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Super Admin audit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="mb-2">Audit ma'lumotlari</h4>
                <p className="text-muted-foreground mb-4">
                  Super Admin faoliyatini kuzatish uchun alohida audit tizimi
                </p>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Audit sahifasiga o'tish
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}