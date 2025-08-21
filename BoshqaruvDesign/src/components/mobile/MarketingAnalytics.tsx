import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  TrendingUp, 
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  AlertTriangle,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface AnalyticsData {
  period: string;
  posts: number;
  reach: number;
  engagement: number;
  followers: number;
  impressions: number;
  saves: number;
  shares: number;
  comments: number;
  likes: number;
  profileVisits: number;
}

interface TopPost {
  id: string;
  title: string;
  type: 'post' | 'reel' | 'story';
  engagement: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  publishedAt: string;
  thumbnail: string;
}

interface MarketingAnalyticsProps {
  userProfile: any;
  kpiData: any;
}

export function MarketingAnalytics({ userProfile, kpiData }: MarketingAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [activeTab, setActiveTab] = useState('overview');

  const [analyticsData] = useState<AnalyticsData>({
    period: '7 kun',
    posts: 89,
    reach: 45200,
    engagement: 3420,
    followers: 12580,
    impressions: 78900,
    saves: 456,
    shares: 234,
    comments: 567,
    likes: 2890,
    profileVisits: 890
  });

  const [topPosts] = useState<TopPost[]>([
    {
      id: '1',
      title: 'Navoiy shahrida yangi park',
      type: 'post',
      engagement: 8.5,
      reach: 2340,
      likes: 234,
      comments: 45,
      shares: 23,
      publishedAt: '2025-01-15',
      thumbnail: '/api/placeholder/60/60'
    },
    {
      id: '2',
      title: 'Shahardagi yangi biznes markaz',
      type: 'reel',
      engagement: 12.3,
      reach: 3890,
      likes: 456,
      comments: 67,
      shares: 34,
      publishedAt: '2025-01-14',
      thumbnail: '/api/placeholder/60/60'
    },
    {
      id: '3',
      title: 'Madaniy tadbirlar',
      type: 'post',
      engagement: 6.8,
      reach: 1890,
      likes: 189,
      comments: 23,
      shares: 12,
      publishedAt: '2025-01-13',
      thumbnail: '/api/placeholder/60/60'
    }
  ]);

  const [weeklyGrowth] = useState({
    followers: { current: 12580, growth: 2.3, trend: 'up' },
    engagement: { current: 8.5, growth: 1.2, trend: 'up' },
    reach: { current: 45200, growth: -0.8, trend: 'down' },
    impressions: { current: 78900, growth: 5.4, trend: 'up' }
  });

  const [bestTimes] = useState([
    { time: '09:00', engagement: 12.5, posts: 23 },
    { time: '14:30', engagement: 15.8, posts: 34 },
    { time: '18:00', engagement: 18.2, posts: 45 },
    { time: '20:30', engagement: 16.3, posts: 28 }
  ]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getTrendIcon = (trend: string, growth: number) => {
    if (trend === 'up' || growth > 0) {
      return <ChevronUp className="w-4 h-4 text-success" />;
    }
    return <ChevronDown className="w-4 h-4 text-danger" />;
  };

  const getTrendColor = (trend: string, growth: number) => {
    if (trend === 'up' || growth > 0) {
      return 'text-success';
    }
    return 'text-danger';
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Marketing Analitika</h1>
          <p className="text-sm text-muted-foreground">
            Kontent samaradorligi va auditoriya tahlili
          </p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24hours">24 soat</SelectItem>
            <SelectItem value="7days">7 kun</SelectItem>
            <SelectItem value="30days">30 kun</SelectItem>
            <SelectItem value="90days">3 oy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Umumiy</TabsTrigger>
          <TabsTrigger value="content">Kontent</TabsTrigger>
          <TabsTrigger value="audience">Auditoriya</TabsTrigger>
          <TabsTrigger value="insights">Xulosalar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Asosiy metrikalar */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Obunachilar</span>
                </div>
                {getTrendIcon(weeklyGrowth.followers.trend, weeklyGrowth.followers.growth)}
              </div>
              <div className="text-2xl font-semibold mb-1">
                {formatNumber(weeklyGrowth.followers.current)}
              </div>
              <div className={`text-xs ${getTrendColor(weeklyGrowth.followers.trend, weeklyGrowth.followers.growth)}`}>
                {weeklyGrowth.followers.growth > 0 ? '+' : ''}{weeklyGrowth.followers.growth}% haftalik
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Qamrov</span>
                </div>
                {getTrendIcon(weeklyGrowth.reach.trend, weeklyGrowth.reach.growth)}
              </div>
              <div className="text-2xl font-semibold mb-1">
                {formatNumber(weeklyGrowth.reach.current)}
              </div>
              <div className={`text-xs ${getTrendColor(weeklyGrowth.reach.trend, weeklyGrowth.reach.growth)}`}>
                {weeklyGrowth.reach.growth > 0 ? '+' : ''}{weeklyGrowth.reach.growth}% haftalik
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-muted-foreground">Engagement</span>
                </div>
                {getTrendIcon(weeklyGrowth.engagement.trend, weeklyGrowth.engagement.growth)}
              </div>
              <div className="text-2xl font-semibold mb-1">
                {weeklyGrowth.engagement.current}%
              </div>
              <div className={`text-xs ${getTrendColor(weeklyGrowth.engagement.trend, weeklyGrowth.engagement.growth)}`}>
                {weeklyGrowth.engagement.growth > 0 ? '+' : ''}{weeklyGrowth.engagement.growth}% haftalik
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Impressions</span>
                </div>
                {getTrendIcon(weeklyGrowth.impressions.trend, weeklyGrowth.impressions.growth)}
              </div>
              <div className="text-2xl font-semibold mb-1">
                {formatNumber(weeklyGrowth.impressions.current)}
              </div>
              <div className={`text-xs ${getTrendColor(weeklyGrowth.impressions.trend, weeklyGrowth.impressions.growth)}`}>
                {weeklyGrowth.impressions.growth > 0 ? '+' : ''}{weeklyGrowth.impressions.growth}% haftalik
              </div>
            </Card>
          </div>

          {/* Kunlik maqsadlar progress */}
          <Card className="p-4">
            <h3 className="mb-4">Kunlik maqsadlar bajarilishi</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Postlar (12/18)</span>
                  <span className="text-sm text-muted-foreground">67%</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Reels (8/15)</span>
                  <span className="text-sm text-muted-foreground">53%</span>
                </div>
                <Progress value={53} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Stories (5/10)</span>
                  <span className="text-sm text-muted-foreground">50%</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          {/* Eng yaxshi postlar */}
          <Card className="p-4">
            <h3 className="mb-4">Eng yaxshi kontent</h3>
            <div className="space-y-3">
              {topPosts.map((post) => (
                <motion.div
                  key={post.id}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    {post.type === 'reel' && <Eye className="w-6 h-6 text-primary" />}
                    {post.type === 'post' && <Heart className="w-6 h-6 text-red-500" />}
                    {post.type === 'story' && <MessageCircle className="w-6 h-6 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{post.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>📊 {post.engagement}%</span>
                      <span>👁️ {formatNumber(post.reach)}</span>
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.comments}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {post.type === 'reel' ? 'Reel' : post.type === 'post' ? 'Post' : 'Story'}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Eng yaxshi vaqtlar */}
          <Card className="p-4">
            <h3 className="mb-4">Eng yaxshi nashr vaqtlari</h3>
            <div className="space-y-2">
              {bestTimes.map((timeSlot) => (
                <div key={timeSlot.time} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium">{timeSlot.time}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{timeSlot.engagement}% engagement</div>
                    <div className="text-xs text-muted-foreground">{timeSlot.posts} posts</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Kontent turi tahlili */}
          <Card className="p-4">
            <h3 className="mb-4">Kontent turi bo'yicha tahlil</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-6 h-6 text-pink-500" />
                </div>
                <div className="text-sm font-medium">Postlar</div>
                <div className="text-xs text-muted-foreground">67% barcha kontent</div>
                <div className="text-xs text-success mt-1">+12% o'sish</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Eye className="w-6 h-6 text-red-500" />
                </div>
                <div className="text-sm font-medium">Reels</div>
                <div className="text-xs text-muted-foreground">28% barcha kontent</div>
                <div className="text-xs text-success mt-1">+23% o'sish</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MessageCircle className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-sm font-medium">Stories</div>
                <div className="text-xs text-muted-foreground">5% barcha kontent</div>
                <div className="text-xs text-warning mt-1">-5% kamayish</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          {/* Auditoriya demografikasi */}
          <Card className="p-4">
            <h3 className="mb-4">Auditoriya demografikasi</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Yosh guruhlari</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">18-24</span>
                    <div className="flex items-center gap-2">
                      <Progress value={35} className="h-2 w-20" />
                      <span className="text-xs text-muted-foreground">35%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">25-34</span>
                    <div className="flex items-center gap-2">
                      <Progress value={42} className="h-2 w-20" />
                      <span className="text-xs text-muted-foreground">42%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">35-44</span>
                    <div className="flex items-center gap-2">
                      <Progress value={18} className="h-2 w-20" />
                      <span className="text-xs text-muted-foreground">18%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">45+</span>
                    <div className="flex items-center gap-2">
                      <Progress value={5} className="h-2 w-20" />
                      <span className="text-xs text-muted-foreground">5%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Jinsiy taqsimot</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-semibold">58%</div>
                    <div className="text-xs text-muted-foreground">Ayollar</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold">42%</div>
                    <div className="text-xs text-muted-foreground">Erkaklar</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Faollik vaqtlari */}
          <Card className="p-4">
            <h3 className="mb-4">Auditoriya faollik vaqtlari</h3>
            <div className="grid grid-cols-7 gap-1 mb-3">
              {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map((day) => (
                <div key={day} className="text-center text-xs text-muted-foreground">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[78, 82, 85, 89, 92, 67, 45].map((activity, index) => (
                <div key={index} className="text-center">
                  <div className={`h-8 rounded mb-1 ${
                    activity > 80 ? 'bg-success' : 
                    activity > 60 ? 'bg-warning' : 'bg-muted'
                  }`} style={{ opacity: activity / 100 }}></div>
                  <div className="text-xs">{activity}%</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top locations */}
          <Card className="p-4">
            <h3 className="mb-4">Eng ko'p auditoriya joylari</h3>
            <div className="space-y-2">
              {[
                { location: 'Navoiy', percentage: 65 },
                { location: 'Toshkent', percentage: 18 },
                { location: 'Samarqand', percentage: 8 },
                { location: 'Buxoro', percentage: 5 },
                { location: 'Boshqa', percentage: 4 }
              ].map((item) => (
                <div key={item.location} className="flex justify-between items-center">
                  <span className="text-sm">{item.location}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={item.percentage} className="h-2 w-20" />
                    <span className="text-xs text-muted-foreground w-8">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {/* AI taklilari */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-primary" />
              <h3>AI tavsiyalari</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-success mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-success">Yaxshi natija</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reels kontentingiz 23% ko'proq engagement olyapti. Ushbu formatge ko'proq e'tibor bering.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-warning">Diqqat</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Stories kontenti kamayib ketdi. Kunlik maqsadga erishish uchun ko'proq story yarating.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-primary">Tavsiya</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      18:00-20:30 oralig'ida nashr qiling. Bu vaqtda auditoriya eng faol.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Haftalik xulosalar */}
          <Card className="p-4">
            <h3 className="mb-4">Haftalik xulosa</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <div className="text-lg font-semibold text-success">89</div>
                  <div className="text-xs text-muted-foreground">Jami nashr</div>
                  <div className="text-xs text-success">+12% o'sish</div>
                </div>
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <div className="text-lg font-semibold text-primary">8.5%</div>
                  <div className="text-xs text-muted-foreground">O'rtacha engagement</div>
                  <div className="text-xs text-success">+1.2% o'sish</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Asosiy yutuqlar:</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Reels kontenti 23% ko'proq engagement oldi</li>
                  <li>• Yangi 127 ta obunachi qo'shildi</li>
                  <li>• Profile visits 15% oshdi</li>
                  <li>• Eng yaxshi post 2.3K ko'rildi</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Keyingi hafta uchun maqsadlar:</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Haftalik 95+ post nashr qilish</li>
                  <li>• Reels miqdorini 20% oshirish</li>
                  <li>• Stories faolligini tiklash</li>
                  <li>• Engagement 9% ga yetkazish</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Competitor tahlili */}
          <Card className="p-4">
            <h3 className="mb-4">Raqobatchilar tahlili</h3>
            <div className="space-y-3">
              {[
                { name: 'Buxoro Bugun', followers: '15.2K', engagement: '7.2%', trend: 'up' },
                { name: 'Samarqand News', followers: '18.5K', engagement: '6.8%', trend: 'down' },
                { name: 'Toshkent Life', followers: '22.1K', engagement: '9.1%', trend: 'up' }
              ].map((competitor) => (
                <div key={competitor.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">{competitor.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>👥 {competitor.followers}</span>
                      <span>📊 {competitor.engagement}</span>
                    </div>
                  </div>
                  {getTrendIcon(competitor.trend, competitor.trend === 'up' ? 1 : -1)}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}