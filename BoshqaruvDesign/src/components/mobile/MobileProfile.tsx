import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Award,
  Clock,
  TrendingUp,
  Users,
  Target,
  Star,
  LogOut
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';

interface MobileProfileProps {
  kpiData: any;
  userProfile: {
    name: string;
    role: string;
    avatar: string;
    status: string;
  };
  onDataUpdate: (data: any) => void;
  onProfileUpdate: (profile: any) => void;
  onLogout?: () => void;
}

const performanceData = [
  { month: 'Yan', score: 85 },
  { month: 'Fev', score: 88 },
  { month: 'Mar', score: 92 },
  { month: 'Apr', score: 87 },
  { month: 'May', score: 95 },
  { month: 'Iyun', score: 91 },
  { month: 'Iyul', score: 94 },
  { month: 'Avg', score: 96 }
];

// Marketing specific achievements
const getMarketingAchievements = () => [
  {
    id: 1,
    title: 'Kontent ustasi',
    description: 'Haftalik 100+ post yaratish',
    icon: Target,
    earned: true,
    date: '2024-08-15'
  },
  {
    id: 2,
    title: 'Engagement champion',
    description: '10% dan yuqori engagement',
    icon: TrendingUp,
    earned: true,
    date: '2024-07-20'
  },
  {
    id: 3,
    title: 'AI innovator',
    description: 'AI yordamida 500+ caption',
    icon: Star,
    earned: true,
    date: '2024-06-10'
  },
  {
    id: 4,
    title: 'Video master',
    description: '1000+ reels yaratish',
    icon: Users,
    earned: false,
    date: null
  }
];

// Marketing specific stats
const getMarketingStats = () => [
  {
    label: 'Jami postlar',
    value: '1,247',
    icon: Target,
    change: '+89 bu oy'
  },
  {
    label: 'O\'rtacha engagement',
    value: '8.5%',
    icon: TrendingUp,
    change: '+1.2% o\'sish'
  },
  {
    label: 'Followers o\'sishi',
    value: '+567',
    icon: Users,
    change: 'Bu oyda'
  },
  {
    label: 'Video ko\'rishlar',
    value: '45.2K',
    icon: Clock,
    change: 'Haftalik'
  }
];

const defaultAchievements = [
  {
    id: 1,
    title: 'Vaqtni boshqarish ustasi',
    description: '3 oy ketma-ket kechikmaslik',
    icon: Clock,
    earned: true,
    date: '2024-07-15'
  },
  {
    id: 2,
    title: 'Jamoa sardori',
    description: '10 ta muvaffaqiyatli loyiha',
    icon: Users,
    earned: true,
    date: '2024-06-20'
  },
  {
    id: 3,
    title: 'Maqsadga yetuvchi',
    description: '100% vazifa bajarish',
    icon: Target,
    earned: false,
    date: null
  },
  {
    id: 4,
    title: 'Innovator',
    description: '5 ta yangi g\'oya taklif qilish',
    icon: Star,
    earned: false,
    date: null
  }
];

const defaultStats = [
  {
    label: 'Ish kunlari',
    value: '856',
    icon: Calendar,
    change: '+12 bu oy'
  },
  {
    label: 'Bajarilgan vazifalar',
    value: '124',
    icon: Target,
    change: '+8 bu hafta'
  },
  {
    label: 'Jamoa a\'zolari',
    value: '12',
    icon: Users,
    change: '+2 yangi'
  },
  {
    label: 'Unumdorlik',
    value: '96%',
    icon: TrendingUp,
    change: '+4% o\'sish'
  }
];

