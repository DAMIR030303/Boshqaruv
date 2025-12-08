import type { ApiResponse, Document } from '../types';
import { supabase } from '../utils/supabaseClient';

/**
 * Hujjatlar boshqaruvi servisi
 * Kontur.Diadoc uslubida hujjatlar bilan ishlash
 */
export class DocumentService {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp',
    'text/plain',
  ];

  /**
   * Fayl yuklash va saqlash
   */
  static async uploadDocument(
    file: File,
    type: Document['type'],
    uploadedBy: string,
    taskId?: string,
    reportId?: string
  ): Promise<ApiResponse<Document>> {
    try {
      // Validatsiya
      if (file.size > this.MAX_FILE_SIZE) {
        return {
          success: false,
          error: 'Fayl hajmi 10MB dan oshmasligi kerak',
        };
      }

      if (!this.ALLOWED_TYPES.includes(file.type)) {
        return {
          success: false,
          error: 'Faqat PDF, Word, rasm yoki matn fayllari qabul qilinadi',
        };
      }

      // Fayl nomini tayyorlash
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${type}/${timestamp}_${sanitizedName}`;

      // Supabase Storage'ga yuklash
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        return {
          success: false,
          error: `Fayl yuklashda xatolik: ${uploadError.message}`,
        };
      }

      // Public URL olish
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Document ma'lumotlarini yaratish
      const document: Document = {
        id: uploadData.path,
        name: file.name,
        type,
        url: urlData.publicUrl,
        size: file.size,
        uploadedAt: new Date(),
        uploadedBy,
        mimeType: file.type,
        taskId,
        reportId,
      };

      // Database'ga saqlash (agar kerak bo'lsa)
      // Hozircha faqat Storage'da saqlaymiz

      return {
        success: true,
        data: document,
        message: 'Fayl muvaffaqiyatli yuklandi',
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Hujjatni o'chirish
   */
  static async deleteDocument(documentId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.storage
        .from('documents')
        .remove([documentId]);

      if (error) {
        return {
          success: false,
          error: `Fayl o'chirishda xatolik: ${error.message}`,
        };
      }

      return {
        success: true,
        message: "Fayl muvaffaqiyatli o'chirildi",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Vazifaga biriktirilgan hujjatlarni olish
   */
  static async getTaskDocuments(
    taskId: string
  ): Promise<ApiResponse<Document[]>> {
    try {
      // Supabase Storage'dan fayllarni olish
      const { data, error } = await supabase.storage
        .from('documents')
        .list(`task_attachment/${taskId}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        return {
          success: false,
          error: `Hujjatlarni olishda xatolik: ${error.message}`,
        };
      }

      // Document array'ga o'tkazish
      const documents: Document[] = (data || []).map(file => ({
        id: file.id,
        name: file.name,
        type: 'task_attachment' as const,
        url: '', // URL'ni alohida olish kerak
        size: file.metadata?.size || 0,
        uploadedAt: new Date(file.created_at),
        uploadedBy: file.metadata?.uploadedBy || '',
        mimeType: file.metadata?.mimeType,
        taskId,
      }));

      return {
        success: true,
        data: documents,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Hisobot hujjatlarini olish
   */
  static async getReportDocuments(
    reportId: string
  ): Promise<ApiResponse<Document[]>> {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .list(`report/${reportId}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        return {
          success: false,
          error: `Hisobot hujjatlarini olishda xatolik: ${error.message}`,
        };
      }

      const documents: Document[] = (data || []).map(file => ({
        id: file.id,
        name: file.name,
        type: 'report' as const,
        url: '',
        size: file.metadata?.size || 0,
        uploadedAt: new Date(file.created_at),
        uploadedBy: file.metadata?.uploadedBy || '',
        mimeType: file.metadata?.mimeType,
        reportId,
      }));

      return {
        success: true,
        data: documents,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Hujjat URL'ini olish
   */
  static getDocumentUrl(documentId: string): string {
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(documentId);
    return data.publicUrl;
  }

  /**
   * Hujjatni yuklab olish
   */
  static async downloadDocument(
    documentId: string
  ): Promise<ApiResponse<Blob>> {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(documentId);

      if (error) {
        return {
          success: false,
          error: `Hujjatni yuklab olishda xatolik: ${error.message}`,
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }
}
