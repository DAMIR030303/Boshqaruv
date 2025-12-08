import type {
  ApiResponse,
  Workflow,
  WorkflowAction,
  WorkflowTrigger,
} from '../types';
import { logger } from '../utils/logger';
import { safeLocalStorage } from '../utils/storage';

import { CalendarService } from './calendarService';

/**
 * Workflow servisi - Workflow builder, triggers, automation
 * Takrorlanuvchi jarayonlarni avtomatlashtirish
 */
export class WorkflowService {
  /**
   * Workflow'larni olish
   */
  static async getWorkflows(
    createdBy?: string
  ): Promise<ApiResponse<Workflow[]>> {
    try {
      // Hozircha localStorage'da saqlaymiz
      // Production'da Supabase'ga saqlash kerak
      const workflows =
        safeLocalStorage.getItem<Workflow[]>('workflows', []) ?? [];

      let filtered = workflows;
      if (createdBy) {
        filtered = workflows.filter(w => w.createdBy === createdBy);
      }

      // Date'lar string sifatida saqlangan bo'lishi mumkin
      const parsed = filtered.map(w => ({
        ...w,
        createdAt: new Date(w.createdAt),
        updatedAt: new Date(w.updatedAt),
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
            : "Workflow'larni olishda xatolik",
      };
    }
  }

  /**
   * Workflow yaratish
   */
  static async createWorkflow(
    workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<Workflow>> {
    try {
      const newWorkflow: Workflow = {
        ...workflow,
        id: `workflow-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const workflows =
        safeLocalStorage.getItem<Workflow[]>('workflows', []) ?? [];
      workflows.push(newWorkflow);
      safeLocalStorage.setItem('workflows', workflows);

      return {
        success: true,
        data: newWorkflow,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Workflow yaratishda xatolik',
      };
    }
  }

  /**
   * Workflow yangilash
   */
  static async updateWorkflow(
    workflowId: string,
    updates: Partial<Workflow>
  ): Promise<ApiResponse<Workflow>> {
    try {
      const workflows =
        safeLocalStorage.getItem<Workflow[]>('workflows', []) ?? [];
      const index = workflows.findIndex(w => w.id === workflowId);

      if (index === -1) {
        return {
          success: false,
          error: 'Workflow topilmadi',
        };
      }

      workflows[index] = {
        ...workflows[index],
        ...updates,
        updatedAt: new Date(),
      };

      safeLocalStorage.setItem('workflows', workflows);

      return {
        success: true,
        data: workflows[index],
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Workflow yangilashda xatolik',
      };
    }
  }

  /**
   * Workflow o'chirish
   */
  static async deleteWorkflow(workflowId: string): Promise<ApiResponse<void>> {
    try {
      const workflows =
        safeLocalStorage.getItem<Workflow[]>('workflows', []) ?? [];
      const filtered = workflows.filter(w => w.id !== workflowId);
      safeLocalStorage.setItem('workflows', filtered);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Workflow o'chirishda xatolik",
      };
    }
  }

  /**
   * Workflow'ni ishga tushirish
   */
  static async executeWorkflow(
    workflowId: string
  ): Promise<ApiResponse<{ executed: boolean; actionsRun: number }>> {
    try {
      const workflows =
        safeLocalStorage.getItem<Workflow[]>('workflows', []) ?? [];
      const workflow = workflows.find(w => w.id === workflowId);

      if (!workflow) {
        return {
          success: false,
          error: 'Workflow topilmadi',
        };
      }

      if (!workflow.enabled) {
        return {
          success: false,
          error: "Workflow o'chirilgan",
        };
      }

      // Trigger tekshirish
      const triggerResult = await this.checkTrigger(workflow.trigger);
      if (!triggerResult.shouldExecute) {
        return {
          success: true,
          data: {
            executed: false,
            actionsRun: 0,
          },
        };
      }

      // Action'larni bajarish
      let actionsRun = 0;
      for (const action of workflow.actions) {
        try {
          await this.executeAction(action);
          actionsRun++;
        } catch (error) {
          logger.error(
            'Action execution error',
            error instanceof Error ? error : new Error(String(error))
          );
        }
      }

      return {
        success: true,
        data: {
          executed: true,
          actionsRun,
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Workflow ishga tushirishda xatolik',
      };
    }
  }

  /**
   * Trigger tekshirish
   */
  private static async checkTrigger(
    trigger: WorkflowTrigger
  ): Promise<{ shouldExecute: boolean }> {
    switch (trigger.type) {
      case 'time': {
        // Vaqt bo'yicha trigger
        const schedule = trigger.config.schedule as string;
        const now = new Date();
        const scheduleTime = new Date(schedule);
        return {
          shouldExecute: now >= scheduleTime,
        };
      }

      case 'event':
        // Event bo'yicha trigger
        return {
          shouldExecute: true, // Simplified
        };

      case 'condition':
        // Shart bo'yicha trigger
        return {
          shouldExecute: true, // Simplified
        };

      case 'manual':
        // Manual trigger
        return {
          shouldExecute: true,
        };

      default:
        return {
          shouldExecute: false,
        };
    }
  }

  /**
   * Action bajarish
   */
  private static async executeAction(action: WorkflowAction): Promise<void> {
    switch (action.type) {
      case 'create_task':
        // Vazifa yaratish
        await CalendarService.createEvent({
          title: action.config.title as string,
          type: 'task',
          startDate: new Date(action.config.dueDate as string),
          assignee: action.config.assignee as string,
          description: action.config.description as string,
        });
        break;

      case 'send_notification':
        // Bildirishnoma yuborish
        // NotificationService orqali
        break;

      case 'update_status':
        // Status yangilash
        // Simplified
        break;

      case 'send_email':
        // Email yuborish
        // Simplified
        break;

      case 'webhook':
        // Webhook chaqirish
        if (action.config.url) {
          await fetch(action.config.url as string, {
            method: (action.config.method as string) || 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(action.config.body || {}),
          });
        }
        break;
    }
  }

  /**
   * Tayyor workflow shablonlari
   */
  static getTemplates(): Workflow[] {
    return [
      {
        id: 'template-daily-report',
        name: 'Kunlik hisobot',
        description: 'Har kuni soat 18:00 da kunlik hisobot yaratish',
        trigger: {
          id: 'trigger-1',
          type: 'time',
          config: {
            schedule: '18:00',
            repeat: 'daily',
          },
        },
        actions: [
          {
            id: 'action-1',
            type: 'create_task',
            config: {
              title: 'Kunlik hisobotni tayyorlash',
              assignee: 'admin',
            },
          },
        ],
        enabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
      },
      {
        id: 'template-attendance-alert',
        name: 'Davomat ogohlantirishi',
        description: "Davomat 80% dan past bo'lsa, ogohlantirish yuborish",
        trigger: {
          id: 'trigger-2',
          type: 'condition',
          config: {
            condition: 'attendance < 80',
          },
        },
        actions: [
          {
            id: 'action-2',
            type: 'send_notification',
            config: {
              message: 'Davomat darajasi past!',
            },
          },
        ],
        enabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
      },
    ];
  }
}
