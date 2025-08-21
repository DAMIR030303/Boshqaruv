import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { 
  X,
  Calendar,
  User,
  FileText,
  MessageSquare,
  Star,
  Download,
  Edit,
  Eye,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface Report {
  id: number;
  title: string;
  type: string;
  status: string;
  submittedDate: string;
  reviewedDate?: string | null;
  reviewer: string;
  content: string;
  feedback?: string | null;
  rating?: number | null;
  attachments: number;
}

interface ReportViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
  onDownload?: (reportId: number) => void;
  onEdit?: (reportId: number) => void;
}

export function ReportViewModal({
  isOpen,
  onClose,
  report,
  onDownload,
  onEdit
}: ReportViewModalProps) {
  if (!report) return null;

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'tasdiqlangan': return <CheckCircle2 className="h-4 w-4" />;
      case 'kutilmoqda': return <Clock className="h-4 w-4" />;
      case 'qayta_korib_chiqish': return <Edit className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-warning fill-warning' : 'text-muted-foreground'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-foreground">
          {rating}/5
        </span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col h-full"
        >
          {/* Header */}
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <DialogTitle className="text-xl font-semibold text-foreground mb-2">
                  {report.title}
                </DialogTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(report.submittedDate).toLocaleDateString('uz-UZ', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{report.reviewer}</span>
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <Badge className={`${getStatusColor(report.status)} flex items-center space-x-1`}>
                  {getStatusIcon(report.status)}
                  <span>{getStatusText(report.status)}</span>
                </Badge>
                <Badge variant="secondary">{report.type}</Badge>
              </div>
            </div>
          </DialogHeader>

          <Separator />

          {/* Content */}
          <ScrollArea className="flex-1 px-6">
            <div className="py-4 space-y-6">
              {/* Report Content */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium text-foreground">Hisobot mazmuni</h3>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {report.content}
                  </p>
                </div>
              </div>

              {/* Rating */}
              {report.rating && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Star className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium text-foreground">Baholash</h3>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    {renderStars(report.rating)}
                  </div>
                </div>
              )}

              {/* Feedback */}
              {report.feedback && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium text-foreground">Izoh</h3>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {report.feedback}
                    </p>
                  </div>
                </div>
              )}

              {/* Attachments */}
              {report.attachments > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium text-foreground">Biriktirma fayllar</h3>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{report.attachments} ta fayl biriktirilgan</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h3 className="font-medium text-foreground mb-3">Hisobot vaqt jadvali</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Hisobot yuborildi</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.submittedDate).toLocaleDateString('uz-UZ', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {report.reviewedDate && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Ko'rib chiqildi</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(report.reviewedDate).toLocaleDateString('uz-UZ', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          <Separator />

          {/* Footer Actions */}
          <div className="p-6 pt-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Yopish
              </Button>

              <div className="flex items-center space-x-2">
                {report.status === 'qayta_korib_chiqish' && onEdit && (
                  <Button onClick={() => onEdit(report.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Tahrirlash
                  </Button>
                )}
                
                {onDownload && (
                  <Button variant="outline" onClick={() => onDownload(report.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Yuklab olish
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}