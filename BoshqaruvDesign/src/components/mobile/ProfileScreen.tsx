import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Lock, 
  MessageCircle, 
  Bell,
  LogOut,
  Edit2,
  Camera,
  Check,
  X,
  Shield,
  Calendar,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';

interface ProfileScreenProps {
  onBack: () => void;
}

interface UserProfile {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  joinDate: string;
  employeeId: string;
  workingHours: string;
}

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

interface TelegramSettings {
  isLinked: boolean;
  username: string;
  chatId: string;
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const [userProfile] = useState<UserProfile>({
    id: '1',
    name: 'Alisher Fayzullayev',
    position: 'Frontend Developer',
    department: 'IT bo\'limi',
    email: 'alisher.fayzullayev@boshqaruv.uz',
    phone: '+998 90 123 45 67',
    address: 'Toshkent, Yunusobod tumani',
    avatar: '/api/placeholder/80/80',
    joinDate: '2023-03-15',
    employeeId: 'EMP001',
    workingHours: '09:00 - 18:00'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const [telegram, setTelegram] = useState<TelegramSettings>({
    isLinked: true,
    username: '@alisher_dev',
    chatId: '123456789'
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [telegramForm, setTelegramForm] = useState({
    phoneNumber: '',
    verificationCode: ''
  });

  const handlePasswordChange = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Barcha maydonlarni to\'ldiring');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Yangi parollar mos kelmaydi');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    toast.success('Parol muvaffaqiyatli o\'zgartirildi');
    setIsPasswordModalOpen(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleTelegramLink = () => {
    if (!telegramForm.phoneNumber) {
      toast.error('Telefon raqamini kiriting');
      return;
    }

    toast.success('Tasdiqlash kodi yuborildi');
    // In real app, would send verification code
  };

  const handleTelegramVerify = () => {
    if (!telegramForm.verificationCode) {
      toast.error('Tasdiqlash kodini kiriting');
      return;
    }

    setTelegram({
      isLinked: true,
      username: '@alisher_dev',
      chatId: '123456789'
    });
    
    toast.success('Telegram muvaffaqiyatli ulandi');
    setIsTelegramModalOpen(false);
    setTelegramForm({
      phoneNumber: '',
      verificationCode: ''
    });
  };

  const handleTelegramUnlink = () => {
    setTelegram({
      isLinked: false,
      username: '',
      chatId: ''
    });
    toast.success('Telegram bog\'lanishi uzildi');
  };

  const handleLogout = () => {
    toast.success('Tizimdan chiqdingiz');
    setIsLogoutModalOpen(false);
    onBack();
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success('Bildirishnoma sozlamalari saqlandi');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                <AvatarFallback>
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold">{userProfile.name}</h2>
              <p className="text-muted-foreground">{userProfile.position}</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <Badge variant="secondary">{userProfile.employeeId}</Badge>
                <Badge variant="outline">{userProfile.department}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Shaxsiy ma'lumotlar</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <div className="text-sm font-medium">Email</div>
              <div className="text-sm text-muted-foreground">{userProfile.email}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <div className="text-sm font-medium">Telefon</div>
              <div className="text-sm text-muted-foreground">{userProfile.phone}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <div className="text-sm font-medium">Manzil</div>
              <div className="text-sm text-muted-foreground">{userProfile.address}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <div className="text-sm font-medium">Ishga kirgan sana</div>
              <div className="text-sm text-muted-foreground">
                {new Date(userProfile.joinDate).toLocaleDateString('uz-UZ')}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <div className="text-sm font-medium">Ish vaqti</div>
              <div className="text-sm text-muted-foreground">{userProfile.workingHours}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Xavfsizlik</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Lock className="h-4 w-4 mr-2" />
                Parolni o'zgartirish
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Parolni o'zgartirish</DialogTitle>
                <DialogDescription>
                  Hisobingiz xavfsizligi uchun kuchli parol tanlang
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Joriy parol</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Joriy parolingizni kiriting"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Yangi parol</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Yangi parolni kiriting"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Parolni tasdiqlang</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Yangi parolni qayta kiriting"
                  />
                </div>

                <div className="bg-muted p-3 rounded-lg">
                  <div className="text-sm font-medium mb-1">Parol talablari:</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Kamida 6 ta belgi</li>
                    <li>• Katta va kichik harflar</li>
                    <li>• Kamida bitta raqam</li>
                    <li>• Maxsus belgilar tavsiya etiladi</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
                  Bekor qilish
                </Button>
                <Button onClick={handlePasswordChange}>
                  Parolni o'zgartirish
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Telegram Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Telegram</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {telegram.isLinked ? (
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-success-foreground" />
                </div>
                <div>
                  <div className="text-sm font-medium">Ulangan</div>
                  <div className="text-xs text-muted-foreground">{telegram.username}</div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleTelegramUnlink}>
                <X className="h-4 w-4 mr-1" />
                Uzish
              </Button>
            </div>
          ) : (
            <Dialog open={isTelegramModalOpen} onOpenChange={setIsTelegramModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Telegram ni ulash
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Telegram ni ulash</DialogTitle>
                  <DialogDescription>
                    Bildirishnomalar olish uchun Telegram hisobingizni ulang
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone-number">Telefon raqam</Label>
                    <Input
                      id="phone-number"
                      type="tel"
                      value={telegramForm.phoneNumber}
                      onChange={(e) => setTelegramForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="+998 90 123 45 67"
                    />
                  </div>

                  {telegramForm.phoneNumber && (
                    <div className="space-y-2">
                      <Label htmlFor="verification-code">Tasdiqlash kodi</Label>
                      <Input
                        id="verification-code"
                        value={telegramForm.verificationCode}
                        onChange={(e) => setTelegramForm(prev => ({ ...prev, verificationCode: e.target.value }))}
                        placeholder="6 raqamli kod"
                        maxLength={6}
                      />
                      <div className="text-xs text-muted-foreground">
                        Telegram botiga yuborilgan kodni kiriting
                      </div>
                    </div>
                  )}

                  <div className="bg-primary/10 p-3 rounded-lg">
                    <div className="text-sm font-medium mb-1">Ko'rsatma:</div>
                    <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>@BoshqaruvBot ni topib, /start bosing</li>
                      <li>Telefon raqamingizni kiriting</li>
                      <li>Tasdiqlash kodini shu yerga kiriting</li>
                    </ol>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsTelegramModalOpen(false)}>
                    Bekor qilish
                  </Button>
                  {!telegramForm.verificationCode ? (
                    <Button onClick={handleTelegramLink} disabled={!telegramForm.phoneNumber}>
                      Kod yuborish
                    </Button>
                  ) : (
                    <Button onClick={handleTelegramVerify}>
                      Tasdiqlash
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Bildirishnomalar</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Push bildirishnomalar</div>
              <div className="text-xs text-muted-foreground">Telefonda bildirishnomalar</div>
            </div>
            <Switch
              checked={notifications.pushNotifications}
              onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Email bildirishnomalar</div>
              <div className="text-xs text-muted-foreground">Email orqali xabarlar</div>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">SMS bildirishnomalar</div>
              <div className="text-xs text-muted-foreground">SMS orqali xabarlar</div>
            </div>
            <Switch
              checked={notifications.smsNotifications}
              onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card>
        <CardContent className="p-4">
          <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-danger hover:text-danger">
                <LogOut className="h-4 w-4 mr-2" />
                Tizimdan chiqish
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tizimdan chiqish</DialogTitle>
                <DialogDescription>
                  Haqiqatan ham tizimdan chiqmoqchimisiz?
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <div className="text-sm text-warning">
                    Tizimdan chiqqan holda, qaytadan kirish uchun login va parolingizni kiritishingiz kerak bo'ladi.
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsLogoutModalOpen(false)}>
                  Bekor qilish
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Chiqish
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* App Version */}
      <div className="text-center text-xs text-muted-foreground py-4">
        Boshqaruv Mobile v1.0.0
      </div>
    </div>
  );
}