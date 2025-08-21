import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  Settings,
  FileText,
  Clock,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

interface AuditLog {
  id: string;
  time: string;
  actor: {
    id: string;
    name: string;
    role: string;
    ip: string;
  };
  action: string;
  entity: {
    type: string;
    id: string;
    name: string;
  };
  result: 'success' | 'failure' | 'warning';
  details: string;
  metadata?: {
    userAgent?: string;
    duration?: number;
    changedFields?: string[];
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
  };
}

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    time: '2024-12-20T14:30:25Z',
    actor: {
      id: 'user_1',
      name: 'Admin User',
      role: 'Super Admin',
      ip: '192.168.1.100'
    },
    action: 'CREATE_EMPLOYEE',
    entity: {
      type: 'Employee',
      id: 'emp_123',
      name: 'Alisher Fayzullayev'
    },
    result: 'success',
    details: 'Yangi xodim qo\'shildi',
    metadata: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      duration: 245,
      changedFields: ['name', 'position', 'email', 'phone']
    }
  },
  {
    id: '2',
    time: '2024-12-20T14:25:12Z',
    actor: {
      id: 'user_2',
      name: 'Manager User',
      role: 'Manager',
      ip: '192.168.1.105'
    },
    action: 'UPDATE_TASK',
    entity: {
      type: 'Task',
      id: 'task_456',
      name: 'Frontend loyihasi'
    },
    result: 'success',
    details: 'Vazifa holati o\'zgartirildi',
    metadata: {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      duration: 156,
      changedFields: ['status', 'assignee'],
      oldValues: { status: 'in_progress', assignee: 'emp_001' },
      newValues: { status: 'completed', assignee: 'emp_002' }
    }
  },
  {
    id: '3',
    time: '2024-12-20T14:20:33Z',
    actor: {
      id: 'user_3',
      name: 'Employee User',
      role: 'Employee',
      ip: '192.168.1.110'
    },
    action: 'LOGIN_ATTEMPT',
    entity: {
      type: 'System',
      id: 'auth_system',
      name: 'Autentifikatsiya tizimi'
    },
    result: 'failure',
    details: 'Noto\'g\'ri parol bilan kirish urinishi',
    metadata: {
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      duration: 1200
    }
  },
  {
    id: '4',
    time: '2024-12-20T14:15:45Z',
    actor: {
      id: 'user_1',
      name: 'Admin User',
      role: 'Super Admin',
      ip: '192.168.1.100'
    },
    action: 'DELETE_PENALTY',
    entity: {
      type: 'Penalty',
      id: 'penalty_789',
      name: 'Kechikish jarimi'
    },
    result: 'warning',
    details: 'Jarima o\'chirildi, ammo fayl mavjud emas',
    metadata: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      duration: 89
    }
  },
  {
    id: '5',
    time: '2024-12-20T14:10:18Z',
    actor: {
      id: 'system',
      name: 'Tizim',
      role: 'System',
      ip: '127.0.0.1'
    },
    action: 'BACKUP_CREATED',
    entity: {
      type: 'Database',
      id: 'db_main',
      name: 'Asosiy ma\'lumotlar bazasi'
    },
    result: 'success',
    details: 'Haftalik zaxira nusxa yaratildi',
    metadata: {
      duration: 12500,
      newValues: {
        fileSize: '2.3GB',
        recordCount: 125000
      }
    }
  }
];

