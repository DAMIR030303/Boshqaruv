import type { ApiResponse, Integration, Webhook } from '../types';
import { safeLocalStorage } from '../utils/storage';

/**
 * Integration servisi - API marketplace, webhooks, external integrations
 * Boshqa dasturlar bilan integratsiya
 */
export class IntegrationService {
  /**
   * Webhook'larni olish
   */
  static async getWebhooks(): Promise<ApiResponse<Webhook[]>> {
    try {
      // Hozircha localStorage'da saqlaymiz
      const webhooks =
        safeLocalStorage.getItem<Webhook[]>('webhooks', []) ?? [];

      // Date'lar string sifatida saqlangan bo'lishi mumkin
      const parsed = webhooks.map(w => ({
        ...w,
        createdAt: new Date(w.createdAt),
      }));

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
            : "Webhook'larni olishda xatolik",
      };
    }
  }

  /**
   * Webhook yaratish
   */
  static async createWebhook(
    webhook: Omit<Webhook, 'id' | 'createdAt'>
  ): Promise<ApiResponse<Webhook>> {
    try {
      const newWebhook: Webhook = {
        ...webhook,
        id: `webhook-${Date.now()}`,
        createdAt: new Date(),
      };

      const webhooks =
        safeLocalStorage.getItem<Webhook[]>('webhooks', []) ?? [];
      webhooks.push(newWebhook);
      safeLocalStorage.setItem('webhooks', webhooks);

      return {
        success: true,
        data: newWebhook,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Webhook yaratishda xatolik',
      };
    }
  }

  /**
   * Webhook yangilash
   */
  static async updateWebhook(
    webhookId: string,
    updates: Partial<Webhook>
  ): Promise<ApiResponse<Webhook>> {
    try {
      const webhooks =
        safeLocalStorage.getItem<Webhook[]>('webhooks', []) ?? [];
      const index = webhooks.findIndex(w => w.id === webhookId);

      if (index === -1) {
        return {
          success: false,
          error: 'Webhook topilmadi',
        };
      }

      webhooks[index] = {
        ...webhooks[index],
        ...updates,
      };

      safeLocalStorage.setItem('webhooks', webhooks);

      return {
        success: true,
        data: webhooks[index],
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Webhook yangilashda xatolik',
      };
    }
  }

  /**
   * Webhook o'chirish
   */
  static async deleteWebhook(webhookId: string): Promise<ApiResponse<void>> {
    try {
      const webhooks =
        safeLocalStorage.getItem<Webhook[]>('webhooks', []) ?? [];
      const filtered = webhooks.filter(w => w.id !== webhookId);
      safeLocalStorage.setItem('webhooks', filtered);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Webhook o'chirishda xatolik",
      };
    }
  }

  /**
   * Webhook'ni chaqirish
   */
  static async triggerWebhook(
    webhookId: string,
    event: string,
    data: unknown
  ): Promise<ApiResponse<boolean>> {
    try {
      const webhooks =
        safeLocalStorage.getItem<Webhook[]>('webhooks', []) ?? [];
      const webhook = webhooks.find(w => w.id === webhookId);

      if (!webhook) {
        return {
          success: false,
          error: 'Webhook topilmadi',
        };
      }

      if (!webhook.enabled) {
        return {
          success: false,
          error: "Webhook o'chirilgan",
        };
      }

      if (!webhook.events.includes(event)) {
        return {
          success: false,
          error: 'Bu event uchun webhook konfiguratsiya qilinmagan',
        };
      }

      // Webhook'ni chaqirish
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Event': event,
          'X-Webhook-Signature': webhook.secret || '',
        },
        body: JSON.stringify({
          event,
          data,
          timestamp: new Date().toISOString(),
        }),
      });

      return {
        success: response.ok,
        data: response.ok,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Webhook chaqirishda xatolik',
      };
    }
  }

  /**
   * Integration'larni olish
   */
  static async getIntegrations(): Promise<ApiResponse<Integration[]>> {
    try {
      // Hozircha localStorage'da saqlaymiz
      const integrations =
        safeLocalStorage.getItem<Integration[]>('integrations', []) ?? [];

      // Date'lar string sifatida saqlangan bo'lishi mumkin
      const parsed = integrations.map(i => ({
        ...i,
        createdAt: new Date(i.createdAt),
      }));

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
            : "Integration'larni olishda xatolik",
      };
    }
  }

  /**
   * Integration yaratish
   */
  static async createIntegration(
    integration: Omit<Integration, 'id' | 'createdAt'>
  ): Promise<ApiResponse<Integration>> {
    try {
      const newIntegration: Integration = {
        ...integration,
        id: `integration-${Date.now()}`,
        createdAt: new Date(),
      };

      const integrations =
        safeLocalStorage.getItem<Integration[]>('integrations', []) ?? [];
      integrations.push(newIntegration);
      safeLocalStorage.setItem('integrations', integrations);

      return {
        success: true,
        data: newIntegration,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Integration yaratishda xatolik',
      };
    }
  }

  /**
   * Integration yangilash
   */
  static async updateIntegration(
    integrationId: string,
    updates: Partial<Integration>
  ): Promise<ApiResponse<Integration>> {
    try {
      const integrations =
        safeLocalStorage.getItem<Integration[]>('integrations', []) ?? [];
      const index = integrations.findIndex(i => i.id === integrationId);

      if (index === -1) {
        return {
          success: false,
          error: 'Integration topilmadi',
        };
      }

      integrations[index] = {
        ...integrations[index],
        ...updates,
      };

      safeLocalStorage.setItem('integrations', integrations);

      return {
        success: true,
        data: integrations[index],
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Integration yangilashda xatolik',
      };
    }
  }

  /**
   * Integration o'chirish
   */
  static async deleteIntegration(
    integrationId: string
  ): Promise<ApiResponse<void>> {
    try {
      const integrations =
        safeLocalStorage.getItem<Integration[]>('integrations', []) ?? [];
      const filtered = integrations.filter(i => i.id !== integrationId);
      safeLocalStorage.setItem('integrations', filtered);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Integration o'chirishda xatolik",
      };
    }
  }

  /**
   * Tayyor integration'lar ro'yxati
   */
  static getAvailableIntegrations(): Array<{
    type: Integration['type'];
    name: string;
    description: string;
    icon: string;
  }> {
    return [
      {
        type: 'zapier',
        name: 'Zapier',
        description: 'Zapier bilan integratsiya',
        icon: '⚡',
      },
      {
        type: 'slack',
        name: 'Slack',
        description: 'Slack bilan integratsiya',
        icon: '💬',
      },
      {
        type: 'teams',
        name: 'Microsoft Teams',
        description: 'Teams bilan integratsiya',
        icon: '👥',
      },
      {
        type: 'google_calendar',
        name: 'Google Calendar',
        description: 'Google Calendar bilan sinxronizatsiya',
        icon: '📅',
      },
      {
        type: 'outlook',
        name: 'Outlook',
        description: 'Outlook bilan sinxronizatsiya',
        icon: '📧',
      },
      {
        type: 'custom',
        name: 'Custom API',
        description: "O'z API'ingizni ulash",
        icon: '🔌',
      },
    ];
  }
}
