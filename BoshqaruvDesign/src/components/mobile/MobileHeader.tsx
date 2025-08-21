import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Input } from '../ui/input';
import { 
  Sun, 
  Moon, 
  Bell,
  Search,
  Settings,
  Menu,
  CheckCircle,
  Clock,
  Users,
  AlertTriangle,
  X,
  User,
  Calendar,
  FileText,
  Building
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface MobileHeaderProps {
  title: string;
  user: {
    name: string;
    role: string;
    avatar: string;
    status: string;
  };
  isDark: boolean;
  onThemeToggle: () => void;
}

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'task',
    title: 'Yangi vazifa tayinlandi',
    message: 'Instagram post yaratish vazifasi sizga tayinlandi',
    time: '2 daqiqa oldin',
    read: false,
    priority: 'high'
  },
  {
    id: 2,
    type: 'attendance',
    title: 'Davomat eslatmasi',
    message: 'Bugun ishga kelish vaqti yaqinlashmoqda',
    time: '15 daqiqa oldin',
    read: false,
    priority: 'medium'
  },
  {
    id: 3,
    type: 'system',
    title: 'Tizim yangilanishi',
    message: 'Yangi funksiyalar qo\'shildi',
    time: '1 soat oldin',
    read: true,
    priority: 'low'
  },
  {
    id: 4,
    type: 'team',
    title: 'Jamoa yig\'ilishi',
    message: 'Ertaga marketing strategiya yig\'ilishi',
    time: '2 soat oldin',
    read: true,
    priority: 'medium'
  }
];

// Mock search data
const searchData = [
  {
    id: 1,
    type: 'employee',
    title: 'Shaxriddin Adizov Sherali o\'g\'li',
    description: 'Marketing boshqaruvchisi',
    icon: User,
    category: 'Xodimlar'
  },
  {
    id: 2,
    type: 'task',
    title: 'Instagram post yaratish',
    description: 'Kunlik Instagram uchun post yaratish',
    icon: CheckCircle,
    category: 'Vazifalar'
  },
  {
    id: 3,
    type: 'task',
    title: 'Video montaj qilish',
    description: 'Reels va Stories uchun video editing',
    icon: CheckCircle,
    category: 'Vazifalar'
  },
  {
    id: 4,
    type: 'attendance',
    title: 'Bugungi davomat',
    description: 'Davomat ma\'lumotlari va statistika',
    icon: Clock,
    category: 'Davomat'
  },
  {
    id: 5,
    type: 'report',
    title: 'Marketing hisoboti',
    description: 'Haftalik marketing natijalar',
    icon: FileText,
    category: 'Hisobotlar'
  },
  {
    id: 6,
    type: 'department',
    title: 'Marketing bo\'limi',
    description: 'Marketing jamoasi va loyihalar',
    icon: Building,
    category: 'Bo\'limlar'
  }
];

export function MobileHeader({ title, user, isDark, onThemeToggle }: MobileHeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(mockNotifications);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Xayrli tong';
    if (hour < 18) return 'Xayrli kun';
    return 'Xayrli kech';
  };

  const getStatusColor = (status: string) => {
    return status === 'online' ? 'bg-success' : 'bg-muted';
  };

  const handleNotificationClick = () => {
    setIsNotificationsOpen(true);
    toast.info('Bildirishnomalar ochildi');
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    toast.info('Qidiruv ochildi');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'attendance': return <Clock className="h-4 w-4 text-warning" />;
      case 'team': return <Users className="h-4 w-4 text-success" />;
      case 'system': return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
      default: return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-danger text-danger-foreground',
      medium: 'bg-warning text-warning-foreground',
      low: 'bg-muted text-muted-foreground'
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    toast.success('Bildirishnoma o\'qildi deb belgilandi');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Filter search results
  const filteredSearchResults = searchData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchItemClick = (item: any) => {
    toast.success(`${item.title} tanlandi`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border"
      >
        <div className="boshqaruv-container">
          <div className="flex items-center justify-between h-16 py-3">
            {/* Left Section - Profile */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`} />
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{getGreeting()},</span>
                  <Badge variant="secondary" className="text-xs py-0.5 px-2">
                    {user.role}
                  </Badge>
                </div>
                <h1 className="text-base font-semibold text-foreground leading-tight">
                  {user.name.split(' ')[0]}
                </h1>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={handleSearchClick}>
                <Search className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 p-0 relative" 
                onClick={handleNotificationClick}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full animate-pulse" />
                )}
              </Button>

              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 p-0"
                onClick={onThemeToggle}
              >
                {isDark ? (
                  <Sun className="h-4 w-4 text-warning" />
                ) : (
                  <Moon className="h-4 w-4 text-primary" />
                )}
              </Button>
            </div>
          </div>

          {/* Page Title */}
          {title !== 'Bosh sahifa' && (
            <div className="pb-3">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center space-x-2"
              >
                <div className="w-1 h-6 bg-primary rounded-full" />
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              </motion.div>
            </div>
          )}
        </div>
      </motion.header>

      {/* Search Sheet */}
      <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Qidiruv</SheetTitle>
          </SheetHeader>
          
          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Xodimlar, vazifalar, hisobotlarni qidiring..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-12 rounded-2xl border-2 focus:border-primary"
                autoFocus
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Search Results */}
          <div className="space-y-4">
            {searchQuery.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Qidirish uchun matn kiriting</p>
                <p className="text-sm text-muted-foreground">Xodimlar, vazifalar va boshqa ma'lumotlarni toping</p>
              </div>
            ) : filteredSearchResults.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Natija topilmadi</p>
                <p className="text-sm text-muted-foreground">"{searchQuery}" uchun hech narsa topilmadi</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">
                    {filteredSearchResults.length} ta natija topildi
                  </p>
                </div>
                {filteredSearchResults.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleSearchItemClick(item)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm text-foreground">
                              {item.title}
                            </h4>
                            <Badge variant="outline" className="text-xs ml-2">
                              {item.category}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </>
            )}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => setIsSearchOpen(false)}
              className="w-full"
            >
              Yopish
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Notifications Sheet */}
      <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader className="mb-6">
            <div className="flex items-center justify-between">
              <SheetTitle>Bildirishnomalar</SheetTitle>
              <Badge variant="secondary" className="rounded-full">
                {unreadCount} yangi
              </Badge>
            </div>
          </SheetHeader>
          
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Bildirishnomalar yo'q</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      notification.read ? 'bg-muted/50' : 'bg-primary/10'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between">
                        <h4 className={`font-medium text-sm ${
                          !notification.read ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPriorityBadge(notification.priority)}`}
                          >
                            {notification.priority === 'high' ? 'Yuqori' : 
                             notification.priority === 'medium' ? 'O\'rta' : 'Past'}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => setIsNotificationsOpen(false)}
              className="w-full"
            >
              Yopish
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}