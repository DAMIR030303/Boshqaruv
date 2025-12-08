import type { Achievement, ApiResponse, Challenge, UserPoints } from '../types';
import { safeLocalStorage } from '../utils/storage';

/**
 * Gamification servisi - Points system, achievements, leaderboard
 * Xodimlarni motivatsiya qilish va samaradorlikni oshirish
 */
export class GamificationService {
  /**
   * Foydalanuvchi ballarini olish
   */
  static async getUserPoints(userId: string): Promise<ApiResponse<UserPoints>> {
    try {
      // Hozircha localStorage'da saqlaymiz
      const userPoints = safeLocalStorage.getItem<UserPoints>(
        `points-${userId}`,
        null
      );

      if (!userPoints) {
        // Default yaratish
        const defaultPoints: UserPoints = {
          userId,
          totalPoints: 0,
          level: 1,
          achievements: [],
          rank: 0,
        };
        safeLocalStorage.setItem(`points-${userId}`, defaultPoints);
        return {
          success: true,
          data: defaultPoints,
        };
      }

      return {
        success: true,
        data: userPoints,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Ballarni olishda xatolik',
      };
    }
  }

  /**
   * Ballar qo'shish
   */
  static async addPoints(
    userId: string,
    points: number,
    _reason: string
  ): Promise<ApiResponse<UserPoints>> {
    try {
      const result = await this.getUserPoints(userId);
      if (!result.success || !result.data) {
        return result;
      }

      const userPoints = result.data;
      const newTotalPoints = userPoints.totalPoints + points;
      const newLevel = Math.floor(newTotalPoints / 100) + 1; // Har 100 ball = 1 level

      const updated: UserPoints = {
        ...userPoints,
        totalPoints: newTotalPoints,
        level: newLevel,
      };

      safeLocalStorage.setItem(`points-${userId}`, updated);

      // Achievement tekshirish
      await this.checkAchievements(userId);

      return {
        success: true,
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Ballar qo'shishda xatolik",
      };
    }
  }

  /**
   * Achievement'lar ro'yxatini olish
   */
  static async getAchievements(
    userId?: string
  ): Promise<ApiResponse<Achievement[]>> {
    try {
      const allAchievements: Achievement[] = [
        {
          id: 'first-task',
          name: 'Birinchi vazifa',
          description: 'Birinchi vazifani bajarish',
          icon: '🎯',
          points: 10,
          category: 'tasks',
        },
        {
          id: 'task-master',
          name: 'Vazifa ustasi',
          description: '10 ta vazifani bajarish',
          icon: '⭐',
          points: 50,
          category: 'tasks',
        },
        {
          id: 'perfect-attendance',
          name: 'Mukammal davomat',
          description: 'Bir hafta davomida 100% davomat',
          icon: '🏆',
          points: 100,
          category: 'attendance',
        },
        {
          id: 'early-bird',
          name: 'Erta qush',
          description: 'Bir hafta davomida vaqtida kelish',
          icon: '🐦',
          points: 75,
          category: 'attendance',
        },
        {
          id: 'team-player',
          name: "Jamoa o'yinchisi",
          description: "10 ta sharh qo'shish",
          icon: '👥',
          points: 30,
          category: 'social',
        },
        {
          id: 'productivity-guru',
          name: 'Samaradorlik gurusi',
          description: 'Samaradorlik 90% dan yuqori',
          icon: '📈',
          points: 150,
          category: 'productivity',
        },
      ];

      // Agar userId berilgan bo'lsa, uning ochilgan achievement'larini belgilash
      if (userId) {
        const userPoints = await this.getUserPoints(userId);
        if (userPoints.success && userPoints.data) {
          const unlockedIds = userPoints.data.achievements.map(a => a.id);
          return {
            success: true,
            data: allAchievements.map(a => ({
              ...a,
              unlockedAt: unlockedIds.includes(a.id) ? new Date() : undefined,
            })),
          };
        }
      }

      return {
        success: true,
        data: allAchievements,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Achievement'larni olishda xatolik",
      };
    }
  }

