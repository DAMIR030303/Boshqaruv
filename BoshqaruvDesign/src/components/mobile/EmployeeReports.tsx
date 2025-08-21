import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ReportViewModal } from './ReportViewModal';
import { 
  Plus,
  Send,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Star,
  Target,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface EmployeeReportsProps {
  kpiData: any;
  userProfile: {
    name: string;
    role: string;
    avatar: string;
    status: string;
  };
  onDataUpdate: (data: any) => void;
}

export function EmployeeReports({ 
  kpiData, 
  userProfile, 
  onDataUpdate 
}: EmployeeReportsProps) {
  const [activeTab, setActiveTab] = useState('yuborish');
  const [reportTitle, setReportTitle] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
  // Modal states
  const [isReportViewModalOpen, setIsReportViewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Employee reports data
  const myReports = [
    {
      id: 1,
      title: 'Haftalik marketing faoliyati hisoboti',
      type: 'haftalik',
      status: 'tasdiqlangan',
      submittedDate: '2024-08-19T10:00:00',
      reviewedDate: '2024-08-19T14:30:00',
      reviewer: 'Marketing Menejeri',
      content: 'Bu hafta ichida 5 ta Instagram post, 3 ta blog maqola va 2 ta Facebook kampaniyasi amalga oshirildi. Barcha postlar 80% dan yuqori engagement oldi va maqsadli auditoriya bilan samarali muloqot o\'rnatildi.\n\n1. Bajarilgan ishlar:\n- 5 ta Instagram post yaratildi va e\'lon qilindi\n- 3 ta blog maqola yozildi va saytga joylashtildi\n- 2 ta Facebook reklama kampaniyasi ishga tushirildi\n- Instagram Stories orqali 10 ta interaktiv kontent tayyorlandi\n- LinkedIn da professional network kengaytirildi\n\n2. Natijalar:\n- Instagram: 2,500 yangi follower qo\'shildi\n- Blog: 15,000 yangi ko\'rishlar oldi\n- Facebook: 1,200 ta like va 300 ta share\n- Konversiya darajasi 3.2% ga oshdi\n- Brand awareness 25% ga oshdi\n\n3. Muammolar:\n- Video kontentlar uchun professional equipment kam\n- Grafik dizayn jarayoni sekinlashib qoldi\n- Ba\'zi postlarda reach past tushdi\n\n4. Keyingi hafta rejalari:\n- Video kontent strategiyasini yaxshilash\n- Grafik dizayn workflow ni optimallashtirish\n- Influencer collaboration boshlash\n- Email marketing kampaniyasi ishga tushirish',
      feedback: 'Ajoyib ishlaganingiz! Engagement ko\'rsatkichlari kutilganidan ham yaxshi.',
      rating: 5,
      attachments: 3
    },
    {
      id: 2,
      title: 'Ijtimoiy tarmoqlar oylik tahlili',
      type: 'oylik',
      status: 'kutilmoqda',
      submittedDate: '2024-08-18T16:20:00',
      reviewedDate: null,
      reviewer: 'Marketing Direktori',
      content: 'Oy davomida ijtimoiy tarmoqlardagi faoliyat natijalarini tahlil qildim...',
      feedback: null,
      rating: null,
      attachments: 5
    },
    {
      id: 3,
      title: 'Kontent strategiyasi taklifi',
      type: 'loyiha',
      status: 'qayta_korib_chiqish',
      submittedDate: '2024-08-15T09:15:00',
      reviewedDate: '2024-08-16T11:00:00',
      reviewer: 'Kontent Menejeri',
      content: 'Keyingi oylar uchun kontent strategiyasi va ijodiy yondashuvlar...',
      feedback: 'Yaxshi g\'oyalar, lekin budget bo\'limi aniqroq bo\'lishi kerak.',
      rating: 3,
      attachments: 2
    }
  ];

  const templates = [
    {
      id: 'haftalik_marketing',
      name: 'Haftalik Marketing Hisoboti',
      description: 'Haftalik marketing faoliyatlari uchun standart shablon',
      fields: ['Bajarilgan ishlar', 'Natijalar', 'Muammolar', 'Keyingi hafta rejalari']
    },
    {
      id: 'loyiha_hisobot',
      name: 'Loyiha Hisoboti',
      description: 'Loyiha yakunlash yoki progress hisoboti',
      fields: ['Loyiha maqsadi', 'Bajarilgan ishlar', 'Natijalar', 'Tavsiyalar']
    },
    {
      id: 'ijtimoiy_tarmoq',
      name: 'Ijtimoiy Tarmoq Tahlili',
      description: 'Ijtimoiy tarmoqlardagi faoliyat hisoboti',
      fields: ['Platform statistikasi', 'Eng yaxshi postlar', 'Engagement tahlili', 'Keyingi strategiya']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'tasdiqlangan': return 'bg-success text-success-foreground';
      case 'kutilmoqda': return 'bg-warning text-warning-foreground';
      case 'qayta_korib_chiqish': return 'bg-danger text-danger-foreground';
      case 'qoralama': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'tasdiqlangan': return 'Tasdiqlangan';
      case 'kutilmoqda': return 'Kutilmoqda';
      case 'qayta_korib_chiqish': return 'Qayta ko\'rib chiqish';
      case 'qoralama': return 'Qoralama';
      default: return 'Noma\'lum';
    }
  };

  const handleSubmitReport = () => {
    if (!reportTitle.trim() || !reportContent.trim()) {
      toast.error('Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }

    toast.success('Hisobot muvaffaqiyatli yuborildi!');
    setReportTitle('');
    setReportContent('');
    setSelectedTemplate('');
    onDataUpdate({ type: 'report_submitted', title: reportTitle });
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setReportTitle(template.name);
      
      // Pre-fill content with template structure
      const templateContent = template.fields.map((field, index) => 
        `${index + 1}. ${field}:\n\n`
      ).join('\n');
      
      setReportContent(templateContent);
      
      // Switch to the submit tab
      setActiveTab('yuborish');
      
      toast.success(`"${template.name}" shabloni tanlandi va hisobot yaratish oynasiga yuklandi`);
    }
  };

  const handleTemplatePreview = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      toast.info(`${template.name} shablonini ko'rish`);
      // In a real app, this would open a preview modal
    }
  };

  const handleFileUpload = () => {
    toast.info('Fayl yuklash funksiyasi hozirda ishlab chiqilmoqda');
    // In a real app, this would open file picker
  };

  const handleReportView = useCallback((reportId: number) => {
    console.log('🚀 BUTTON CLICKED - Ko\'rish tugmasi bosildi!', reportId);
    const report = myReports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setIsReportViewModalOpen(true);
      toast.success(`✅ "${report.title}" hisobotini ko'rish oynasi ochildi!`);
      console.log('✅ Hisobot topildi va modal ochildi:', report.title);
    } else {
      toast.error('❌ Hisobot topilmadi');
      console.error('❌ Hisobot topilmadi, reportId:', reportId);
    }
  }, [myReports]);

  const handleReportDownload = useCallback((reportId: number) => {
    console.log('🚀 BUTTON CLICKED - Yuklab olish tugmasi bosildi!', reportId);
    const report = myReports.find(r => r.id === reportId);
    if (report) {
      toast.success(`📥 "${report.title}" hisoboti yuklab olinmoqda...`);
      console.log('📥 Hisobot yuklab olish boshlandi:', report.title);
      // Simulate download process
      setTimeout(() => {
        toast.success(`✅ "${report.title}" hisoboti muvaffaqiyatli yuklab olindi!`);
        console.log('✅ Yuklab olish tugallandi:', report.title);
      }, 2000);
    } else {
      toast.error('❌ Hisobot topilmadi');
      console.error('❌ Hisobot topilmadi, reportId:', reportId);
    }
  }, [myReports]);

  const handleReportEdit = useCallback((reportId: number) => {
    console.log('🚀 BUTTON CLICKED - Tahrirlash tugmasi bosildi!', reportId);
    const report = myReports.find(r => r.id === reportId);
    if (report) {
      toast.success(`✏️ "${report.title}" hisoboti tahrirlash rejimida ochildi!`);
      console.log('✏️ Hisobot tahrirlash uchun ochildi:', report.title);
      // In a real app, this would open edit modal or navigate to edit page
    } else {
      toast.error('❌ Hisobot topilmadi');
      console.error('❌ Hisobot topilmadi, reportId:', reportId);
    }
  }, [myReports]);

  const handleModalClose = useCallback(() => {
    setIsReportViewModalOpen(false);
    setSelectedReport(null);
  }, []);

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-warning fill-warning' : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="boshqaruv-container space-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-foreground mb-2">Hisobotlarim</h1>
        <p className="text-muted-foreground">
          Hisobotlaringizni yuboring va natijalarni kuzating
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="yuborish">Yuborish</TabsTrigger>
            <TabsTrigger value="mening">Mening</TabsTrigger>
            <TabsTrigger value="shablonlar">Shablonlar</TabsTrigger>
          </TabsList>

          {/* Submit Report Tab */}
          <TabsContent value="yuborish" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Yangi hisobot yuborish</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Hisobot nomi
                  </label>
                  <Input
                    placeholder="Hisobot nomini kiriting..."
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Hisobot mazmuni
                  </label>
                  <Textarea
                    placeholder="Hisobot mazmunini kiriting..."
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    rows={8}
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSubmitReport} className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Yuborish
                  </Button>
                  <Button variant="outline" onClick={handleFileUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Fayl
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  💡 Maslahat: Hisobotingizni yanada samarali qilish uchun shablonlardan foydalaning.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Reports Tab */}
          <TabsContent value="mening" className="space-y-4 mt-6">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-semibold text-foreground">
                    {myReports.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Jami</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-semibold text-success">
                    {myReports.filter(r => r.status === 'tasdiqlangan').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Tasdiqlangan</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-semibold text-warning">
                    {myReports.filter(r => r.status === 'kutilmoqda').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Kutilmoqda</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {myReports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">
                          {report.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {report.content.substring(0, 100)}...
                        </p>
                        
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(report.submittedDate).toLocaleDateString('uz-UZ')}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <FileText className="h-3 w-3" />
                            <span>{report.attachments} fayl</span>
                          </span>
                          <span>Ko'rdi: {report.reviewer}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getStatusColor(report.status)}>
                          {getStatusText(report.status)}
                        </Badge>
                        {renderStars(report.rating)}
                      </div>
                    </div>

                    {report.feedback && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">Izoh:</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{report.feedback}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="secondary">{report.type}</Badge>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('✅ Ko\'rish tugmasi bosildi!', report.id, report.title);
                            handleReportView(report.id);
                          }}
                          type="button"
                          className="shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ko'rish
                        </Button>
                        {report.status === 'qayta_korib_chiqish' && (
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('✅ Tahrirlash tugmasi bosildi!', report.id, report.title);
                              handleReportEdit(report.id);
                            }}
                            type="button"
                            className="shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Tahrirlash
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('✅ Yuklab olish tugmasi bosildi!', report.id, report.title);
                            handleReportDownload(report.id);
                          }}
                          type="button"
                          className="shrink-0 hover:bg-success hover:text-success-foreground transition-colors"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Yuklab olish
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="shablonlar" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">
                          {template.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {template.description}
                        </p>
                        
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-foreground">Bo'limlar:</div>
                          <div className="flex flex-wrap gap-1">
                            {template.fields.map((field, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleTemplateSelect(template.id)}
                        className="flex-1"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ishlatish
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTemplatePreview(template.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <h3 className="font-medium text-foreground mb-2">
                  Maxsus shablon kerakmi?
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Marketing menejeridan yangi shablon so'rang yoki mavjudlarini moslashtiring.
                </p>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  So'rov yuborish
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Bu oyda</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <div className="text-lg font-semibold text-primary">5</div>
                <div className="text-xs text-muted-foreground">Yuborilgan hisobotlar</div>
              </div>
              
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <div className="text-lg font-semibold text-success">4.2</div>
                <div className="text-xs text-muted-foreground">O'rtacha baho</div>
              </div>
              
              <div className="text-center p-3 bg-warning/10 rounded-lg">
                <div className="text-lg font-semibold text-warning">2.5</div>
                <div className="text-xs text-muted-foreground">O'rtacha qaytish vaqti (kun)</div>
              </div>
              
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold text-foreground">100%</div>
                <div className="text-xs text-muted-foreground">Vaqtida yuborish</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Report View Modal */}
      <ReportViewModal
        isOpen={isReportViewModalOpen}
        onClose={handleModalClose}
        report={selectedReport}
        onDownload={handleReportDownload}
        onEdit={handleReportEdit}
      />
    </div>
  );
}

export default EmployeeReports;