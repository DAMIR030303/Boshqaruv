import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Clock, MapPin, Camera, QrCode, CheckCircle, AlertTriangle, Calendar, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface AttendanceRecord {
  id: string;
  employee: {
    id: string;
    name: string;
    photo: string;
    position: string;
  };
  checkIn: string;
  checkOut: string | null;
  location: string;
  method: 'photo' | 'qr' | 'gps';
  status: 'present' | 'late' | 'absent' | 'exception';
  exceptionType?: 'business_trip' | 'justified_delay' | 'sick_leave';
  exceptionReason?: string;
  workingHours: string;
}

const mockAttendanceData: AttendanceRecord[] = [
  {
    id: '1',
    employee: {
      id: 'emp1',
      name: 'Alisher Fayzullayev',
      photo: '/api/placeholder/40/40',
      position: 'Frontend Developer'
    },
    checkIn: '08:45',
    checkOut: null,
    location: 'Bosh ofis',
    method: 'photo',
    status: 'present',
    workingHours: '8:45'
  },
  {
    id: '2',
    employee: {
      id: 'emp2',
      name: 'Nozima Karimova',
      photo: '/api/placeholder/40/40',
      position: 'UX Designer'
    },
    checkIn: '09:15',
    checkOut: null,
    location: 'Bosh ofis',
    method: 'qr',
    status: 'late',
    workingHours: '7:30'
  },
  {
    id: '3',
    employee: {
      id: 'emp3',
      name: 'Jamshid Tursunov',
      photo: '/api/placeholder/40/40',
      position: 'Backend Developer'
    },
    checkIn: '09:45',
    checkOut: null,
    location: 'Samarqand filiali',
    method: 'gps',
    status: 'exception',
    exceptionType: 'business_trip',
    exceptionReason: 'Mijoz bilan uchrashuv',
    workingHours: '7:00'
  },
  {
    id: '4',
    employee: {
      id: 'emp4',
      name: 'Dilnoza Rahimova',
      photo: '/api/placeholder/40/40',
      position: 'Project Manager'
    },
    checkIn: '10:30',
    checkOut: null,
    location: 'Bosh ofis',
    method: 'photo',
    status: 'exception',
    exceptionType: 'justified_delay',
    exceptionReason: 'Transport muammosi',
    workingHours: '6:15'
  }
];

const timelineData = [
  { time: '08:00', event: 'Ish kuni boshlanishi', type: 'start' },
  { time: '08:45', event: 'Alisher Fayzullayev keldi', type: 'checkin', method: 'photo' },
  { time: '09:15', event: 'Nozima Karimova keldi (kech)', type: 'checkin', method: 'qr' },
  { time: '09:45', event: 'Jamshid Tursunov keldi (xizmat safari)', type: 'checkin', method: 'gps' },
  { time: '10:30', event: 'Dilnoza Rahimova keldi (transport muammosi)', type: 'checkin', method: 'photo' },
  { time: '12:00', event: 'Tushlik tanaffusi', type: 'break' },
  { time: '13:00', event: 'Tushlik tanaffusi tugadi', type: 'break_end' }
];

