import type {
  AIContent,
  ApiResponse,
  SmartRecommendation,
  Task,
} from '../types';

import { AnalyticsService } from './analyticsService';
import { CalendarService } from './calendarService';
import { MeetingService } from './meetingService';

/**
 * AI servisi - Smart recommendations, content generation, predictive alerts
 * Sun'iy intellekt yordamida aqlli tavsiyalar va avtomatlashtirish
 */
export class AIService {
  /**
   * Smart task recommendations - AI yordamida vazifa tavsiyalari
   */
  static async getSmartRecommendations(
    _userName?: string
  ): Promise<ApiResponse<SmartRecommendation[]>> {
    try {
      const recommendations: SmartRecommendation[] = [];

      // Performance insights olish
      const insightsResult =
        await AnalyticsService.getPerformanceInsights(_userName);
      const insights =
        insightsResult.success && insightsResult.data
          ? insightsResult.data
          : [];

      // Past samaradorlik bo'yicha tavsiyalar
      const lowProductivityInsight = insights.find(
        i => i.type === 'productivity' && i.value < 70
      );
      if (lowProductivityInsight) {
        recommendations.push({
          id: 'productivity-optimization',
          type: 'optimization',
          title: 'Samaradorlikni oshirish',
          description:
            "Samaradorlik past ko'rsatkichda. Vazifalarni prioritetlashtirish va resurslarni qayta taqsimlash tavsiya etiladi.",
          priority: 'high',
          confidence: 85,
          reasoning: `Hozirgi samaradorlik: ${lowProductivityInsight.value.toFixed(1)}%. O'rtacha ko'rsatkichdan past.`,
        });
      }

      // Davomat muammolari bo'yicha tavsiyalar
      const attendanceInsight = insights.find(
        i => i.type === 'attendance' && i.value < 80
      );
      if (attendanceInsight) {
        recommendations.push({
          id: 'attendance-improvement',
          type: 'alert',
          title: 'Davomatni yaxshilash',
          description:
            'Davomat darajasi past. Xodimlar bilan muloqot qilish va muammolarni aniqlash tavsiya etiladi.',
          priority: 'high',
          confidence: 90,
          reasoning: `Davomat darajasi: ${attendanceInsight.value.toFixed(1)}%`,
        });
      }

      // Vazifalar bo'yicha tavsiyalar
      const tasksInsight = insights.find(
        i => i.type === 'tasks' && i.value < 75
      );
      if (tasksInsight) {
        recommendations.push({
          id: 'task-management',
          type: 'task',
          title: 'Vazifalar boshqaruvini yaxshilash',
          description:
            "Vazifalar bajarilish darajasi past. Vazifalarni qayta ko'rib chiqish va resurslarni optimallashtirish tavsiya etiladi.",
          priority: 'medium',
          confidence: 80,
          reasoning: `Vazifalar bajarilishi: ${tasksInsight.value.toFixed(1)}%`,
        });
      }

      // Kelgusi uchrashuvlar bo'yicha tavsiyalar
      const meetingsResult = await MeetingService.getUpcomingMeetings(
        1,
        _userName
      );
      if (
        meetingsResult.success &&
        meetingsResult.data &&
        meetingsResult.data.length > 5
      ) {
        recommendations.push({
          id: 'meeting-optimization',
          type: 'schedule',
          title: 'Uchrashuvlarni optimallashtirish',
          description: `Bugun ${meetingsResult.data.length} ta uchrashuv rejalashtirilgan. Ba'zi uchrashuvlarni birlashtirish yoki qayta rejalashtirish tavsiya etiladi.`,
          priority: 'medium',
          confidence: 75,
          reasoning: `Jami uchrashuvlar: ${meetingsResult.data.length}`,
        });
      }

      // Muddatlar bo'yicha tavsiyalar
      const deadlinesResult = await CalendarService.getUpcomingDeadlines(
        3,
        _userName
      );
      if (deadlinesResult.success && deadlinesResult.data) {
        const overdue = deadlinesResult.data.filter(
          d => d.status === 'overdue'
        );
        if (overdue.length > 0) {
          recommendations.push({
            id: 'deadline-alert',
            type: 'alert',
            title: "Muddati o'tgan vazifalar",
            description: `${overdue.length} ta vazifaning muddati o'tgan. Darhol e'tibor berish tavsiya etiladi.`,
            priority: 'high',
            confidence: 95,
            reasoning: `O'tgan muddatlar: ${overdue.length}`,
          });
        }
      }

      return {
        success: true,
        data: recommendations.sort((a, b) => {
          // Priority va confidence bo'yicha tartiblash
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          }
          return b.confidence - a.confidence;
        }),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Smart recommendations olishda xatolik',
      };
    }
  }

  /**
   * Auto-scheduling - Avtomatik vazifalar rejalashtirish
   */
  static async autoScheduleTasks(tasks: Task[]): Promise<ApiResponse<Task[]>> {
    try {
      // Oddiy algoritm: prioritet va muddat bo'yicha tartiblash
      const scheduled = [...tasks].sort((a, b) => {
        // Priority tartibi
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff =
          priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;

        // Muddati yaqin bo'lganlar birinchi
        return a.dueDate.getTime() - b.dueDate.getTime();
      });

      return {
        success: true,
        data: scheduled,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Auto-scheduling xatolik',
      };
    }
  }

  /**
   * Content generation - Marketing kontent yaratish (AI)
   */
  static async generateContent(
    type: 'instagram_post' | 'video_script' | 'article' | 'email',
    topic: string,
    tone?: 'professional' | 'casual' | 'friendly'
  ): Promise<ApiResponse<AIContent>> {
    try {
      // Mock AI content generation
      // Production'da real AI API (OpenAI, Anthropic) ishlatiladi

      const templates: Record<string, Record<string, string>> = {
        instagram_post: {
          professional: `📊 ${topic}\n\nBizning jamoamiz ${topic} sohasida professional yechimlar taklif etadi. Biz bilan bog'laning va bizning xizmatlarimizdan foydalaning!\n\n#Boshqaruv #Professional`,
          casual: `Hey! ${topic} haqida qiziqasizmi? 😊\n\nBizning jamoamiz sizga yordam berishga tayyor! Keling, birgalikda yaxshi natijalarga erishamiz! 🚀\n\n#Boshqaruv #Team`,
          friendly: `Salom! 👋\n\n${topic} bo'yicha bizning jamoamiz sizga yordam berishga tayyor! Keling, birgalikda ishlaymiz! 💪\n\n#Boshqaruv #Together`,
        },
        video_script: {
          professional: `[Video Script: ${topic}]\n\n1. Kirish (0-10s): "Bugun biz ${topic} haqida gaplashamiz"\n2. Asosiy qism (10-60s): ${topic} ning asosiy jihatlari\n3. Xulosa (60-70s): "Xulosa qilib aytganda..."\n\nCall to Action: Biz bilan bog'laning!`,
          casual: `[Video Script: ${topic}]\n\nHey! Bugun ${topic} haqida video tayyorladik! 😊\n\nKeling, birga ko'rib chiqamiz va fikrlarimizni baham ko'ramiz!`,
          friendly: `[Video Script: ${topic}]\n\nSalom! Bugun ${topic} haqida qiziqarli video! 🎬\n\nKeling, birga o'rganamiz va kulguli vaqt o'tkazamiz!`,
        },
        article: {
          professional: `# ${topic}\n\n## Kirish\n\n${topic} zamonaviy biznesda muhim rol o'ynaydi. Ushbu maqolada biz ${topic} ning asosiy jihatlarini ko'rib chiqamiz.\n\n## Asosiy qism\n\n${topic} ni to'g'ri tushunish va qo'llash muvaffaqiyatning kalitidir.\n\n## Xulosa\n\n${topic} bo'yicha professional yondashuv kerak.`,
          casual: `# ${topic} - Qiziqarli Maqola\n\nHey! Bugun ${topic} haqida yozmoqchiman. Bu juda qiziqarli mavzu!\n\nKeling, birga o'rganamiz! 😊`,
          friendly: `# ${topic} - Do'stona Maqola\n\nSalom! 👋\n\nBugun ${topic} haqida gaplashamiz. Bu haqida nima bilasiz? Keling, birgalikda o'rganamiz!`,
        },
        email: {
          professional: `Mavzu: ${topic}\n\nHurmatli mijoz,\n\n${topic} bo'yicha sizga professional yechim taklif etamiz.\n\nHurmat bilan,\nBoshqaruv jamoasi`,
          casual: `Mavzu: ${topic}\n\nSalom!\n\n${topic} haqida gaplashmoqchimiz. Keling, birgalikda hal qilamiz!\n\nYaxshi kunlar!`,
          friendly: `Mavzu: ${topic}\n\nHey! 👋\n\n${topic} bo'yicha sizga yordam berishga tayyormiz! Keling, birgalikda ishlaymiz!\n\nDo'stona,\nJamoamiz`,
        },
      };

      const selectedTone = tone || 'professional';
      const content = templates[type]?.[selectedTone] || `Content for ${topic}`;

      const aiContent: AIContent = {
        id: `ai-content-${Date.now()}`,
        type,
        title: `${topic} - ${type}`,
        content,
        generatedAt: new Date(),
        metadata: {
          tone: selectedTone,
          topic,
        },
      };

      return {
        success: true,
        data: aiContent,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Content generation xatolik',
      };
    }
  }

  /**
   * Predictive alerts - Muammolarni oldindan aniqlash
   */
  static async getPredictiveAlerts(
    _userName?: string
  ): Promise<ApiResponse<SmartRecommendation[]>> {
    try {
      const alerts: SmartRecommendation[] = [];

      // Predictive analytics olish
      const predictionsResult = await AnalyticsService.getPredictions(
        'attendance',
        'weekly'
      );
      if (predictionsResult.success && predictionsResult.data) {
        for (const prediction of predictionsResult.data) {
          if (prediction.predictedValue < 80 && prediction.confidence > 70) {
            alerts.push({
              id: `predictive-attendance-${prediction.metric}`,
              type: 'alert',
              title: 'Davomat pasayishi bashorati',
              description: `Keyingi haftada davomat ${prediction.predictedValue.toFixed(1)}% ga tushishi mumkin. Oldindan choralar ko'rish tavsiya etiladi.`,
              priority: 'high',
              confidence: prediction.confidence,
              reasoning: `Bashorat: ${prediction.predictedValue.toFixed(1)}% (ishonchlilik: ${prediction.confidence}%)`,
            });
          }
        }
      }

      // Vazifalar bashorati
      const tasksPrediction = await AnalyticsService.getPredictions(
        'tasks',
        'weekly'
      );
      if (tasksPrediction.success && tasksPrediction.data) {
        for (const prediction of tasksPrediction.data) {
          if (prediction.predictedValue < 70 && prediction.confidence > 70) {
            alerts.push({
              id: `predictive-tasks-${prediction.metric}`,
              type: 'alert',
              title: 'Vazifalar bajarilishi pasayishi bashorati',
              description: `Keyingi haftada vazifalar bajarilishi ${prediction.predictedValue.toFixed(1)}% ga tushishi mumkin. Resurslarni qayta ko'rib chiqish tavsiya etiladi.`,
              priority: 'medium',
              confidence: prediction.confidence,
              reasoning: `Bashorat: ${prediction.predictedValue.toFixed(1)}%`,
            });
          }
        }
      }

      return {
        success: true,
        data: alerts,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Predictive alerts olishda xatolik',
      };
    }
  }

  /**
   * Smart notifications - Faqat muhim bildirishnomalar
   */
  static async getSmartNotifications(
    _userName?: string
  ): Promise<ApiResponse<SmartRecommendation[]>> {
    try {
      // Smart recommendations va predictive alerts ni birlashtirish
      const [recommendationsResult, alertsResult] = await Promise.all([
        this.getSmartRecommendations(_userName),
        this.getPredictiveAlerts(_userName),
      ]);

      const notifications: SmartRecommendation[] = [];

      if (recommendationsResult.success && recommendationsResult.data) {
        notifications.push(
          ...recommendationsResult.data.filter(r => r.priority === 'high')
        );
      }

      if (alertsResult.success && alertsResult.data) {
        notifications.push(...alertsResult.data);
      }

      // Faqat eng muhimlarini qaytarish (top 5)
      return {
        success: true,
        data: notifications
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 5),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Smart notifications olishda xatolik',
      };
    }
  }
}
