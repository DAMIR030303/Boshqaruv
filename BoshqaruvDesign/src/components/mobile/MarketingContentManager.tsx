import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Instagram, 
  Video, 
  Calendar, 
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap
} from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'post' | 'reel' | 'story';
  title: string;
  description: string;
  status: 'scheduled' | 'published' | 'draft' | 'processing';
  scheduledTime: string;
  engagement: {
    likes: number;
    views: number;
    comments: number;
    shares: number;
  };
  hashtags: string[];
  location?: string;
}

interface MarketingContentManagerProps {
  userProfile: any;
  kpiData: any;
  onDataUpdate?: (data: any) => void;
}

export function MarketingContentManager({ 
  userProfile, 
  kpiData, 
  onDataUpdate 
}: MarketingContentManagerProps) {
  const [activeTab, setActiveTab] = useState('today');
  const [dailyProgress, setDailyProgress] = useState({
    posts: { current: 12, target: 18 },
    reels: { current: 8, target: 15 },
    stories: { current: 5, target: 10 }
  });

  const [todayContent] = useState<ContentItem[]>([
    {
      id: '1',
      type: 'post',
      title: 'Navoiyda yangi mahalla ochildi',
      description: 'Shahar markazida zamonaviy turar-joy majmuasi...',
      status: 'published',
      scheduledTime: '09:00',
      engagement: { likes: 245, views: 1200, comments: 23, shares: 15 },
      hashtags: ['#NavoiydaBugun', '#YangiMahalla', '#Rivojlanish'],
      location: 'Navoiy, O\'zbekiston'
    },
    {
      id: '2',
      type: 'reel',
      title: 'Shahar ko\'chalari tozalanishi',
      description: 'Kechki vaqtda shahar ko\'chalari...',
      status: 'scheduled',
      scheduledTime: '14:30',
      engagement: { likes: 0, views: 0, comments: 0, shares: 0 },
      hashtags: ['#TozaShahar', '#NavoiyToza', '#Ekologiya']
    },
    {
      id: '3',
      type: 'post',
      title: 'Yangi biznes markazlar',
      description: 'Tadbirkorlar uchun imkoniyatlar...',
      status: 'draft',
      scheduledTime: '18:00',
      engagement: { likes: 0, views: 0, comments: 0, shares: 0 },
      hashtags: ['#Biznes', '#Tadbirkorlik', '#Imkoniyat']
    }
  ]);

  const [weeklyStats] = useState({
    totalPosts: 89,
    totalViews: 45200,
    totalEngagement: 3420,
    growthRate: 12.5
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-success';
      case 'scheduled':
        return 'bg-warning';
      case 'draft':
        return 'bg-muted';
      case 'processing':
        return 'bg-primary';
      default:
        return 'bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Nashr qilingan';
      case 'scheduled':
        return 'Rejalashtirilgan';
      case 'draft':
        return 'Loyiha';
      case 'processing':
        return 'Ishlanmoqda';
      default:
        return 'Noma\'lum';
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Kunlik maqsadlar */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2>Kunlik maqsadlar</h2>
          <Badge variant="outline" className="text-success">
            {new Date().toLocaleDateString('uz-UZ', { 
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Postlar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500" />
                <span>Instagram postlari</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {dailyProgress.posts.current}/{dailyProgress.posts.target}
              </span>
            </div>
            <Progress 
              value={(dailyProgress.posts.current / dailyProgress.posts.target) * 100} 
              className="h-2"
            />
          </div>

          {/* Reels */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-red-500" />
                <span>Reels video</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {dailyProgress.reels.current}/{dailyProgress.reels.target}
              </span>
            </div>
            <Progress 
              value={(dailyProgress.reels.current / dailyProgress.reels.target) * 100} 
              className="h-2"
            />
          </div>

          {/* Stories */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Stories</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {dailyProgress.stories.current}/{dailyProgress.stories.target}
              </span>
            </div>
            <Progress 
              value={(dailyProgress.stories.current / dailyProgress.stories.target) * 100} 
              className="h-2"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button size="sm" className="flex-1">
            <Zap className="w-4 h-4 mr-2" />
            AI bilan kontent yarat
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Calendar className="w-4 h-4 mr-2" />
            Rejalashtir
          </Button>
        </div>
      </Card>

      {/* Kontent boshqaruvi */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Bugun</TabsTrigger>
          <TabsTrigger value="scheduled">Rejalashtirilgan</TabsTrigger>
          <TabsTrigger value="analytics">Tahlil</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="space-y-3">
            {todayContent.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {item.type === 'post' && <Instagram className="w-4 h-4 text-pink-500" />}
                    {item.type === 'reel' && <Video className="w-4 h-4 text-red-500" />}
                    {item.type === 'story' && <Calendar className="w-4 h-4 text-blue-500" />}
                    <div>
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`text-xs px-2 py-1 ${getStatusColor(item.status)} text-white`}
                    >
                      {getStatusText(item.status)}
                    </Badge>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.scheduledTime}
                    </div>
                  </div>
                </div>

                {item.status === 'published' && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {item.engagement.likes.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.engagement.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {item.engagement.comments}
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      {item.engagement.shares}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mb-3">
                  {item.hashtags.map((hashtag) => (
                    <Badge key={hashtag} variant="secondary" className="text-xs">
                      {hashtag}
                    </Badge>
                  ))}
                </div>

                {item.location && (
                  <div className="text-xs text-muted-foreground mb-3">
                    📍 {item.location}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Tahrirlash
                  </Button>
                  {item.status === 'published' && (
                    <Button size="sm" variant="outline" className="flex-1">
                      Tahlil
                    </Button>
                  )}
                  {item.status === 'draft' && (
                    <Button size="sm" className="flex-1">
                      Nashr qilish
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <Button className="w-full" size="lg">
            Yangi kontent yaratish
          </Button>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card className="p-4 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3>Rejalashtirilgan kontent</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Kelgusi kunlar uchun 24 ta kontent rejalashtirilgan
            </p>
            <Button>Rejani ko'rish</Button>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Haftalik postlar</span>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div className="text-xl font-semibold">{weeklyStats.totalPosts}</div>
              <div className="text-xs text-success">+12% o'sish</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Jami ko'rishlar</span>
                <Eye className="w-4 h-4 text-primary" />
              </div>
              <div className="text-xl font-semibold">{weeklyStats.totalViews.toLocaleString()}</div>
              <div className="text-xs text-success">+{weeklyStats.growthRate}%</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Engagement</span>
                <Heart className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-xl font-semibold">{weeklyStats.totalEngagement.toLocaleString()}</div>
              <div className="text-xs text-success">+8.5%</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">O'sish sur'ati</span>
                <TrendingUp className="w-4 h-4 text-warning" />
              </div>
              <div className="text-xl font-semibold">{weeklyStats.growthRate}%</div>
              <div className="text-xs text-success">Yaxshi natija</div>
            </Card>
          </div>

          <Card className="p-4">
            <h3 className="mb-4">Eng yaxshi postlar</h3>
            <div className="space-y-3">
              {todayContent.filter(item => item.status === 'published').map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>❤️ {item.engagement.likes}</span>
                      <span>👁️ {item.engagement.views}</span>
                      <span>💬 {item.engagement.comments}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Batafsil</Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}