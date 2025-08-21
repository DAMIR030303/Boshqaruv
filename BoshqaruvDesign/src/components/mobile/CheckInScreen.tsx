import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Camera, 
  QrCode, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2,
  Clock,
  FileText,
  Plane,
  Car
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

type CheckInMethod = 'face' | 'qr' | 'gps';
type CheckInStatus = 'idle' | 'processing' | 'success' | 'error';

interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
  accuracy: number;
}

export function CheckInScreen() {
  const [activeMethod, setActiveMethod] = useState<CheckInMethod>('face');
  const [checkInStatus, setCheckInStatus] = useState<CheckInStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [exceptionType, setExceptionType] = useState<string>('');
  const [exceptionReason, setExceptionReason] = useState('');

  // Mock location detection
  useEffect(() => {
    if (activeMethod === 'gps') {
      setLocation({
        latitude: 41.311151,
        longitude: 69.279737,
        address: 'Amir Temur shoh ko\'chasi, Toshkent',
        accuracy: 15
      });
    }
  }, [activeMethod]);

  const handleCheckIn = async () => {
    setCheckInStatus('processing');
    setProgress(0);

    // Simulate processing with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulate random success/failure
          const isSuccess = Math.random() > 0.2;
          setCheckInStatus(isSuccess ? 'success' : 'error');
          
          if (isSuccess) {
            toast.success('Davomat muvaffaqiyatli qayd etildi');
          } else {
            toast.error('Xatolik yuz berdi, qaytadan urinib ko\'ring');
          }
          
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(interval);
  };

  const handleReset = () => {
    setCheckInStatus('idle');
    setProgress(0);
  };

  const handleExceptionSubmit = () => {
    if (!exceptionType || !exceptionReason) {
      toast.error('Barcha maydonlarni to\'ldiring');
      return;
    }

    toast.success('Istisno so\'rovi yuborildi');
    setIsExceptionModalOpen(false);
    setExceptionType('');
    setExceptionReason('');
  };

  const getMethodIcon = (method: CheckInMethod) => {
    switch (method) {
      case 'face':
        return Camera;
      case 'qr':
        return QrCode;
      case 'gps':
        return MapPin;
    }
  };

  const getMethodText = (method: CheckInMethod) => {
    switch (method) {
      case 'face':
        return 'Yuz orqali';
      case 'qr':
        return 'QR kod';
      case 'gps':
        return 'GPS joylashuv';
    }
  };

  const renderStatusAnimation = () => {
    return (
      <AnimatePresence mode="wait">
        {checkInStatus === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center p-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <Loader2 className="w-16 h-16 text-primary" />
            </motion.div>
            <div className="text-lg font-medium mb-2">Tekshirilmoqda...</div>
            <Progress value={progress} className="w-full h-2 mb-2" />
            <div className="text-sm text-muted-foreground">{progress}%</div>
          </motion.div>
        )}

        {checkInStatus === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 bg-success rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-success-foreground" />
            </motion.div>
            <div className="text-lg font-medium text-success mb-2">Muvaffaqiyatli!</div>
            <div className="text-sm text-muted-foreground mb-4">
              Davomat qayd etildi - {new Date().toLocaleTimeString('uz-UZ')}
            </div>
            <Button onClick={handleReset} variant="outline">
              Orqaga
            </Button>
          </motion.div>
        )}

        {checkInStatus === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 bg-danger rounded-full flex items-center justify-center"
            >
              <XCircle className="w-8 h-8 text-danger-foreground" />
            </motion.div>
            <div className="text-lg font-medium text-danger mb-2">Xatolik yuz berdi</div>
            <div className="text-sm text-muted-foreground mb-4">
              Iltimos, qaytadan urinib ko'ring yoki boshqa usulni tanlang
            </div>
            <div className="space-y-2">
              <Button onClick={handleReset} variant="outline" className="w-full">
                Qaytadan urinish
              </Button>
              <Dialog open={isExceptionModalOpen} onOpenChange={setIsExceptionModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Istisno so'rash
                  </Button>
                </DialogTrigger>
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
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const renderMethodContent = () => {
    if (checkInStatus !== 'idle') {
      return renderStatusAnimation();
    }

    switch (activeMethod) {
      case 'face':
        return (
          <div className="text-center p-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-primary" />
            </div>
            <div className="text-lg font-medium mb-2">Yuzingizni kameraga ko'rsating</div>
            <div className="text-sm text-muted-foreground mb-6">
              Kamera yuzingizni tanish uchun to'g'ri nurda turing
            </div>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm font-medium mb-2">Ko'rsatmalar:</div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Kameraga to'g'ridan-to'g'ri qarang</li>
                  <li>• Yetarli yorug'lik bo'lsin</li>
                  <li>• Niqob yoki ko'zoynakni olib tashlang</li>
                </ul>
              </div>
              <Button onClick={handleCheckIn} className="w-full" size="lg">
                <Camera className="h-5 w-5 mr-2" />
                Yuz orqali kirish
              </Button>
            </div>
          </div>
        );

      case 'qr':
        return (
          <div className="text-center p-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <QrCode className="w-12 h-12 text-primary" />
            </div>
            <div className="text-lg font-medium mb-2">QR kodni skanerlang</div>
            <div className="text-sm text-muted-foreground mb-6">
              Ish joyingizdagi QR kodni telefon kamerasi bilan skanerlang
            </div>
            <div className="space-y-4">
              <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center">
                  <QrCode className="w-16 h-16 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">QR kod skaneri</div>
                </div>
              </div>
              <Button onClick={handleCheckIn} className="w-full" size="lg">
                <QrCode className="h-5 w-5 mr-2" />
                QR skaner ochish
              </Button>
            </div>
          </div>
        );

      case 'gps':
        return (
          <div className="text-center p-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="w-12 h-12 text-primary" />
            </div>
            <div className="text-lg font-medium mb-2">GPS joylashuvni tasdiqlang</div>
            <div className="text-sm text-muted-foreground mb-6">
              Ish joyingizdagi GPS koordinatalaringiz tekshirilmoqda
            </div>
            
            {location && (
              <div className="space-y-4">
                <Card className="text-left">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Joylashuv:</span>
                        <Badge variant="secondary">
                          {location.accuracy}m aniqlik
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {location.address}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="text-sm">Ish joyiga yaqinsiz</span>
                  </div>
                </div>

                <Button onClick={handleCheckIn} className="w-full" size="lg">
                  <MapPin className="h-5 w-5 mr-2" />
                  GPS orqali kirish
                </Button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Davomat belgilash</CardTitle>
          <div className="text-center text-sm text-muted-foreground">
            {new Date().toLocaleDateString('uz-UZ', { 
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeMethod} onValueChange={(value) => setActiveMethod(value as CheckInMethod)}>
            <TabsList className="grid w-full grid-cols-3">
              {(['face', 'qr', 'gps'] as CheckInMethod[]).map((method) => {
                const Icon = getMethodIcon(method);
                return (
                  <TabsTrigger 
                    key={method} 
                    value={method}
                    className="flex items-center space-x-2"
                    disabled={checkInStatus !== 'idle'}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{getMethodText(method)}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="mt-6">
              <TabsContent value="face">
                {renderMethodContent()}
              </TabsContent>
              <TabsContent value="qr">
                {renderMethodContent()}
              </TabsContent>
              <TabsContent value="gps">
                {renderMethodContent()}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      {checkInStatus === 'idle' && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Bugungi jadval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Ish boshlanishi</div>
                    <div className="text-xs text-muted-foreground">Ertalabki smena</div>
                  </div>
                </div>
                <div className="text-sm font-medium">09:00</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Tushlik tanaffusi</div>
                    <div className="text-xs text-muted-foreground">1 soat</div>
                  </div>
                </div>
                <div className="text-sm font-medium">12:00 - 13:00</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Ish tugashi</div>
                    <div className="text-xs text-muted-foreground">Ertalabki smena</div>
                  </div>
                </div>
                <div className="text-sm font-medium">18:00</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}