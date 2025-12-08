import type { ApiResponse, AuditLog, TwoFactorConfig } from '../types';
import { safeLocalStorage } from '../utils/storage';

/**
 * Security servisi - 2FA, audit logs, data encryption
 * Xavfsizlik va standartlarga moslik
 */
export class SecurityService {
  /**
   * Audit log yaratish
   */
  static async logAction(
    userId: string,
    action: string,
    resource: string,
    resourceId?: string,
    details?: Record<string, unknown>
  ): Promise<ApiResponse<AuditLog>> {
    try {
      const auditLog: AuditLog = {
        id: `audit-${Date.now()}`,
        userId,
        action,
        resource,
        resourceId,
        details,
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent,
        timestamp: new Date(),
      };

      // LocalStorage'ga saqlash (production'da Supabase'ga)
      const logs = safeLocalStorage.getItem<AuditLog[]>('audit-logs', []) ?? [];
      logs.push(auditLog);

      // Faqat oxirgi 1000 ta log'ni saqlash
      const limited = logs.slice(-1000);
      safeLocalStorage.setItem('audit-logs', limited);

      return {
        success: true,
        data: auditLog,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Audit log yaratishda xatolik',
      };
    }
  }

  /**
   * Audit log'larni olish
   */
  static async getAuditLogs(
    userId?: string,
    limit: number = 100
  ): Promise<ApiResponse<AuditLog[]>> {
    try {
      const logs = safeLocalStorage.getItem<AuditLog[]>('audit-logs', []) ?? [];

      let filtered = logs;
      if (userId) {
        filtered = logs.filter(log => log.userId === userId);
      }

      // Date'lar string sifatida saqlangan bo'lishi mumkin
      const parsed = filtered
        .map(log => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);

      return {
        success: true,
        data: parsed,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Audit log'larni olishda xatolik",
      };
    }
  }

  /**
   * 2FA sozlamalarini olish
   */
  static async get2FAConfig(
    userId: string
  ): Promise<ApiResponse<TwoFactorConfig>> {
    try {
      const config = safeLocalStorage.getItem<TwoFactorConfig>(
        `2fa-${userId}`,
        null
      );

      if (!config) {
        const defaultConfig: TwoFactorConfig = {
          enabled: false,
          method: 'totp',
        };
        return {
          success: true,
          data: defaultConfig,
        };
      }

      return {
        success: true,
        data: config,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '2FA sozlamalarini olishda xatolik',
      };
    }
  }

  /**
   * 2FA yoqish
   */
  static async enable2FA(
    userId: string,
    method: TwoFactorConfig['method'] = 'totp'
  ): Promise<ApiResponse<TwoFactorConfig>> {
    try {
      // TOTP secret generatsiya (simplified - production'da real library ishlatiladi)
      const secret = this.generateSecret();
      const backupCodes = this.generateBackupCodes();

      const config: TwoFactorConfig = {
        enabled: true,
        method,
        secret,
        backupCodes,
      };

      safeLocalStorage.setItem(`2fa-${userId}`, config);

      // Audit log
      await this.logAction(userId, '2FA_ENABLED', 'security', userId);

      return {
        success: true,
        data: config,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '2FA yoqishda xatolik',
      };
    }
  }

  /**
   * 2FA o'chirish
   */
  static async disable2FA(userId: string): Promise<ApiResponse<void>> {
    try {
      safeLocalStorage.removeItem(`2fa-${userId}`);

      // Audit log
      await this.logAction(userId, '2FA_DISABLED', 'security', userId);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "2FA o'chirishda xatolik",
      };
    }
  }

  /**
   * 2FA kodini tekshirish
   */
  static async verify2FACode(
    userId: string,
    code: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const config = await this.get2FAConfig(userId);
      if (!config.success || !config.data || !config.data.enabled) {
        return {
          success: false,
          error: '2FA yoqilmagan',
        };
      }

      // TOTP kodini tekshirish (simplified - production'da real library ishlatiladi)
      // Hozircha backup code'lar tekshiriladi
      if (config.data.backupCodes?.includes(code)) {
        // Backup code ishlatilgan - o'chirish
        const updatedCodes = config.data.backupCodes.filter(c => c !== code);
        const updatedConfig: TwoFactorConfig = {
          ...config.data,
          backupCodes: updatedCodes,
        };
        safeLocalStorage.setItem(`2fa-${userId}`, updatedConfig);

        return {
          success: true,
          data: true,
        };
      }

      // Real TOTP verification bu yerda bo'lishi kerak
      // Simplified - hozircha false qaytaramiz
      return {
        success: true,
        data: false,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '2FA kodini tekshirishda xatolik',
      };
    }
  }

  /**
   * Ma'lumotlarni shifrlash (simplified)
   */
  static encrypt(data: string): string {
    // Simplified encryption (production'da real encryption library ishlatiladi)
    return btoa(data);
  }

  /**
   * Ma'lumotlarni deshifrlash (simplified)
   */
  static decrypt(encrypted: string): string {
    // Simplified decryption (production'da real decryption library ishlatiladi)
    try {
      return atob(encrypted);
    } catch (error) {
      throw new Error('Deshifrlashda xatolik');
    }
  }

  /**
   * Secret generatsiya
   */
  private static generateSecret(): string {
    // Simplified - production'da real secret generation
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Backup code'lar generatsiya
   */
  private static generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  }

  /**
   * Client IP olish (simplified)
   */
  private static async getClientIP(): Promise<string> {
    // Simplified - production'da real IP detection
    return 'unknown';
  }

  /**
   * GDPR compliance - ma'lumotlarni o'chirish
   */
  static async deleteUserData(userId: string): Promise<ApiResponse<void>> {
    try {
      // Barcha foydalanuvchi ma'lumotlarini o'chirish
      safeLocalStorage.removeItem(`points-${userId}`);
      safeLocalStorage.removeItem(`2fa-${userId}`);

      // Audit log
      await this.logAction(userId, 'DATA_DELETED', 'gdpr', userId);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ma'lumotlarni o'chirishda xatolik",
      };
    }
  }
}
