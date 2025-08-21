import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { 
  Moon,
  Sun,
  Bell,
  Shield,
  Globe,
  User,
  HelpCircle,
  LogOut,
  ChevronRight,
  Settings,
  Lock,
  Smartphone,
  Volume2,
  Eye,
  Database
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';

interface MobileSettingsProps {
  kpiData: any;
  userProfile: any;
  onDataUpdate: (data: any) => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export function MobileSettings({ 
  kpiData, 
  userProfile, 
  onDataUpdate, 
  isDark, 
  onThemeToggle 
}: MobileSettingsProps) {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
    attendance: true,
    tasks: true,
    penalties: false
  });

  const [privacy, setPrivacy] = useState({
    showOnlineStatus: true,
    shareLocation: false,
    publicProfile: false
  });

  type SettingsItem = {
    icon: any;
    label: string;
    description: string;
    action?: () => void;
    hasArrow?: boolean;
    badge?: string;
    control?: React.ReactNode;
  };

  const settingsSections: { title: string; items: SettingsItem[] }[] = [
    {
      title: 'Profil',
      items: [
        {
          icon: User,
          label: 'Shaxsiy ma\'lumotlar',
          description: 'Ism, rasm va boshqa ma\'lumotlar',
          action: () => {},
          hasArrow: true
        },
        {
          icon: Shield,
          label: 'Xavfsizlik',
          description: 'Parol, 2FA, login tarixi',
          action: () => {},
          hasArrow: true
        }
      ]
    },
    {
      title: 'Ilovaning ko\'rinishi',
      items: [
        {
          icon: isDark ? Moon : Sun,
          label: 'Qorong\'u rejim',
          description: 'Ko\'zni yengillatuvchi qorong\'u interfeys',
          control: (
            <Switch
              checked={isDark}
              onCheckedChange={onThemeToggle}
            />
          )
        },
        {
          icon: Globe,
          label: 'Til',
          description: 'O\'zbek tili',
          action: () => {},
          hasArrow: true
        }
      ]
    },
    {
      title: 'Bildirishnomalar',
      items: [
        {
          icon: Bell,
          label: 'Push bildirishnomalar',
          description: 'Telefonda bildirishnomalar',
          control: (
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, push: checked }))
              }
            />
          )
        },
        {
          icon: Volume2,
          label: 'Ovozli bildirishnomalar',
          description: 'Muhim hodisalar uchun ovoz',
          control: (
            <Switch
              checked={notifications.sms}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, sms: checked }))
              }
            />
          )
        }
      ]
    },
    {
      title: 'Maxfiylik',
      items: [
        {
          icon: Eye,
          label: 'Onlayn holatni ko\'rsatish',
          description: 'Boshqalar sizning onlayn ekanligingizni ko\'radi',
          control: (
            <Switch
              checked={privacy.showOnlineStatus}
              onCheckedChange={(checked) => 
                setPrivacy(prev => ({ ...prev, showOnlineStatus: checked }))
              }
            />
          )
        },
        {
          icon: Database,
          label: 'Ma\'lumotlarni saqlash',
          description: 'Mahalliy ma\'lumotlar va kesh',
          action: () => {},
          hasArrow: true
        }
      ]
    },
    {
      title: 'Yordam va qo\'llab-quvvatlash',
      items: [
        {
          icon: HelpCircle,
          label: 'Yordam markazi',
          description: 'FAQ va foydalanuvchi qo\'llanmasi',
          action: () => {},
          hasArrow: true
        },
        {
          icon: Smartphone,
          label: 'Ilovaning versiyasi',
          description: 'v2.1.0 (Build 2024080901)',
          action: () => {},
          badge: 'Yangi'
        }
      ]
    }
  ];

  return (
    <div className="boshqaruv-container space-6">
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {userProfile.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold text-foreground">{userProfile.name}</h2>
                <p className="text-sm text-muted-foreground">{userProfile.role}</p>
                <Badge variant="secondary" className="mt-2">
                  {userProfile.status === 'online' ? 'Onlayn' : 'Oflayn'}
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6 mb-8">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (sectionIndex + 1) * 0.1 }}
          >
            <h3 className="font-medium text-foreground mb-3">{section.title}</h3>
            <Card>
              <CardContent className="p-0">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={itemIndex}
                      className={`flex items-center space-x-4 p-4 ${
                        itemIndex < section.items.length - 1 ? 'border-b border-border' : ''
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-foreground">{item.label}</h4>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="flex items-center">
                        {item.control}
                        {item.hasArrow && (
                          <Button variant="ghost" size="sm" onClick={item.action}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Advanced Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-6"
      >
        <h3 className="font-medium text-foreground mb-3">Qo'shimcha</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-3" />
            Tizim sozlamalari
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Lock className="h-4 w-4 mr-3" />
            Xavfsizlik markazí
          </Button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-8"
      >
        <h3 className="font-medium text-foreground mb-3">Xavfli zona</h3>
        <Card className="border-destructive/20">
          <CardContent className="p-4">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => {
                // Implement logout logic
                console.log('Logging out...');
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Akkauntdan chiqish
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-center text-xs text-muted-foreground mb-8"
      >
        <p>Boshqaruv v2.1.0</p>
        <p>© 2024 Boshqaruv. Barcha huquqlar himoyalangan.</p>
      </motion.div>
    </div>
  );
}