export function AttendancePage() {
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [exceptionType, setExceptionType] = useState<string>('');
  const [approvalReason, setApprovalReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-success text-success-foreground">Hozir</Badge>;
      case 'late':
        return <Badge className="bg-warning text-warning-foreground">Kech</Badge>;
      case 'absent':
        return <Badge className="bg-danger text-danger-foreground">Yo'q</Badge>;
      case 'exception':
        return <Badge variant="outline" className="border-warning text-warning">Istisno</Badge>;
      default:
        return <Badge variant="secondary">Noma'lum</Badge>;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'photo':
        return <Camera className="h-4 w-4" />;
      case 'qr':
        return <QrCode className="h-4 w-4" />;
      case 'gps':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getExceptionTypeText = (type: string) => {
    switch (type) {
      case 'business_trip':
        return 'Xizmat safari';
      case 'justified_delay':
        return 'Oqlangan kechikish';
      case 'sick_leave':
        return 'Kasallik ta\'tili';
      default:
        return 'Boshqa';
    }
  };

  const handleApproveException = () => {
    if (!selectedRecord || !exceptionType) return;

    toast.success('Istisno tasdiqlandi');
    setIsExceptionModalOpen(false);
    setSelectedRecord(null);
    setExceptionType('');
    setApprovalReason('');
  };

  const filteredRecords = mockAttendanceData.filter(record => 
    filterStatus === 'all' || record.status === filterStatus
  );

  return (
    <div className="space-6">
      {/* Header Stats */}
      <div className="boshqaruv-grid boshqaruv-grid-mobile tablet:boshqaruv-grid-tablet desktop:boshqaruv-grid-desktop mb-6">
        <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-success">Hozir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-2">
              <CheckCircle className="h-8 w-8 text-success" />
              <span className="text-2xl font-semibold">12</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-warning">Kech</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-2">
              <AlertTriangle className="h-8 w-8 text-warning" />
              <span className="text-2xl font-semibold">3</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-danger">Yo'q</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-2">
              <Calendar className="h-8 w-8 text-danger" />
              <span className="text-2xl font-semibold">2</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-primary">Jami</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-2">
              <Clock className="h-8 w-8 text-primary" />
              <span className="text-2xl font-semibold">17</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="list" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list">Ro'yxat</TabsTrigger>
            <TabsTrigger value="timeline">Vaqt jadval</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status bo'yicha filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="present">Hozir</SelectItem>
                <SelectItem value="late">Kech</SelectItem>
                <SelectItem value="absent">Yo'q</SelectItem>
                <SelectItem value="exception">Istisno</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="list" className="space-y-4">
          {filteredRecords.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={record.employee.photo} alt={record.employee.name} />
                      <AvatarFallback>
                        {record.employee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h4 className="font-medium">{record.employee.name}</h4>
                      <p className="text-sm text-muted-foreground">{record.employee.position}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-4">
                    <div className="text-right">
                      <div className="flex items-center space-2 text-sm">
                        {getMethodIcon(record.method)}
                        <span>{record.checkIn}</span>
                      </div>
                      <div className="flex items-center space-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{record.location}</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-medium">{record.workingHours}</div>
                      <div className="text-xs text-muted-foreground">Ish vaqti</div>
                    </div>

                    <div className="flex items-center space-2">
                      {getStatusBadge(record.status)}
                      
                      {record.status === 'exception' && (
                        <Dialog open={isExceptionModalOpen} onOpenChange={setIsExceptionModalOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedRecord(record)}
                            >
                              Tasdiqlash
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Istisno holat tasdiqlash</DialogTitle>
                              <DialogDescription>
                                {record.employee.name} uchun istisno holatni tasdiqlang
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="exception-type">Istisno turi</Label>
                                <Select value={exceptionType} onValueChange={setExceptionType}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Istisno turini tanlang" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="business_trip">Xizmat safari</SelectItem>
                                    <SelectItem value="justified_delay">Oqlangan kechikish</SelectItem>
                                    <SelectItem value="sick_leave">Kasallik ta'tili</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="reason">Sabab</Label>
                                <Input 
                                  id="reason"
                                  value={record.exceptionReason || ''}
                                  disabled
                                  placeholder="Xodim tomonidan ko'rsatilgan sabab"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="approval-reason">Tasdiqlash sababi</Label>
                                <Textarea
                                  id="approval-reason"
                                  value={approvalReason}
                                  onChange={(e) => setApprovalReason(e.target.value)}
                                  placeholder="Istisno holatni tasdiqlash sababini kiriting..."
                                />
                              </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                onClick={() => setIsExceptionModalOpen(false)}
                              >
                                Bekor qilish
                              </Button>
                              <Button 
                                onClick={handleApproveException}
                                disabled={!exceptionType}
                              >
                                Tasdiqlash
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </div>

                {record.status === 'exception' && record.exceptionReason && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <div className="flex items-center space-2 text-sm">
                      <span className="font-medium">
                        {getExceptionTypeText(record.exceptionType || '')}:
                      </span>
                      <span className="text-muted-foreground">{record.exceptionReason}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bugungi faoliyat vaqt jadvali</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineData.map((item, index) => (
                  <div key={index} className="flex items-center space-4">
                    <div className="flex-shrink-0 w-16 text-sm font-medium text-muted-foreground">
                      {item.time}
                    </div>
                    
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {item.type === 'checkin' && getMethodIcon(item.method || 'clock')}
                      {item.type === 'start' && <CheckCircle className="h-4 w-4 text-success" />}
                      {item.type === 'break' && <Clock className="h-4 w-4 text-warning" />}
                      {item.type === 'break_end' && <CheckCircle className="h-4 w-4 text-primary" />}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}