import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Plus, Edit, Trash2, Filter, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

interface PenaltyRule {
  id: string;
  code: string;
  name: string;
  description: string;
  appliesOn: 'attendance' | 'behavior' | 'performance' | 'safety';
  points: number;
  active: boolean;
  createdAt: string;
}

interface Penalty {
  id: string;
  employee: {
    id: string;
    name: string;
    position: string;
  };
  rule: PenaltyRule;
  reason: string;
  points: number;
  occurredAt: string;
  approvedBy: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockRules: PenaltyRule[] = [
  {
    id: '1',
    code: 'ATT001',
    name: 'Kechikish',
    description: '15 daqiqadan ortiq kechikish',
    appliesOn: 'attendance',
    points: 5,
    active: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    code: 'ATT002',
    name: 'Ruxsatsiz ketish',
    description: 'Ish vaqtida ruxsatsiz ketish',
    appliesOn: 'attendance',
    points: 10,
    active: true,
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    code: 'BEH001',
    name: 'Noto\'g\'ri xulq',
    description: 'Hamkasblar bilan noto\'g\'ri muomala',
    appliesOn: 'behavior',
    points: 15,
    active: true,
    createdAt: '2024-01-15'
  },
  {
    id: '4',
    code: 'PER001',
    name: 'Vazifa bajarilmadi',
    description: 'Belgilangan muddat ichida vazifa bajarilmadi',
    appliesOn: 'performance',
    points: 8,
    active: true,
    createdAt: '2024-01-15'
  }
];

const mockPenalties: Penalty[] = [
  {
    id: '1',
    employee: {
      id: 'emp2',
      name: 'Nozima Karimova',
      position: 'UX Designer'
    },
    rule: mockRules[0],
    reason: '25 daqiqa kechikib keldi',
    points: 5,
    occurredAt: '2024-12-20T09:25:00',
    approvedBy: 'Alisher Fayzullayev',
    status: 'approved'
  },
  {
    id: '2',
    employee: {
      id: 'emp4',
      name: 'Dilnoza Rahimova',
      position: 'Project Manager'
    },
    rule: mockRules[3],
    reason: 'Loyiha muddat o\'tib ketdi',
    points: 8,
    occurredAt: '2024-12-19T17:00:00',
    approvedBy: 'Jamshid Tursunov',
    status: 'approved'
  },
  {
    id: '3',
    employee: {
      id: 'emp3',
      name: 'Jamshid Tursunov',
      position: 'Backend Developer'
    },
    rule: mockRules[1],
    reason: 'Ish vaqtida shaxsiy maqsadda chiqib ketdi',
    points: 10,
    occurredAt: '2024-12-18T14:30:00',
    approvedBy: 'Admin',
    status: 'pending'
  }
];

type RuleForm = Omit<PenaltyRule, 'id' | 'createdAt'>;

export function PenaltiesPage() {
  // Rules state
  const [rules, setRules] = useState<PenaltyRule[]>(mockRules);
  const [selectedRule, setSelectedRule] = useState<PenaltyRule | null>(null);
  const [isRuleSheetOpen, setIsRuleSheetOpen] = useState(false);
  const [ruleForm, setRuleForm] = useState<RuleForm>({
    code: '',
    name: '',
    description: '',
    appliesOn: 'attendance',
    points: 0,
    active: true
  });

  // Penalties state
  const [penalties, setPenalties] = useState<Penalty[]>(mockPenalties);
  const [filterEmployee, setFilterEmployee] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<Date | undefined>();
  const [filterDateTo, setFilterDateTo] = useState<Date | undefined>();

  const getAppliesOnText = (appliesOn: string) => {
    switch (appliesOn) {
      case 'attendance':
        return 'Davomat';
      case 'behavior':
        return 'Xulq-atvor';
      case 'performance':
        return 'Ish samaradorligi';
      case 'safety':
        return 'Xavfsizlik';
      default:
        return appliesOn;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success text-success-foreground">Tasdiqlangan</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-warning-foreground">Kutilmoqda</Badge>;
      case 'rejected':
        return <Badge className="bg-danger text-danger-foreground">Rad etilgan</Badge>;
      default:
        return <Badge variant="secondary">Noma'lum</Badge>;
    }
  };

  const handleSaveRule = () => {
    if (!ruleForm.code || !ruleForm.name || !ruleForm.points) {
      toast.error('Barcha majburiy maydonlarni to\'ldiring');
      return;
    }

    if (selectedRule) {
      // Edit existing rule
      setRules(rules.map(rule => 
        rule.id === selectedRule.id 
          ? { ...selectedRule, ...ruleForm, id: selectedRule.id }
          : rule
      ));
      toast.success('Qoida yangilandi');
    } else {
      // Create new rule
      const newRule: PenaltyRule = {
        id: Date.now().toString(),
        ...ruleForm,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setRules([...rules, newRule]);
      toast.success('Yangi qoida qo\'shildi');
    }

    setIsRuleSheetOpen(false);
    setSelectedRule(null);
    setRuleForm({
      code: '',
      name: '',
      description: '',
      appliesOn: 'attendance',
      points: 0,
      active: true
    });
  };

  const handleEditRule = (rule: PenaltyRule) => {
    setSelectedRule(rule);
    setRuleForm({
      code: rule.code,
      name: rule.name,
      description: rule.description,
      appliesOn: rule.appliesOn,
      points: rule.points,
      active: rule.active
    });
    setIsRuleSheetOpen(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
    toast.success('Qoida o\'chirildi');
  };

  const filteredPenalties = penalties.filter(penalty => {
    const matchesEmployee = filterEmployee === 'all' || penalty.employee.id === filterEmployee;
    const matchesStatus = filterStatus === 'all' || penalty.status === filterStatus;
    
    let matchesDate = true;
    if (filterDateFrom || filterDateTo) {
      const penaltyDate = new Date(penalty.occurredAt);
      if (filterDateFrom) matchesDate = matchesDate && penaltyDate >= filterDateFrom;
      if (filterDateTo) matchesDate = matchesDate && penaltyDate <= filterDateTo;
    }

    return matchesEmployee && matchesStatus && matchesDate;
  });

  return (
    <div className="space-6">
      {/* Statistics */}
      <div className="boshqaruv-grid boshqaruv-grid-mobile tablet:boshqaruv-grid-tablet desktop:boshqaruv-grid-desktop mb-6">
        <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-primary">Faol qoidalar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{rules.filter(r => r.active).length}</div>
          </CardContent>
        </Card>

        <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-warning">Kutilayotgan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{penalties.filter(p => p.status === 'pending').length}</div>
          </CardContent>
        </Card>

        <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-success">Tasdiqlangan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{penalties.filter(p => p.status === 'approved').length}</div>
          </CardContent>
        </Card>

        <Card className="col-span-2 tablet:col-span-2 desktop:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-danger">Jami balllar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {penalties.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.points, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList>
          <TabsTrigger value="rules">Jarima qoidalari</TabsTrigger>
          <TabsTrigger value="penalties">Jarimalar</TabsTrigger>
        </TabsList>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3>Jarima qoidalari</h3>
            <Sheet open={isRuleSheetOpen} onOpenChange={setIsRuleSheetOpen}>
              <SheetTrigger asChild>
                <Button onClick={() => {
                  setSelectedRule(null);
                  setRuleForm({
                    code: '',
                    name: '',
                    description: '',
                    appliesOn: 'attendance',
                    points: 0,
                    active: true
                  });
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Yangi qoida
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>
                    {selectedRule ? 'Qoidani tahrirlash' : 'Yangi qoida qo\'shish'}
                  </SheetTitle>
                  <SheetDescription>
                    Jarima qoidasi ma'lumotlarini kiriting
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6">
                  <div className="space-y-2">
                    <Label htmlFor="code">Kod *</Label>
                    <Input
                      id="code"
                      value={ruleForm.code}
                      onChange={(e) => setRuleForm({ ...ruleForm, code: e.target.value })}
                      placeholder="ATT001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nomi *</Label>
                    <Input
                      id="name"
                      value={ruleForm.name}
                      onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                      placeholder="Qoida nomi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Tavsif</Label>
                    <Textarea
                      id="description"
                      value={ruleForm.description}
                      onChange={(e) => setRuleForm({ ...ruleForm, description: e.target.value })}
                      placeholder="Qoida tavsifi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appliesOn">Qo'llanilish sohasi</Label>
                    <Select value={ruleForm.appliesOn} onValueChange={(value) => setRuleForm({ ...ruleForm, appliesOn: value as PenaltyRule['appliesOn'] })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="attendance">Davomat</SelectItem>
                        <SelectItem value="behavior">Xulq-atvor</SelectItem>
                        <SelectItem value="performance">Ish samaradorligi</SelectItem>
                        <SelectItem value="safety">Xavfsizlik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="points">Ball *</Label>
                    <Input
                      id="points"
                      type="number"
                      value={ruleForm.points}
                      onChange={(e) => setRuleForm({ ...ruleForm, points: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={ruleForm.active}
                      onCheckedChange={(checked) => setRuleForm({ ...ruleForm, active: checked })}
                    />
                    <Label htmlFor="active">Faol</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsRuleSheetOpen(false)}>
                    Bekor qilish
                  </Button>
                  <Button onClick={handleSaveRule}>
                    {selectedRule ? 'Yangilash' : 'Qo\'shish'}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kod</TableHead>
                  <TableHead>Nomi</TableHead>
                  <TableHead>Soha</TableHead>
                  <TableHead>Ball</TableHead>
                  <TableHead>Holat</TableHead>
                  <TableHead>Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-mono">{rule.code}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        {rule.description && (
                          <div className="text-sm text-muted-foreground">{rule.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getAppliesOnText(rule.appliesOn)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{rule.points}</Badge>
                    </TableCell>
                    <TableCell>
                      {rule.active ? (
                        <Badge className="bg-success text-success-foreground">Faol</Badge>
                      ) : (
                        <Badge variant="secondary">Nofaol</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRule(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRule(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Penalties Tab */}
        <TabsContent value="penalties" className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-48">
                <Label htmlFor="filter-employee">Xodim</Label>
                <Select value={filterEmployee} onValueChange={setFilterEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Barcha xodimlar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha xodimlar</SelectItem>
                    <SelectItem value="emp2">Nozima Karimova</SelectItem>
                    <SelectItem value="emp3">Jamshid Tursunov</SelectItem>
                    <SelectItem value="emp4">Dilnoza Rahimova</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-48">
                <Label htmlFor="filter-status">Holat</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Barcha holatlar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha holatlar</SelectItem>
                    <SelectItem value="pending">Kutilmoqda</SelectItem>
                    <SelectItem value="approved">Tasdiqlangan</SelectItem>
                    <SelectItem value="rejected">Rad etilgan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-48">
                <Label>Dan</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filterDateFrom ? format(filterDateFrom, 'PPP', { locale: uz }) : 'Sana tanlang'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filterDateFrom}
                      onSelect={setFilterDateFrom}
                      locale={uz}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex-1 min-w-48">
                <Label>Gacha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filterDateTo ? format(filterDateTo, 'PPP', { locale: uz }) : 'Sana tanlang'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filterDateTo}
                      onSelect={setFilterDateTo}
                      locale={uz}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </Card>

          {/* Penalties List */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Xodim</TableHead>
                  <TableHead>Qoida</TableHead>
                  <TableHead>Sabab</TableHead>
                  <TableHead>Ball</TableHead>
                  <TableHead>Sana</TableHead>
                  <TableHead>Holat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPenalties.map((penalty) => (
                  <TableRow key={penalty.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{penalty.employee.name}</div>
                        <div className="text-sm text-muted-foreground">{penalty.employee.position}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-mono text-sm">{penalty.rule.code}</div>
                        <div className="text-sm text-muted-foreground">{penalty.rule.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{penalty.reason}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-danger border-danger">
                        {penalty.points}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(penalty.occurredAt), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>{getStatusBadge(penalty.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}