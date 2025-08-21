import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  AlertTriangle, 
  Award, 
  TrendingDown, 
  TrendingUp, 
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import { toast } from 'sonner';

interface PenaltyRecord {
  id: string;
  type: 'penalty' | 'bonus';
  points: number;
  reason: string;
  category: string;
  date: string;
  approvedBy: string;
  status: 'approved' | 'pending' | 'rejected';
  appealable: boolean;
}

interface MonthlyStats {
  month: string;
  totalPenalties: number;
  totalBonuses: number;
  netPoints: number;
  attendanceRate: number;
}

const mockRecords: PenaltyRecord[] = [
  {
    id: '1',
    type: 'penalty',
    points: -5,
    reason: '15 daqiqa kechikish',
    category: 'Davomat',
    date: '2024-12-18T09:15:00',
    approvedBy: 'Dilnoza Rahimova',
    status: 'approved',
    appealable: true
  },
  {
    id: '2',
    type: 'bonus',
    points: 10,
    reason: 'Loyihani muddatidan oldin tugallash',
    category: 'Ish samaradorligi',
    date: '2024-12-15T17:00:00',
    approvedBy: 'Jamshid Tursunov',
    status: 'approved',
    appealable: false
  },
  {
    id: '3',
    type: 'penalty',
    points: -3,
    reason: 'Ish joyini tartibsiz qoldirish',
    category: 'Intizom',
    date: '2024-12-12T18:30:00',
    approvedBy: 'Admin',
    status: 'approved',
    appealable: true
  },
  {
    id: '4',
    type: 'bonus',
    points: 15,
    reason: 'Yangi xodimni o\'rgatish',
    category: 'Jamoa ishi',
    date: '2024-12-10T16:00:00',
    approvedBy: 'Dilnoza Rahimova',
    status: 'approved',
    appealable: false
  },
  {
    id: '5',
    type: 'penalty',
    points: -8,
    reason: 'Vazifa muddati buzildi',
    category: 'Ish samaradorligi',
    date: '2024-12-08T17:00:00',
    approvedBy: 'Jamshid Tursunov',
    status: 'pending',
    appealable: true
  }
];

const monthlyStats: MonthlyStats = {
  month: 'Dekabr 2024',
  totalPenalties: -16,
  totalBonuses: 25,
  netPoints: 9,
  attendanceRate: 92.5
};

