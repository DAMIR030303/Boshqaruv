import { useCallback, useEffect, useState } from 'react';

import { Award, Medal, Star, Target, Trophy, Users } from 'lucide-react';
import { toast } from 'sonner';

import { GamificationService } from '../../services/gamificationService';
import type {
  Achievement,
  Challenge,
  UserPoints,
  UserProfile,
} from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface LeaderboardProps {
  /** Foydalanuvchi profil ma'lumotlari */
  userProfile?: UserProfile;
}

/**
 * Leaderboard - Reyting jadvali va yutuqlar
 * Points system, achievements, challenges
 */
export function Leaderboard({ userProfile }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<UserPoints[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'leaderboard' | 'achievements' | 'challenges'
  >('leaderboard');

  // Leaderboard yuklash
  const loadLeaderboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await GamificationService.getLeaderboard(20);

      if (result.success && result.data) {
        setLeaderboard(result.data);
      } else {
        toast.error(result.error || 'Leaderboard yuklashda xatolik');
      }
    } catch (error) {
      toast.error('Leaderboard yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Achievements yuklash
  const loadAchievements = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await GamificationService.getAchievements(
        userProfile?.name
      );

      if (result.success && result.data) {
        setAchievements(result.data);
      } else {
        toast.error(result.error || "Achievement'lar yuklashda xatolik");
      }
    } catch (error) {
      toast.error("Achievement'lar yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  }, [userProfile?.name]);

  // Challenges yuklash
  const loadChallenges = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await GamificationService.getChallenges();

      if (result.success && result.data) {
        setChallenges(result.data);
      } else {
        toast.error(result.error || "Challenge'lar yuklashda xatolik");
      }
    } catch (error) {
      toast.error("Challenge'lar yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // User points yuklash
  const loadUserPoints = useCallback(async () => {
    if (!userProfile?.name) return;

    try {
      const result = await GamificationService.getUserPoints(userProfile.name);

      if (result.success && result.data) {
        setUserPoints(result.data);
      }
    } catch (error) {
      // Silent fail
    }
  }, [userProfile?.name]);

  useEffect(() => {
    loadLeaderboard();
    loadUserPoints();
  }, [loadLeaderboard, loadUserPoints]);

  useEffect(() => {
    if (activeTab === 'achievements') {
      loadAchievements();
    } else if (activeTab === 'challenges') {
      loadChallenges();
    }
  }, [activeTab, loadAchievements, loadChallenges]);

  // Rank icon
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-500" />;
    return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
  };

  // Level badge color
  const getLevelColor = (level: number) => {
    if (level >= 10) return 'bg-purple-500';
    if (level >= 5) return 'bg-blue-500';
    if (level >= 3) return 'bg-green-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Reyting va Yutuqlar
          </h2>
        </div>
      </div>

      {/* User stats */}
      {userPoints && (
        <Card
          padding="md"
          className="bg-gradient-to-r from-primary-500 to-primary-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Sizning ballaringiz</p>
              <p className="text-3xl font-bold">{userPoints.totalPoints}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(userPoints.level)}`}
                >
                  Level {userPoints.level}
                </span>
                <span className="text-sm opacity-90">
                  {userPoints.achievements.length} ta yutuq
                </span>
              </div>
            </div>
            <Star className="w-12 h-12 opacity-80" />
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button
          variant={activeTab === 'leaderboard' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('leaderboard')}
        >
          <Trophy className="w-4 h-4 mr-1" />
          Reyting
        </Button>
        <Button
          variant={activeTab === 'achievements' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('achievements')}
        >
          <Award className="w-4 h-4 mr-1" />
          Yutuqlar
        </Button>
        <Button
          variant={activeTab === 'challenges' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('challenges')}
        >
          <Target className="w-4 h-4 mr-1" />
          Qiyinchiliklar
        </Button>
      </div>

      {/* Leaderboard tab */}
      {activeTab === 'leaderboard' && (
        <>
          {isLoading ? (
            <Card padding="md">
              <div className="text-center py-8 text-gray-500">
                Yuklanmoqda...
              </div>
            </Card>
          ) : leaderboard.length === 0 ? (
            <Card padding="md">
              <div className="text-center py-8 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Reyting jadvali bo'sh</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-2">
              {leaderboard.map(user => (
                <Card
                  key={user.userId}
                  padding="md"
                  className={
                    user.userId === userProfile?.name
                      ? 'ring-2 ring-primary-500'
                      : ''
                  }
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getRankIcon(user.rank)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {user.userId}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(user.level)} text-white`}
                          >
                            L{user.level}
                          </span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {user.totalPoints}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{user.achievements.length} ta yutuq</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Achievements tab */}
      {activeTab === 'achievements' && (
        <>
          {isLoading ? (
            <Card padding="md">
              <div className="text-center py-8 text-gray-500">
                Yuklanmoqda...
              </div>
            </Card>
          ) : achievements.length === 0 ? (
            <Card padding="md">
              <div className="text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Achievement'lar mavjud emas</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {achievements.map(achievement => (
                <Card
                  key={achievement.id}
                  padding="md"
                  className={
                    achievement.unlockedAt
                      ? 'bg-yellow-50 dark:bg-yellow-900/20'
                      : 'opacity-60'
                  }
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {achievement.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        {achievement.points}
                      </span>
                    </div>
                    {achievement.unlockedAt && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                        ✓ Ochlangan
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Challenges tab */}
      {activeTab === 'challenges' && (
        <>
          {isLoading ? (
            <Card padding="md">
              <div className="text-center py-8 text-gray-500">
                Yuklanmoqda...
              </div>
            </Card>
          ) : challenges.length === 0 ? (
            <Card padding="md">
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Challenge'lar mavjud emas</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {challenges.map(challenge => (
                <Card key={challenge.id} padding="md">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {challenge.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {challenge.description}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        challenge.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : challenge.status === 'completed'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {challenge.status === 'active'
                        ? 'Faol'
                        : challenge.status === 'completed'
                          ? 'Yakunlangan'
                          : challenge.status === 'upcoming'
                            ? 'Kutilmoqda'
                            : 'Bekor qilingan'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {challenge.participants.length} ishtirokchi
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        {challenge.current}/{challenge.target}
                      </span>
                      <span className="font-semibold text-primary-500">
                        +{challenge.reward} ball
                      </span>
                    </div>
                  </div>
                  {challenge.status === 'active' &&
                    !challenge.participants.includes(
                      userProfile?.name || ''
                    ) && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full mt-3"
                        onClick={async () => {
                          const result =
                            await GamificationService.joinChallenge(
                              challenge.id,
                              userProfile?.name || ''
                            );
                          if (result.success) {
                            toast.success("Challenge'ga qo'shildingiz!");
                            loadChallenges();
                          } else {
                            toast.error(result.error || "Qo'shilishda xatolik");
                          }
                        }}
                      >
                        Qo'shilish
                      </Button>
                    )}
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