export function AuditPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActor, setFilterActor] = useState<string>('all');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterEntity, setFilterEntity] = useState<string>('all');
  const [filterResult, setFilterResult] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failure':
        return <XCircle className="h-4 w-4 text-danger" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'success':
        return <Badge className="bg-success text-success-foreground">Muvaffaqiyatli</Badge>;
      case 'failure':
        return <Badge className="bg-danger text-danger-foreground">Xatolik</Badge>;
      case 'warning':
        return <Badge className="bg-warning text-warning-foreground">Ogohlantirish</Badge>;
      default:
        return <Badge variant="secondary">Noma'lum</Badge>;
    }
  };

  const getActionText = (action: string) => {
    const actionMap: Record<string, string> = {
      'CREATE_EMPLOYEE': 'Xodim yaratish',
      'UPDATE_EMPLOYEE': 'Xodim yangilash',
      'DELETE_EMPLOYEE': 'Xodim o\'chirish',
      'CREATE_TASK': 'Vazifa yaratish',
      'UPDATE_TASK': 'Vazifa yangilash',
      'DELETE_TASK': 'Vazifa o\'chirish',
      'CREATE_PENALTY': 'Jarima yaratish',
      'UPDATE_PENALTY': 'Jarima yangilash',
      'DELETE_PENALTY': 'Jarima o\'chirish',
      'LOGIN_ATTEMPT': 'Kirish urinishi',
      'LOGOUT': 'Chiqish',
      'BACKUP_CREATED': 'Zaxira yaratish',
      'BACKUP_RESTORED': 'Zaxira tiklash',
      'SETTINGS_CHANGED': 'Sozlamalar o\'zgartirish'
    };
    return actionMap[action] || action;
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType.toLowerCase()) {
      case 'employee':
        return <User className="h-4 w-4" />;
      case 'system':
        return <Settings className="h-4 w-4" />;
      case 'database':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesActor = filterActor === 'all' || log.actor.role === filterActor;
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesEntity = filterEntity === 'all' || log.entity.type === filterEntity;
    const matchesResult = filterResult === 'all' || log.result === filterResult;

    let matchesDate = true;
    if (dateFrom || dateTo) {
      const logDate = new Date(log.time);
      if (dateFrom) matchesDate = matchesDate && logDate >= dateFrom;
      if (dateTo) matchesDate = matchesDate && logDate <= dateTo;
    }

    return matchesSearch && matchesActor && matchesAction && matchesEntity && matchesResult && matchesDate;
  });

  const handleExport = () => {
    toast.success('Audit loglar eksport qilindi');
  };

  const handleRefresh = () => {
    toast.success('Audit loglar yangilandi');
  };

  return (
    <div className="space-6">
      {/* Stats Cards */}
      <div className="boshqaruv-grid boshqaruv-grid-mobile tablet:boshqaruv-grid-tablet desktop:boshqaruv-grid-desktop mb-6">
        <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-success">Muvaffaqiyatli</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-2">
              <CheckCircle className="h-8 w-8 text-success" />
              <span className="text-2xl font-semibold">
                {mockAuditLogs.filter(log => log.result === 'success').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-danger">Xatoliklar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-2">
              <XCircle className="h-8 w-8 text-danger" />
              <span className="text-2xl font-semibold">
                {mockAuditLogs.filter(log => log.result === 'failure').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-warning">Ogohlantirishlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-2">
              <AlertTriangle className="h-8 w-8 text-warning" />
              <span className="text-2xl font-semibold">
                {mockAuditLogs.filter(log => log.result === 'warning').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-primary">Jami</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-2">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-2xl font-semibold">{mockAuditLogs.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Yangilash
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Eksport
              </Button>
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Foydalanuvchi</Label>
              <Select value={filterActor} onValueChange={setFilterActor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                  <SelectItem value="System">Tizim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Amal</Label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="CREATE_EMPLOYEE">Xodim yaratish</SelectItem>
                  <SelectItem value="UPDATE_TASK">Vazifa yangilash</SelectItem>
                  <SelectItem value="LOGIN_ATTEMPT">Kirish urinishi</SelectItem>
                  <SelectItem value="DELETE_PENALTY">Jarima o'chirish</SelectItem>
                  <SelectItem value="BACKUP_CREATED">Zaxira yaratish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Obyekt</Label>
              <Select value={filterEntity} onValueChange={setFilterEntity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="Employee">Xodim</SelectItem>
                  <SelectItem value="Task">Vazifa</SelectItem>
                  <SelectItem value="Penalty">Jarima</SelectItem>
                  <SelectItem value="System">Tizim</SelectItem>
                  <SelectItem value="Database">Ma'lumotlar bazasi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Natija</Label>
              <Select value={filterResult} onValueChange={setFilterResult}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="success">Muvaffaqiyatli</SelectItem>
                  <SelectItem value="failure">Xatolik</SelectItem>
                  <SelectItem value="warning">Ogohlantirish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
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

            <div className="space-y-2">
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
          </div>
        </div>
      </Card>

      {/* Audit Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit jurnali</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vaqt</TableHead>
                  <TableHead>Foydalanuvchi</TableHead>
                  <TableHead>Amal</TableHead>
                  <TableHead>Obyekt</TableHead>
                  <TableHead>Natija</TableHead>
                  <TableHead>Tafsilotlar</TableHead>
                  <TableHead>Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="text-sm">
                        {format(new Date(log.time), 'dd/MM/yyyy')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(log.time), 'HH:mm:ss')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-sm">{log.actor.name}</div>
                          <div className="text-xs text-muted-foreground">{log.actor.role}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{getActionText(log.action)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getEntityIcon(log.entity.type)}
                        <div>
                          <div className="text-sm">{log.entity.type}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-32">
                            {log.entity.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getResultIcon(log.result)}
                        {getResultBadge(log.result)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm max-w-48 truncate">{log.details}</div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Detailed Log View Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Audit log tafsilotlari</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedLog(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="max-h-96">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Vaqt</Label>
                      <div className="text-sm">
                        {format(new Date(selectedLog.time), 'dd/MM/yyyy HH:mm:ss', { locale: uz })}
                      </div>
                    </div>
                    <div>
                      <Label>Natija</Label>
                      <div className="flex items-center gap-2 mt-1">
                        {getResultIcon(selectedLog.result)}
                        {getResultBadge(selectedLog.result)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Foydalanuvchi</Label>
                    <div className="text-sm space-y-1">
                      <div>{selectedLog.actor.name} ({selectedLog.actor.role})</div>
                      <div className="text-muted-foreground">IP: {selectedLog.actor.ip}</div>
                    </div>
                  </div>

                  <div>
                    <Label>Amal</Label>
                    <div className="text-sm">{getActionText(selectedLog.action)}</div>
                  </div>

                  <div>
                    <Label>Obyekt</Label>
                    <div className="text-sm space-y-1">
                      <div>{selectedLog.entity.type}: {selectedLog.entity.name}</div>
                      <div className="text-muted-foreground">ID: {selectedLog.entity.id}</div>
                    </div>
                  </div>

                  <div>
                    <Label>Tafsilotlar</Label>
                    <div className="text-sm">{selectedLog.details}</div>
                  </div>

                  {selectedLog.metadata && (
                    <div>
                      <Label>Qo'shimcha ma'lumotlar</Label>
                      <div className="text-sm space-y-2">
                        {selectedLog.metadata.duration && (
                          <div>Davomiyligi: {selectedLog.metadata.duration}ms</div>
                        )}
                        {selectedLog.metadata.userAgent && (
                          <div className="break-all">
                            User Agent: {selectedLog.metadata.userAgent}
                          </div>
                        )}
                        {selectedLog.metadata.changedFields && (
                          <div>
                            O'zgargan maydonlar: {selectedLog.metadata.changedFields.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}