export function PenaltiesScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'penalties' | 'bonuses'>('all');
  const [selectedRecord, setSelectedRecord] = useState<PenaltyRecord | null>(null);
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [appealReason, setAppealReason] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success text-success-foreground">Tasdiqlangan</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-warning-foreground">Kutilmoqda</Badge>;
      case 'rejected':
        return <Badge className="bg-danger text-danger-foreground">Rad etilgan</Badge>;
      default:
        return <Badge variant="secondary">Noma'lum</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Davomat':
        return <Clock className="h-4 w-4" />;
      case 'Ish samaradorligi':
        return <CheckCircle className="h-4 w-4" />;
      case 'Intizom':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Jamoa ishi':
        return <Award className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filterRecords = (records: PenaltyRecord[], filter: typeof activeTab) => {
    switch (filter) {
      case 'penalties':
        return records.filter(record => record.type === 'penalty');
      case 'bonuses':
        return records.filter(record => record.type === 'bonus');
      default:
        return records;
    }
  };

  const handleAppealSubmit = () => {
    if (!appealReason.trim()) {
      toast.error('Murojaat sababini yozing');
      return;
    }

    toast.success('Murojaat yuborildi');
    setIsAppealModalOpen(false);
    setAppealReason('');
    setSelectedRecord(null);
  };

  const filteredRecords = filterRecords(mockRecords, activeTab);
  const attendanceProgress = monthlyStats.attendanceRate;

  return (
    <div className="p-4 space-y-4">
      {/* Monthly Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{monthlyStats.month}</span>
            <Badge 
              className={`${
                monthlyStats.netPoints >= 0 
                  ? 'bg-success text-success-foreground' 
                  : 'bg-danger text-danger-foreground'
              }`}
            >
              {monthlyStats.netPoints >= 0 ? '+' : ''}{monthlyStats.netPoints} ball
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Mukofotlar</span>
              </div>
              <div className="text-xl font-semibold text-success">+{monthlyStats.totalBonuses}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <TrendingDown className="h-4 w-4 text-danger" />
                <span className="text-sm font-medium">Jarimalar</span>
              </div>
              <div className="text-xl font-semibold text-danger">{monthlyStats.totalPenalties}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Davomat ko'rsatkichi</span>
              <span className="text-sm font-medium">{attendanceProgress}%</span>
            </div>
            <Progress value={attendanceProgress} className="h-2" />
            <div className="text-xs text-muted-foreground text-center">
              95% dan yuqori bo'lsa +5 bonus ball
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="text-xs">
                Barchasi
                <Badge variant="secondary" className="ml-1 text-xs">
                  {mockRecords.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="penalties" className="text-xs">
                Jarimalar
                <Badge className="ml-1 text-xs bg-danger text-danger-foreground">
                  {mockRecords.filter(r => r.type === 'penalty').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="bonuses" className="text-xs">
                Mukofotlar
                <Badge className="ml-1 text-xs bg-success text-success-foreground">
                  {mockRecords.filter(r => r.type === 'bonus').length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Records List */}
      <div className="space-y-3">
        {filteredRecords.map((record) => (
          <Card key={record.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    record.type === 'bonus' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-danger/10 text-danger'
                  }`}>
                    {record.type === 'bonus' ? (
                      <Award className="h-5 w-5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`font-semibold ${
                        record.type === 'bonus' ? 'text-success' : 'text-danger'
                      }`}>
                        {record.points >= 0 ? '+' : ''}{record.points} ball
                      </span>
                      {getCategoryIcon(record.category)}
                      <span className="text-xs text-muted-foreground">{record.category}</span>
                    </div>
                    <p className="text-sm text-foreground mb-2">{record.reason}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(record.date), 'dd MMMM, HH:mm', { locale: uz })}
                        </span>
                      </div>
                      {getStatusBadge(record.status)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Tasdiqlagan: {record.approvedBy}</span>
                {record.appealable && record.type === 'penalty' && record.status === 'approved' && (
                  <Dialog open={isAppealModalOpen} onOpenChange={setIsAppealModalOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-xs h-6"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Murojaat
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Jarimaga murojaat</DialogTitle>
                        <DialogDescription>
                          Jarima to'g'ri emasligini hisoblasangiz, murojaat qilishingiz mumkin
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedRecord && (
                        <div className="space-y-4 py-4">
                          <div className="p-3 bg-muted rounded-lg">
                            <div className="text-sm font-medium mb-1">Jarima tafsilotlari</div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>Ball: {selectedRecord.points}</div>
                              <div>Sabab: {selectedRecord.reason}</div>
                              <div>Kategoriya: {selectedRecord.category}</div>
                              <div>
                                Sana: {format(new Date(selectedRecord.date), 'dd MMMM yyyy, HH:mm', { locale: uz })}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="appeal-reason">Murojaat sababi</Label>
                            <Textarea
                              id="appeal-reason"
                              value={appealReason}
                              onChange={(e) => setAppealReason(e.target.value)}
                              placeholder="Nima uchun bu jarima noto'g'ri ekanligini tushuntiring..."
                              rows={4}
                            />
                          </div>

                          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                            <div className="text-sm text-warning font-medium mb-1">
                              Diqqat
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Murojaat ko'rib chiqiladi va javob 3 ish kuni ichida beriladi. 
                              Yolg'on murojaat qo'shimcha jarima keltirib chiqarishi mumkin.
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsAppealModalOpen(false)}
                        >
                          Bekor qilish
                        </Button>
                        <Button 
                          onClick={handleAppealSubmit}
                          disabled={!appealReason.trim()}
                        >
                          Murojaat yuborish
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRecords.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              {activeTab === 'penalties' ? (
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              ) : activeTab === 'bonuses' ? (
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              ) : (
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              )}
              <div className="text-lg font-medium mb-2">
                {activeTab === 'penalties' && 'Jarima topilmadi'}
                {activeTab === 'bonuses' && 'Mukofot topilmadi'}
                {activeTab === 'all' && 'Yozuvlar topilmadi'}
              </div>
              <div className="text-sm text-muted-foreground">
                {activeTab === 'penalties' && 'Sizda hech qanday jarima yo\'q'}
                {activeTab === 'bonuses' && 'Hali mukofot olmagan ekansiz'}
                {activeTab === 'all' && 'Bu oyda hech qanday yozuv yo\'q'}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tips Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Award className="h-5 w-5 text-primary" />
            <span>Maslahatlar</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-success mt-0.5" />
              <span>Vaqtida kelish va ketish (+2 ball/hafta)</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-success mt-0.5" />
              <span>Vazifalarni muddatidan oldin tugallash (+5 ball)</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-success mt-0.5" />
              <span>Yangi g'oyalar taklif qilish (+3 ball)</span>
            </div>
            <div className="flex items-start space-x-2">
              <XCircle className="h-4 w-4 text-danger mt-0.5" />
              <span>Kechikish har 15 daqiqa uchun (-2 ball)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}