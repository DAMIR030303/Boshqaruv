import { useCallback, useEffect, useState } from 'react';

import {
  AlertTriangle,
  Calendar,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

import { AIService } from '../../services/aiService';
import type { SmartRecommendation, UserProfile } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface AIAssistantProps {
  /** Foydalanuvchi profil ma'lumotlari */
  userProfile?: UserProfile;
}

/**
 * AIAssistant - AI yordamchi va tavsiyalar paneli
 * Smart recommendations va AI-powered features
 */
export function AIAssistant({ userProfile: _userProfile }: AIAssistantProps) {
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'recommendations' | 'alerts' | 'content'
  >('recommendations');
  const [contentPrompt, setContentPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Tavsiyalarni yuklash
  const loadRecommendations = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await AIService.getSmartRecommendations(
        _userProfile?.name
      );

      if (result.success && result.data) {
        setRecommendations(result.data);
      } else {
        toast.error(result.error || 'Tavsiyalarni yuklashda xatolik');
      }
    } catch (error) {
      toast.error('Tavsiyalarni yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  }, [_userProfile?.name]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  // Predictive alerts yuklash
  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const result = await AIService.getPredictiveAlerts(_userProfile?.name);

      if (result.success && result.data) {
        setRecommendations(result.data);
      } else {
        toast.error(result.error || 'Alertlarni yuklashda xatolik');
      }
    } catch (error) {
      toast.error('Alertlarni yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  };

  // Content generation
  const handleGenerateContent = async () => {
    if (!contentPrompt.trim()) {
      toast.error('Iltimos, mavzuni kiriting');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await AIService.generateContent(
        'instagram_post',
        contentPrompt,
        'professional'
      );

      if (result.success && result.data) {
        toast.success('Kontent yaratildi!');
        setContentPrompt('');
        // Content'ni ko'rsatish (keyinchalik modal yoki alohida sahifa)
      } else {
        toast.error(result.error || 'Kontent yaratishda xatolik');
      }
    } catch (error) {
      toast.error('Kontent yaratishda xatolik');
    } finally {
      setIsGenerating(false);
    }
  };

  // Recommendation icon olish
  const getRecommendationIcon = (type: SmartRecommendation['type']) => {
    switch (type) {
      case 'task':
        return <Zap className="w-5 h-5 text-blue-500" />;
      case 'schedule':
        return <Calendar className="w-5 h-5 text-green-500" />;
      case 'optimization':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-primary-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Yordamchi
          </h2>
        </div>
        <Button variant="ghost" size="sm" onClick={loadRecommendations}>
          Yangilash
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button
          variant={activeTab === 'recommendations' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => {
            setActiveTab('recommendations');
            loadRecommendations();
          }}
        >
          <Lightbulb className="w-4 h-4 mr-1" />
          Tavsiyalar
        </Button>
        <Button
          variant={activeTab === 'alerts' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => {
            setActiveTab('alerts');
            loadAlerts();
          }}
        >
          <AlertTriangle className="w-4 h-4 mr-1" />
          Alertlar
        </Button>
        <Button
          variant={activeTab === 'content' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('content')}
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          Kontent
        </Button>
      </div>

      {/* Recommendations tab */}
      {activeTab === 'recommendations' && (
        <>
          {isLoading ? (
            <Card padding="md">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
                <p className="text-gray-500">Tavsiyalar yuklanmoqda...</p>
              </div>
            </Card>
          ) : recommendations.length === 0 ? (
            <Card padding="md">
              <div className="text-center py-8 text-gray-500">
                <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Tavsiyalar mavjud emas</p>
                <p className="text-sm mt-2">Hammasi yaxshi! 🎉</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {recommendations.map(rec => (
                <Card key={rec.id} padding="md">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getRecommendationIcon(rec.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {rec.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            rec.priority === 'high'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                              : rec.priority === 'medium'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {rec.priority === 'high'
                            ? 'Yuqori'
                            : rec.priority === 'medium'
                              ? "O'rtacha"
                              : 'Past'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {rec.description}
                      </p>
                      {rec.reasoning && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                          💡 {rec.reasoning}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500">
                          Ishonchlilik: {rec.confidence}%
                        </span>
                        {rec.actionUrl && (
                          <Button variant="ghost" size="sm">
                            Batafsil
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Alerts tab */}
      {activeTab === 'alerts' && (
        <>
          {isLoading ? (
            <Card padding="md">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
                <p className="text-gray-500">Alertlar yuklanmoqda...</p>
              </div>
            </Card>
          ) : recommendations.length === 0 ? (
            <Card padding="md">
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Alertlar mavjud emas</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {recommendations.map(rec => (
                <Card
                  key={rec.id}
                  padding="md"
                  className="border-l-4 border-red-500"
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {rec.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {rec.description}
                      </p>
                      {rec.reasoning && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {rec.reasoning}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Content generation tab */}
      {activeTab === 'content' && (
        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Kontent Yaratish
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mavzu
              </label>
              <input
                type="text"
                value={contentPrompt}
                onChange={e => setContentPrompt(e.target.value)}
                placeholder="Masalan: Yangi mahsulotni tanishtirish"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="primary"
                onClick={handleGenerateContent}
                disabled={isGenerating || !contentPrompt.trim()}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Yaratilmoqda...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Kontent Yaratish
                  </>
                )}
              </Button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 AI yordamida Instagram post, video script, maqola yoki email
              yaratish mumkin
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