export function MobileProfile({ 
  kpiData, 
  userProfile, 
  onDataUpdate, 
  onProfileUpdate,
  onLogout 
}: MobileProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Dynamic profile data based on user role
  const getInitialProfileData = () => {
    if (userProfile.role === 'Marketolog' || userProfile.role === 'Marketing boshqaruvchisi') {
      return {
        name: 'Shaxriddin Adizov Sherali o\'g\'li',
        email: 'shaxriddin@boshqaruv.uz',
        phone: '+998 94 456 78 90',
        position: 'Marketing boshqaruvchisi',
        department: 'Marketing bo\'limi',
        startDate: '2023-02-01',
        address: 'Toshkent, Shayxontohur tumani',
        bio: 'Marketing boshqaruvchisi va digital marketing mutaxassisi. Instagram va ijtimoiy tarmoqlar orqali brend marketing strategiyalarini amalga oshiradi. Kundalik 15-18 ta post va 10-15 ta reel yaratadi, AI yordamida kontent ishlab chiqadi va video montaj bo\'yicha professional tajribaga ega.'
      };
    }
    
    // Default profile for other roles
    return {
      name: 'Alisher Fayzullayev',
      email: 'alisher@boshqaruv.uz',
      phone: '+998 90 123 45 67',
      position: 'Administrator',
      department: 'Boshqaruv',
      startDate: '2022-01-15',
      address: 'Toshkent, Mirzo-Ulug\'bek tumani',
      bio: 'Tajribali administrator va jamoa rahbari. 5+ yillik tajriba bilan tizimlarni boshqarish va jamoani rivojlantirish bo\'yicha ixtisoslashgan.'
    };
  };

  const [editedProfile, setEditedProfile] = useState(getInitialProfileData());

  const handleSave = () => {
    onProfileUpdate({ ...userProfile, name: editedProfile.name });
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Confirmation dialog would be nice here, but for now just logout directly
    if (onLogout) {
      onLogout();
      toast.success('Tizimdan muvaffaqiyatli chiqildi');
    }
  };

  // Choose data based on role
  const achievements = (userProfile.role === 'Marketolog' || userProfile.role === 'Marketing boshqaruvchisi') ? getMarketingAchievements() : defaultAchievements;
  const profileStats = (userProfile.role === 'Marketolog' || userProfile.role === 'Marketing boshqaruvchisi') ? getMarketingStats() : defaultStats;

  return (
    <div className="boshqaruv-container space-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {userProfile.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-center space-y-2">
                {isEditing ? (
                  <Input
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="text-center"
                  />
                ) : (
                  <h1 className="text-xl font-bold text-foreground">{userProfile.name}</h1>
                )}
                
                <div className="flex items-center justify-center space-x-2">
                  <Badge variant="secondary">{editedProfile.position}</Badge>
                  <Badge variant="outline">{editedProfile.department}</Badge>
                </div>

                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <div className={`w-2 h-2 rounded-full ${
                    userProfile.status === 'online' ? 'bg-success' : 'bg-muted-foreground'
                  }`} />
                  <span>{userProfile.status === 'online' ? 'Onlayn' : 'Oflayn'}</span>
                </div>
              </div>

              <div className="flex gap-2 w-full">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Saqlash
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="flex-1">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Tahrirlash
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Ma'lumotlar</TabsTrigger>
            <TabsTrigger value="stats">Statistika</TabsTrigger>
            <TabsTrigger value="achievements">Yutuqlar</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Aloqa Ma'lumotlari</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefon</Label>
                      <Input
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Manzil</Label>
                      <Input
                        value={editedProfile.address}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{editedProfile.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{editedProfile.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{editedProfile.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Ishga kirgan: {editedProfile.startDate}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Bio Section */}
            <Card>
              <CardHeader>
                <CardTitle>Haqida</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <textarea
                    className="w-full h-24 p-3 border border-border rounded-md resize-none"
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="O'zingiz haqingizda qisqacha ma'lumot..."
                  />
                ) : (
                  <p className="text-muted-foreground">{editedProfile.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Marketing Responsibilities - Only for Marketolog */}
            {(userProfile.role === 'Marketolog' || userProfile.role === 'Marketing boshqaruvchisi') && (
              <Card>
                <CardHeader>
                  <CardTitle>Asosiy vazifalar va mas'uliyatlar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Instagram va ijtimoiy tarmoqlarni boshqarish:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Kuniga 15-18 ta tayyor postni yuklash va nazorat qilish</li>
                      <li>• Postlar uchun caption, hashtag va lokatsiyalarni tayyorlash</li>
                      <li>• Post yuklash vaqtlarini rejalashtirish va qat'iy rioya qilish</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Video montaj va vizual kontent:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Kuniga 10-15 ta video (reels) montaj qilish</li>
                      <li>• Videolar uchun preview va trend musiqalarni tanlash</li>
                      <li>• Sifatni ta'minlash va trend maqsadlarga moslash</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Kontent monitoring va tahlil:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Post va reels natijalarini kundalik kuzatish</li>
                      <li>• Eng yaxshi va zaif postlarni tahlil qilish</li>
                      <li>• Haftalik va oylik xulosalar chiqarish</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">AI va yangi texnologiyalar:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• GPT orqali post matnlari va captionlar tayyorlash</li>
                      <li>• AI yordamida yangi kreativ yondashuvlar ishlab chiqish</li>
                      <li>• Marketing strategiyalarini takomillashtirish</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-4 mt-6">
            {/* Profile Stats */}
            <div className="grid grid-cols-2 gap-4">
              {profileStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                      </div>
                      <div className="text-xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-success">{stat.change}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Unumdorlik Trendi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis hide />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4 mt-6">
            <div className="space-y-3">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <Card key={achievement.id} className={achievement.earned ? '' : 'opacity-60'}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${
                          achievement.earned ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          {achievement.earned && achievement.date && (
                            <p className="text-xs text-success mt-1">
                              Qo'lga kiritildi: {new Date(achievement.date).toLocaleDateString('uz-UZ')}
                            </p>
                          )}
                        </div>
                        {achievement.earned && (
                          <Badge variant="secondary">
                            <Award className="h-3 w-3 mr-1" />
                            Qo'lga kiritildi
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Logout Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Tizimdan chiqish</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Xavfsizligingiz uchun seansni tugatish
                </p>
              </div>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Chiqish
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}