  /**
   * Achievement'lar tekshirish
   */
  static async checkAchievements(
    userId: string
  ): Promise<ApiResponse<Achievement[]>> {
    try {
      const userPoints = await this.getUserPoints(userId);
      if (!userPoints.success || !userPoints.data) {
        return { success: false, error: 'Foydalanuvchi topilmadi' };
      }

      const achievements = await this.getAchievements(userId);
      if (!achievements.success || !achievements.data) {
        return { success: false, error: "Achievement'lar topilmadi" };
      }

      const unlockedIds = userPoints.data.achievements.map(a => a.id);
      const newAchievements: Achievement[] = [];

      // Achievement'lar tekshirish (simplified)
      for (const achievement of achievements.data) {
        if (!unlockedIds.includes(achievement.id)) {
          // Achievement shartlarini tekshirish
          let shouldUnlock = false;

          switch (achievement.id) {
            case 'first-task':
              // Simplified - real implementation would check task count
              if (userPoints.data.totalPoints >= 10) {
                shouldUnlock = true;
              }
              break;
            case 'task-master':
              if (userPoints.data.totalPoints >= 100) {
                shouldUnlock = true;
              }
              break;
            // Boshqa achievement'lar...
          }

          if (shouldUnlock) {
            newAchievements.push({
              ...achievement,
              unlockedAt: new Date(),
            });
          }
        }
      }

      // Yangi achievement'larni qo'shish
      if (newAchievements.length > 0) {
        const updated: UserPoints = {
          ...userPoints.data,
          achievements: [...userPoints.data.achievements, ...newAchievements],
        };
        safeLocalStorage.setItem(`points-${userId}`, updated);
      }

      return {
        success: true,
        data: newAchievements,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Achievement'larni tekshirishda xatolik",
      };
    }
  }

  /**
   * Leaderboard olish
   */
  static async getLeaderboard(
    limit: number = 10
  ): Promise<ApiResponse<UserPoints[]>> {
    try {
      // Barcha foydalanuvchilarning ballarini olish
      const allUserPoints: UserPoints[] = [];

      // localStorage'dan barcha ballarni olish (simplified)
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('points-')) {
          const userId = key.replace('points-', '');
          const result = await this.getUserPoints(userId);
          if (result.success && result.data) {
            allUserPoints.push(result.data);
          }
        }
      }

      // Rank hisoblash va tartiblash
      const sorted = allUserPoints
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((user, index) => ({
          ...user,
          rank: index + 1,
        }))
        .slice(0, limit);

      return {
        success: true,
        data: sorted,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Leaderboard olishda xatolik',
      };
    }
  }

  /**
   * Challenge'lar olish
   */
  static async getChallenges(): Promise<ApiResponse<Challenge[]>> {
    try {
      // Hozircha localStorage'da saqlaymiz
      const challenges =
        safeLocalStorage.getItem<Challenge[]>('challenges', []) ?? [];

      // Date'lar string sifatida saqlangan bo'lishi mumkin
      const parsed = challenges.map(c => ({
        ...c,
        startDate: new Date(c.startDate),
        endDate: new Date(c.endDate),
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
            : "Challenge'larni olishda xatolik",
      };
    }
  }

  /**
   * Challenge yaratish
   */
  static async createChallenge(
    challenge: Omit<Challenge, 'id'>
  ): Promise<ApiResponse<Challenge>> {
    try {
      const newChallenge: Challenge = {
        ...challenge,
        id: `challenge-${Date.now()}`,
      };

      const challenges =
        safeLocalStorage.getItem<Challenge[]>('challenges', []) ?? [];
      challenges.push(newChallenge);
      safeLocalStorage.setItem('challenges', challenges);

      return {
        success: true,
        data: newChallenge,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Challenge yaratishda xatolik',
      };
    }
  }

  /**
   * Challenge'ga qo'shilish
   */
  static async joinChallenge(
    challengeId: string,
    userId: string
  ): Promise<ApiResponse<Challenge>> {
    try {
      const challenges =
        safeLocalStorage.getItem<Challenge[]>('challenges', []) ?? [];
      const index = challenges.findIndex(c => c.id === challengeId);

      if (index === -1) {
        return {
          success: false,
          error: 'Challenge topilmadi',
        };
      }

      if (challenges[index].participants.includes(userId)) {
        return {
          success: false,
          error: "Siz allaqachon qo'shilgansiz",
        };
      }

      challenges[index].participants.push(userId);
      safeLocalStorage.setItem('challenges', challenges);

      return {
        success: true,
        data: challenges[index],
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Challenge'ga qo'shilishda xatolik",
      };
    }
  }
}
