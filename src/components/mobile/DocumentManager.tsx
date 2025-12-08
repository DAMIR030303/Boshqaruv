import { useCallback, useEffect, useState } from 'react';

import { Download, File, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { DocumentService } from '../../services/documentService';
import type { Document } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface DocumentManagerProps {
  /** Vazifa ID (agar vazifaga biriktirilgan bo'lsa) */
  taskId?: string;
  /** Hisobot ID (agar hisobotga biriktirilgan bo'lsa) */
  reportId?: string;
  /** Hujjatlar turi */
  documentType: Document['type'];
  /** Foydalanuvchi nomi */
  uploadedBy: string;
  /** Hujjatlarni o'qish faqat */
  readOnly?: boolean;
  /** Hujjatlarni yuklash funksiyasi */
  onDocumentsChange?: (documents: Document[]) => void;
}

/**
 * DocumentManager - Hujjatlar boshqaruvi komponenti
 * Kontur.Diadoc uslubida hujjatlar bilan ishlash
 */
export function DocumentManager({
  taskId,
  reportId,
  documentType,
  uploadedBy,
  readOnly = false,
  onDocumentsChange,
}: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hujjatlarni yuklash
  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      let result;
      if (taskId) {
        result = await DocumentService.getTaskDocuments(taskId);
      } else if (reportId) {
        result = await DocumentService.getReportDocuments(reportId);
      } else {
        setIsLoading(false);
        return;
      }

      if (result.success && result.data) {
        setDocuments(result.data);
        onDocumentsChange?.(result.data);
      } else {
        toast.error(result.error || 'Hujjatlarni yuklashda xatolik');
      }
    } catch (error) {
      toast.error('Hujjatlarni yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  }, [taskId, reportId, onDocumentsChange]);

  // Komponent yuklanganda hujjatlarni yuklash
  useEffect(() => {
    if (taskId || reportId) {
      loadDocuments();
    }
  }, [taskId, reportId, loadDocuments]);

  // Fayl yuklash
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const result = await DocumentService.uploadDocument(
          file,
          documentType,
          uploadedBy,
          taskId,
          reportId
        );

        if (result.success && result.data) {
          setDocuments(prev => [...prev, result.data!]);
          onDocumentsChange?.(documents.concat(result.data!));
          toast.success('Fayl muvaffaqiyatli yuklandi');
        } else {
          toast.error(result.error || 'Fayl yuklashda xatolik');
        }
      } catch (error) {
        toast.error('Fayl yuklashda xatolik');
      } finally {
        setIsUploading(false);
        // Input'ni tozalash
        event.target.value = '';
      }
    },
    [documentType, uploadedBy, taskId, reportId, documents, onDocumentsChange]
  );

  // Hujjatni o'chirish
  const handleDelete = useCallback(
    async (documentId: string) => {
      if (!confirm("Bu hujjatni o'chirishni xohlaysizmi?")) {
        return;
      }

      try {
        const result = await DocumentService.deleteDocument(documentId);
        if (result.success) {
          setDocuments(prev => prev.filter(doc => doc.id !== documentId));
          onDocumentsChange?.(documents.filter(doc => doc.id !== documentId));
          toast.success("Hujjat o'chirildi");
        } else {
          toast.error(result.error || "Hujjat o'chirishda xatolik");
        }
      } catch (error) {
        toast.error("Hujjat o'chirishda xatolik");
      }
    },
    [documents, onDocumentsChange]
  );

  // Hujjatni yuklab olish
  const handleDownload = useCallback(async (doc: Document) => {
    try {
      const result = await DocumentService.downloadDocument(doc.id);
      if (result.success && result.data) {
        // Blob'ni yuklab olish
        const url = window.URL.createObjectURL(result.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Hujjat yuklab olindi');
      } else {
        toast.error(result.error || 'Hujjatni yuklab olishda xatolik');
      }
    } catch (error) {
      toast.error('Hujjatni yuklab olishda xatolik');
    }
  }, []);

  // Fayl hajmini formatlash
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Yuklash bo'limi */}
      {!readOnly && (
        <Card padding="md">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Fayl yuklash</span> yoki bu
                yerga sudrab tashlang
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PDF, Word, rasm yoki matn fayllari (maks. 10MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.txt"
            />
          </label>
          {isUploading && (
            <div className="mt-2 text-sm text-gray-500 text-center">
              Yuklanmoqda...
            </div>
          )}
        </Card>
      )}

      {/* Hujjatlar ro'yxati */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Yuklanmoqda...</div>
      ) : documents.length === 0 ? (
        <Card padding="md">
          <div className="text-center py-8 text-gray-500">
            <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Hujjatlar mavjud emas</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {documents.map(doc => (
            <Card
              key={doc.id}
              padding="sm"
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <File className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(doc.size)} •{' '}
                    {new Date(doc.uploadedAt).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(doc)}
                  title="Yuklab olish"
                >
                  <Download className="w-4 h-4" />
                </Button>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4 text-danger-500" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
