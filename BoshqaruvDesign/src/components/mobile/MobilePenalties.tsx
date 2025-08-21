import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { 
  AlertTriangle,
  Clock,
  DollarSign,
  Search,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  Calendar,
  User
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface MobilePenaltiesProps {
  kpiData: {
    penalties: {
      active: number;
      resolved: number;
      total: number;
    };
  };
  userProfile: any;
  onDataUpdate: (data: any) => void;
}

const penalties = [
  {
    id: 1,
    employee: {
      name: 'Nozima Karimova',
      avatar: '/api/placeholder/40/40'
    },
    type: 'Kechikish',
    reason: '15 daqiqa kechikish',
    amount: 50000,
    date: '2024-08-15',
    status: 'active',
    dueDate: '2024-08-20',
    description: 'Ishga 15 daqiqa kech kelganlik uchun ogohlantirish'
  },
  {
    id: 2,
    employee: {
      name: 'Jamshid Tursunov',
      avatar: '/api/placeholder/40/40'
    },
    type: 'Qoidabuzarlik',
    reason: 'Xavfsizlik qoidalarini buzish',
    amount: 150000,
    date: '2024-08-14',
    status: 'resolved',
    dueDate: '2024-08-19',
    description: 'Ofis xavfsizlik qoidalarini buzganlik uchun jarima'
  },
  {
    id: 3,
    employee: {
      name: 'Dilnoza Rahimova',
      avatar: '/api/placeholder/40/40'
    },
    type: 'Yo\'qlik',
    reason: 'Sababsiz yo\'qlik',
    amount: 200000,
    date: '2024-08-13',
    status: 'active',
    dueDate: '2024-08-18',
    description: 'Sababsiz ishga kelmaganlik uchun jarima'
  },
  {
    id: 4,
    employee: {
      name: 'Bobur Ismoilov',
      avatar: '/api/placeholder/40/40'
    },
    type: 'Kechikish',
    reason: '30 daqiqa kechikish',
    amount: 75000,
    date: '2024-08-12',
    status: 'resolved',
    dueDate: '2024-08-17',
    description: 'Ishga 30 daqiqa kech kelganlik uchun jarima'
  }
];

const penaltyTypes = ['Hammasi', 'Kechikish', 'Yo\'qlik', 'Qoidabuzarlik'];

export function MobilePenalties({ kpiData, userProfile, onDataUpdate }: MobilePenaltiesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Hammasi');
  const [activeTab, setActiveTab] = useState('all');

  const filteredPenalties = penalties.filter(penalty => {
    const matchesSearch = penalty.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         penalty.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         penalty.reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'Hammasi' || penalty.type === selectedType;
    
    const matchesStatus = activeTab === 'all' || penalty.status === activeTab;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="destructive">Faol</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="border-success text-success">Hal qilindi</Badge>;
      case 'pending':
        return <Badge variant="outline">Kutilmoqda</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Kechikish':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'Yo\'qlik':
        return <XCircle className="h-4 w-4 text-danger" />;
      case 'Qoidabuzarlik':
        return <AlertTriangle className="h-4 w-4 text-danger" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const totalAmount = filteredPenalties.reduce((sum, penalty) => sum + penalty.amount, 0);
  const activePenalties = filteredPenalties.filter(p => p.status === 'active').length;
  const resolvedPenalties = filteredPenalties.filter(p => p.status === 'resolved').length;

  return (
    <div className="boshqaruv-container space-6">
      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Jarimalarni qidiring..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-6"
      >
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-5 w-5 text-danger mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">{kpiData.penalties.active}</div>
            <div className="text-xs text-muted-foreground">Faol</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-5 w-5 text-success mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">{kpiData.penalties.resolved}</div>
            <div className="text-xs text-muted-foreground">Hal qilindi</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-5 w-5 text-warning mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">
              {(totalAmount / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-muted-foreground">Jami summa</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add New Penalty Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Button className="w-full" size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Yangi jarima qo'shish
        </Button>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Hammasi ({penalties.length})</TabsTrigger>
            <TabsTrigger value="active">Faol ({activePenalties})</TabsTrigger>
            <TabsTrigger value="resolved">Hal qilindi ({resolvedPenalties})</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Type Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-2 overflow-x-auto pb-2 mb-6"
      >
        {penaltyTypes.map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type)}
            className="shrink-0"
          >
            {type}
          </Button>
        ))}
      </motion.div>

      {/* Penalties List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4 mb-8"
      >
        <AnimatePresence>
          {filteredPenalties.map((penalty, index) => (
            <motion.div
              key={penalty.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={penalty.employee.avatar} alt={penalty.employee.name} />
                          <AvatarFallback>
                            {penalty.employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-foreground">{penalty.employee.name}</h4>
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(penalty.type)}
                            <span className="text-sm text-muted-foreground">{penalty.type}</span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(penalty.status)}
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{penalty.reason}</p>
                        <p className="text-xs text-muted-foreground">{penalty.description}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {penalty.amount.toLocaleString()} so'm
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(penalty.date).toLocaleDateString('uz-UZ')}
                          </span>
                        </div>
                      </div>

                      {penalty.status === 'active' && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-warning" />
                          <span className="text-xs text-warning">
                            Muddat: {new Date(penalty.dueDate).toLocaleDateString('uz-UZ')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {penalty.status === 'active' && (
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Tahrirlash
                        </Button>
                        <Button size="sm" className="flex-1">
                          Hal qilish
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredPenalties.length === 0 && (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-muted-foreground">Jarimalar topilmadi</div>
          </div>
        )}
      </motion.div>

      {/* Monthly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-foreground mb-4">Oylik Xulosa</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">{penalties.length}</div>
                <div className="text-xs text-muted-foreground">Jami jarimalar</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">
                  {(totalAmount / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-muted-foreground">Jami summa</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-warning">
                  {penalties.filter(p => p.type === 'Kechikish').length}
                </div>
                <div className="text-xs text-muted-foreground">Kechikishlar</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-danger">
                  {penalties.filter(p => p.type === 'Yo\'qlik').length}
                </div>
                <div className="text-xs text-muted-foreground">Yo'qliklar</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}