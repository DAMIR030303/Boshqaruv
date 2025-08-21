import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { 
  Camera, 
  QrCode, 
  MapPin, 
  Clock,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { StatusAnimation } from './CheckInAnimations';
import { FaceMethodContent, QRMethodContent, GPSMethodContent } from './CheckInMethods';

type CheckInMethod = 'face' | 'qr' | 'gps';
type CheckInStatus = 'idle' | 'processing' | 'success' | 'error';

interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
  accuracy: number;
}

interface EnhancedCheckInScreenProps {
  onCheckInSuccess?: () => void;
}

const SCHEDULE_ITEMS = [
  { icon: Clock, title: 'Ish boshlanishi', subtitle: 'Ertalabki smena', time: '09:00', color: 'bg-primary/5 text-primary' },
  { icon: Clock, title: 'Tushlik tanaffusi', subtitle: '1 soat', time: '12:00 - 13:00', color: 'bg-muted/50' },
  { icon: Clock, title: 'Ish tugashi', subtitle: 'Ertalabki smena', time: '18:00', color: 'bg-muted/50' }
];

export function EnhancedCheckInScreen({ onCheckInSuccess }: EnhancedCheckInScreenProps) {
  const [activeMethod, setActiveMethod] = useState<CheckInMethod>('face');
  const [checkInStatus, setCheckInStatus] = useState<CheckInStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [exceptionType, setExceptionType] = useState<string>('');
  const [exceptionReason, setExceptionReason] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');

  // Mock location detection
  useEffect(() => {
    if (activeMethod === 'gps') {
      setTimeout(() => {
        setLocation({
          latitude: 41.311151,
          longitude: 69.279737,
          address: 'Amir Temur shoh ko\'chasi, Toshkent',
          accuracy: 15
        });
      }, 1000);
    }
  }, [activeMethod]);

  // Simulate connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.1 ? 'online' : 'offline');
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = useCallback(async () => {
    if (connectionStatus === 'offline') {
      toast.error('Internet aloqasi yo\'q, qaytadan urinib ko\'ring');
      return;
    }

    setCheckInStatus('processing');
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          const isSuccess = Math.random() > 0.15;
          
          setTimeout(() => {
            setCheckInStatus(isSuccess ? 'success' : 'error');
            if (isSuccess) {
              setTimeout(() => onCheckInSuccess?.(), 1500);
            }
          }, 300);
          
          return 100;
        }
        
        const increment = prev < 20 ? 5 : prev > 80 ? 2 : 8;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(progressInterval);
  }, [connectionStatus, onCheckInSuccess]);

  const handleReset = useCallback(() => {
    setCheckInStatus('idle');
    setProgress(0);
  }, []);

  const handleExceptionSubmit = useCallback(() => {
    if (!exceptionType || !exceptionReason) {
      toast.error('Barcha maydonlarni to\'ldiring');
      return;
    }

    toast.success('Istisno so\'rovi yuborildi', { duration: 3000 });
    setIsExceptionModalOpen(false);
    setExceptionType('');
    setExceptionReason('');
  }, [exceptionType, exceptionReason]);

  const getMethodIcon = (method: CheckInMethod) => {
    switch (method) {
      case 'face': return Camera;
      case 'qr': return QrCode;
      case 'gps': return MapPin;
    }
  };

  const getMethodText = (method: CheckInMethod) => {
    switch (method) {
      case 'face': return 'Yuz orqali';
      case 'qr': return 'QR kod';
      case 'gps': return 'GPS joylashuv';
    }
  };

  const renderMethodContent = () => {
    if (checkInStatus !== 'idle') {
      return (
        <StatusAnimation
          status={checkInStatus}
          progress={progress}
          onReset={handleReset}
          onOpenExceptionModal={() => setIsExceptionModalOpen(true)}
        />
      );
    }

    switch (activeMethod) {
      case 'face':
        return <FaceMethodContent onCheckIn={handleCheckIn} />;
      case 'qr':
        return <QRMethodContent onCheckIn={handleCheckIn} />;
      case 'gps':
        return <GPSMethodContent onCheckIn={handleCheckIn} location={location} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      {/* Connection Status */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={`flex items-center gap-2 text-xs p-2 rounded-lg ${
          connectionStatus === 'online' 
            ? 'bg-success/10 text-success' 
            : 'bg-danger/10 text-danger'
        }`}>
          {connectionStatus === 'online' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {connectionStatus === 'online' ? 'Onlayn' : 'Oflayn'}
        </div>
      </motion.div>

      <Card>
        <CardHeader>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardTitle className="text-center">Davomat belgilash</CardTitle>
            <div className="text-center text-sm text-muted-foreground">
              {new Date().toLocaleDateString('uz-UZ', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </div>
          </motion.div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeMethod} onValueChange={(value) => setActiveMethod(value as CheckInMethod)}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <TabsList className="grid w-full grid-cols-3">
                {(['face', 'qr', 'gps'] as CheckInMethod[]).map((method) => {
                  const Icon = getMethodIcon(method);
                  return (
                    <motion.div key={method} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <TabsTrigger 
                        value={method}
                        className="flex items-center space-x-2"
                        disabled={checkInStatus !== 'idle'}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{getMethodText(method)}</span>
                      </TabsTrigger>
                    </motion.div>
                  );
                })}
              </TabsList>
            </motion.div>

            <div className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMethod}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="face">{renderMethodContent()}</TabsContent>
                  <TabsContent value="qr">{renderMethodContent()}</TabsContent>
                  <TabsContent value="gps">{renderMethodContent()}</TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      {checkInStatus === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Bugungi jadval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {SCHEDULE_ITEMS.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${item.color}`}>
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4" />
                        <div>
                          <div className="text-sm font-medium">{item.title}</div>
                          <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">{item.time}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Exception Modal */}
      <Dialog open={isExceptionModalOpen} onOpenChange={setIsExceptionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Istisno so'rovi</DialogTitle>
            <DialogDescription>
              Agar texnik muammo yoki boshqa sabab bo'lsa, istisno so'rashingiz mumkin
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
                  <SelectItem value="technical">Texnik muammo</SelectItem>
                  <SelectItem value="business_trip">Xizmat safari</SelectItem>
                  <SelectItem value="justified_delay">Oqlangan kechikish</SelectItem>
                  <SelectItem value="emergency">Favqulodda holat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exception-reason">Sabab</Label>
              <Textarea
                id="exception-reason"
                value={exceptionReason}
                onChange={(e) => setExceptionReason(e.target.value)}
                placeholder="Istisno sababini batafsil yozing..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsExceptionModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={handleExceptionSubmit}>
              So'rov yuborish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}