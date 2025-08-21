import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { AlertTriangle, Bell, MessageCircle, Shield, Database, Check, X, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  telegramNotifications: boolean;
  pushNotifications: boolean;
  attendanceAlerts: boolean;
  taskDeadlines: boolean;
  systemUpdates: boolean;
  weeklyReports: boolean;
  notificationHours: {
    start: string;
    end: string;
  };
}

interface TelegramSettings {
  isLinked: boolean;
  botToken: string;
  chatId: string;
  username: string;
  lastSync: string;
}

interface StorageSettings {
  dataRetentionDays: number;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  autoCleanup: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  totalStorageUsed: number;
  totalStorageLimit: number;
}

export function SettingsPage() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    telegramNotifications: true,
    pushNotifications: true,
    attendanceAlerts: true,
    taskDeadlines: true,
    systemUpdates: false,
    weeklyReports: true,
    notificationHours: {
      start: '09:00',
      end: '18:00'
    }
  });

  const [telegram, setTelegram] = useState<TelegramSettings>({
    isLinked: true,
    botToken: '6123456789:AAGq2-QwErTyUiOpAsDfGhJkLzXcVbNmQwE',
    chatId: '-1001234567890',
    username: '@boshqaruv_bot',
    lastSync: '2024-12-20T10:30:00'
  });

  const [storage, setStorage] = useState<StorageSettings>({
    dataRetentionDays: 365,
    backupFrequency: 'weekly',
    autoCleanup: true,
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'],
    totalStorageUsed: 2.3,
    totalStorageLimit: 10
  });

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean | any) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleTelegramTest = () => {
    toast.success('Test xabar yuborildi');
  };

  const handleTelegramUnlink = () => {
    setTelegram(prev => ({ ...prev, isLinked: false, chatId: '', username: '' }));
    toast.success('Telegram bog\'lanishi uzildi');
  };

  const handleSaveSettings = () => {
    toast.success('Sozlamalar saqlandi');
  };

  const handleCleanupStorage = () => {
    toast.success('Eski fayllar tozalandi');
  };

  const storageUsagePercentage = (storage.totalStorageUsed / storage.totalStorageLimit) * 100;

  return (
    <div className="space-6">
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Bildirishnomalar
          </TabsTrigger>
          <TabsTrigger value="telegram" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Telegram
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Saqlash
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Bildirishnoma sozlamalari
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Types */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email bildirishnomalar</Label>
                    <div className="text-sm text-muted-foreground">
                      Muhim hodisalar haqida email orqali xabar
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS bildirishnomalar</Label>
                    <div className="text-sm text-muted-foreground">
                      Tezkor xabarlar uchun SMS
                    </div>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Telegram bildirishnomalar</Label>
                    <div className="text-sm text-muted-foreground">
                      Telegram bot orqali xabarlar
                    </div>
                  </div>
                  <Switch
                    checked={notifications.telegramNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('telegramNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push bildirishnomalar</Label>
                    <div className="text-sm text-muted-foreground">
                      Brauzer orqali bildirishnomalar
                    </div>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                  />
                </div>
              </div>

              <Separator />

              {/* Notification Categories */}
              <div className="space-y-4">
                <h4>Bildirishnoma turlari</h4>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Davomat ogohlantirishi</Label>
                    <div className="text-sm text-muted-foreground">
                      Kechikish va yo'qligiklar haqida
                    </div>
                  </div>
                  <Switch
                    checked={notifications.attendanceAlerts}
                    onCheckedChange={(checked) => handleNotificationChange('attendanceAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Vazifa muddat tugashi</Label>
                    <div className="text-sm text-muted-foreground">
                      Vazifa muddati tugashidan oldin
                    </div>
                  </div>
                  <Switch
                    checked={notifications.taskDeadlines}
                    onCheckedChange={(checked) => handleNotificationChange('taskDeadlines', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Tizim yangilanishlari</Label>
                    <div className="text-sm text-muted-foreground">
                      Yangi xususiyatlar va o'zgarishlar
                    </div>
                  </div>
                  <Switch
                    checked={notifications.systemUpdates}
                    onCheckedChange={(checked) => handleNotificationChange('systemUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Haftalik hisobotlar</Label>
                    <div className="text-sm text-muted-foreground">
                      Dushanba kuni avtomatik hisobot
                    </div>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => handleNotificationChange('weeklyReports', checked)}
                  />
                </div>
              </div>

              <Separator />

              {/* Notification Hours */}
              <div className="space-y-4">
                <h4>Bildirishnoma vaqti</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Boshlanish vaqti</Label>
                    <Input
                      type="time"
                      value={notifications.notificationHours.start}
                      onChange={(e) => handleNotificationChange('notificationHours', {
                        ...notifications.notificationHours,
                        start: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tugash vaqti</Label>
                    <Input
                      type="time"
                      value={notifications.notificationHours.end}
                      onChange={(e) => handleNotificationChange('notificationHours', {
                        ...notifications.notificationHours,
                        end: e.target.value
                      })}
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Ushbu vaqt oralig'ida bildirishnomalar yuboriladi
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  Saqlash
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Telegram Tab */}
        <TabsContent value="telegram" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Telegram integratsiyasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {telegram.isLinked ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-success-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">Telegram bog'langan</div>
                        <div className="text-sm text-muted-foreground">
                          {telegram.username}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-success text-success-foreground">Faol</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bot Token</Label>
                      <Input
                        type="password"
                        value={telegram.botToken}
                        onChange={(e) => setTelegram(prev => ({ ...prev, botToken: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Chat ID</Label>
                      <Input
                        value={telegram.chatId}
                        onChange={(e) => setTelegram(prev => ({ ...prev, chatId: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Bot Username</Label>
                    <div className="flex gap-2">
                      <Input
                        value={telegram.username}
                        onChange={(e) => setTelegram(prev => ({ ...prev, username: e.target.value }))}
                      />
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Oxirgi sinxronizatsiya: {new Date(telegram.lastSync).toLocaleString('uz-UZ')}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleTelegramTest}>
                      Test xabar
                    </Button>
                    <Button variant="outline" onClick={handleSaveSettings}>
                      Saqlash
                    </Button>
                    <Button variant="outline" onClick={handleTelegramUnlink} className="text-danger hover:text-danger">
                      <X className="h-4 w-4 mr-2" />
                      Bog'lanishni uzish
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted-foreground rounded-full flex items-center justify-center">
                        <X className="h-5 w-5 text-muted" />
                      </div>
                      <div>
                        <div className="font-medium">Telegram bog'lanmagan</div>
                        <div className="text-sm text-muted-foreground">
                          Bot orqali bildirishnomalar olish uchun ulang
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">Nofaol</Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Bot Token</Label>
                      <Input
                        placeholder="1234567890:AABbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqR"
                        value={telegram.botToken}
                        onChange={(e) => setTelegram(prev => ({ ...prev, botToken: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Chat ID</Label>
                      <Input
                        placeholder="-1001234567890"
                        value={telegram.chatId}
                        onChange={(e) => setTelegram(prev => ({ ...prev, chatId: e.target.value }))}
                      />
                    </div>

                    <div className="p-4 bg-primary/10 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium">Telegram botni qanday sozlash:</div>
                          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>@BotFather bilan yangi bot yarating</li>
                            <li>Bot tokenini nusxalang va yuqoriga qo'ying</li>
                            <li>Botni guruhingizga qo'shing</li>
                            <li>Chat ID ni oling va qo'ying</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setTelegram(prev => ({ ...prev, isLinked: true }))}
                      disabled={!telegram.botToken || !telegram.chatId}
                    >
                      Telegram ni ulash
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storage Tab */}
        <TabsContent value="storage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Saqlash sozlamalari
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Storage Usage */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4>Saqlash xajmi</h4>
                    <div className="text-sm text-muted-foreground">
                      {storage.totalStorageUsed} GB / {storage.totalStorageLimit} GB ishlatilgan
                    </div>
                  </div>
                  <Badge variant={storageUsagePercentage > 80 ? 'destructive' : 'secondary'}>
                    {storageUsagePercentage.toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={storageUsagePercentage} className="h-2" />
                {storageUsagePercentage > 80 && (
                  <div className="flex items-center gap-2 text-warning">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Saqlash xajmi tugamoqda</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Data Retention */}
              <div className="space-y-4">
                <h4>Ma'lumotlarni saqlash</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ma'lumotni saqlash muddati (kun)</Label>
                    <Select 
                      value={storage.dataRetentionDays.toString()} 
                      onValueChange={(value) => setStorage(prev => ({ ...prev, dataRetentionDays: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 kun</SelectItem>
                        <SelectItem value="90">90 kun</SelectItem>
                        <SelectItem value="180">180 kun</SelectItem>
                        <SelectItem value="365">1 yil</SelectItem>
                        <SelectItem value="730">2 yil</SelectItem>
                        <SelectItem value="1095">3 yil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Zaxira nusxa chastotasi</Label>
                    <Select 
                      value={storage.backupFrequency} 
                      onValueChange={(value) => setStorage(prev => ({ ...prev, backupFrequency: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Har kuni</SelectItem>
                        <SelectItem value="weekly">Har hafta</SelectItem>
                        <SelectItem value="monthly">Har oy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Avtomatik tozalash</Label>
                    <div className="text-sm text-muted-foreground">
                      Eski fayllarni avtomatik o'chirish
                    </div>
                  </div>
                  <Switch
                    checked={storage.autoCleanup}
                    onCheckedChange={(checked) => setStorage(prev => ({ ...prev, autoCleanup: checked }))}
                  />
                </div>
              </div>

              <Separator />

              {/* File Settings */}
              <div className="space-y-4">
                <h4>Fayl sozlamalari</h4>
                
                <div className="space-y-2">
                  <Label>Maksimal fayl hajmi (MB)</Label>
                  <Select 
                    value={storage.maxFileSize.toString()} 
                    onValueChange={(value) => setStorage(prev => ({ ...prev, maxFileSize: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 MB</SelectItem>
                      <SelectItem value="10">10 MB</SelectItem>
                      <SelectItem value="25">25 MB</SelectItem>
                      <SelectItem value="50">50 MB</SelectItem>
                      <SelectItem value="100">100 MB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ruxsat etilgan fayl turlari</Label>
                  <div className="flex flex-wrap gap-2">
                    {storage.allowedFileTypes.map((type) => (
                      <Badge key={type} variant="secondary" className="gap-1">
                        {type.toUpperCase()}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => setStorage(prev => ({
                            ...prev,
                            allowedFileTypes: prev.allowedFileTypes.filter(t => t !== type)
                          }))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleCleanupStorage}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eski fayllarni tozalash
                </Button>
                <Button onClick={handleSaveSettings}>
                  Saqlash
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}