import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Camera, QrCode, MapPin, Loader2, Wifi } from 'lucide-react';

interface MethodContentProps {
  onCheckIn: () => void;
}

interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
  accuracy: number;
}

export function FaceMethodContent({ onCheckIn }: MethodContentProps) {
  return (
    <motion.div 
      className="text-center p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center relative"
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Camera className="w-12 h-12 text-primary" />
        <motion.div
          className="absolute inset-2 border-2 border-primary/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      
      <div className="text-lg font-medium mb-2">Yuzingizni kameraga ko'rsating</div>
      <div className="text-sm text-muted-foreground mb-6">
        Kamera yuzingizni tanish uchun to'g'ri nurda turing
      </div>
      
      <div className="space-y-4">
        <motion.div 
          className="bg-muted p-4 rounded-lg text-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-sm font-medium mb-2">Ko'rsatmalar:</div>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Kameraga to'g'ridan-to'g'ri qarang</li>
            <li>• Yetarli yorug'lik bo'lsin</li>
            <li>• Niqob yoki ko'zoynakni olib tashlang</li>
          </ul>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={onCheckIn} className="w-full" size="lg">
            <Camera className="h-5 w-5 mr-2" />
            Yuz orqali kirish
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function QRMethodContent({ onCheckIn }: MethodContentProps) {
  return (
    <motion.div 
      className="text-center p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center relative"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <QrCode className="w-12 h-12 text-primary" />
        <motion.div
          className="absolute top-2 left-2 right-2 h-0.5 bg-primary/50"
          animate={{ y: [0, 80, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      
      <div className="text-lg font-medium mb-2">QR kodni skanerlang</div>
      <div className="text-sm text-muted-foreground mb-6">
        Ish joyingizdagi QR kodni telefon kamerasi bilan skanerlang
      </div>
      
      <div className="space-y-4">
        <motion.div 
          className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border relative overflow-hidden"
          whileHover={{ borderColor: 'rgb(37 99 235)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center relative z-10">
            <QrCode className="w-16 h-16 mx-auto mb-2 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">QR kod skaneri</div>
          </div>
          
          {[
            { top: 0, left: 0 },
            { top: 0, right: 0 },
            { bottom: 0, left: 0 },
            { bottom: 0, right: 0 }
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 border-2 border-primary"
              style={pos}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
        
        <Button onClick={onCheckIn} className="w-full" size="lg">
          <QrCode className="h-5 w-5 mr-2" />
          QR skaner ochish
        </Button>
      </div>
    </motion.div>
  );
}

interface GPSMethodContentProps extends MethodContentProps {
  location: LocationInfo | null;
}

export function GPSMethodContent({ onCheckIn, location }: GPSMethodContentProps) {
  return (
    <motion.div 
      className="text-center p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center relative"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <MapPin className="w-12 h-12 text-primary" />
        
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-2 border-primary/20 rounded-full"
            animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
          />
        ))}
      </motion.div>
      
      <div className="text-lg font-medium mb-2">GPS joylashuvni tasdiqlang</div>
      <div className="text-sm text-muted-foreground mb-6">
        Ish joyingizdagi GPS koordinatalaringiz tekshirilmoqda
      </div>
      
      <AnimatePresence>
        {location ? (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="text-left">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Joylashuv:</span>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <Badge variant="secondary" className="gap-1">
                        <Wifi className="h-3 w-3" />
                        {location.accuracy}m aniqlik
                      </Badge>
                    </motion.div>
                  </div>
                  <div className="text-sm text-muted-foreground">{location.address}</div>
                  <div className="text-xs text-muted-foreground">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <motion.div 
              className="bg-muted p-4 rounded-lg"
              animate={{ backgroundColor: ['rgb(248 250 252)', 'rgb(34 197 94 / 0.1)', 'rgb(248 250 252)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  className="w-2 h-2 bg-success rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-sm">Ish joyiga yaqinsiz</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={onCheckIn} className="w-full" size="lg">
                <MapPin className="h-5 w-5 mr-2" />
                GPS orqali kirish
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-8"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <div className="text-sm text-muted-foreground">Joylashuv aniqlanmoqda...</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}