import { useEffect, useState } from 'react';

import {
  CheckCircle,
  Plug,
  Plus,
  Trash2,
  Webhook as WebhookIcon,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

import { IntegrationService } from '../../services/integrationService';
import type { Integration, Webhook } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

/**
 * IntegrationHub - Tashqi integratsiyalar boshqaruvi
 * API marketplace, webhooks, external integrations
 */
export function IntegrationHub() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'integrations' | 'webhooks'>(
    'integrations'
  );
  const [showAddIntegration, setShowAddIntegration] = useState(false);
  const [showAddWebhook, setShowAddWebhook] = useState(false);

  // Integration'larni yuklash
  const loadIntegrations = async () => {
    setIsLoading(true);
    try {
      const result = await IntegrationService.getIntegrations();

      if (result.success && result.data) {
        setIntegrations(result.data);
      } else {
        toast.error(result.error || "Integration'larni yuklashda xatolik");
      }
    } catch (error) {
      toast.error("Integration'larni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  // Webhook'larni yuklash
  const loadWebhooks = async () => {
    setIsLoading(true);
    try {
      const result = await IntegrationService.getWebhooks();

      if (result.success && result.data) {
        setWebhooks(result.data);
      } else {
        toast.error(result.error || "Webhook'larni yuklashda xatolik");
      }
    } catch (error) {
      toast.error("Webhook'larni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'integrations') {
      loadIntegrations();
    } else {
      loadWebhooks();
    }
  }, [activeTab]);

  // Integration yoqish/o'chirish
  const handleToggleIntegration = async (
    integrationId: string,
    enabled: boolean
  ) => {
    try {
      const result = await IntegrationService.updateIntegration(integrationId, {
        enabled,
      });

      if (result.success) {
        await loadIntegrations();
        toast.success(`Integration ${enabled ? 'yoqildi' : "o'chirildi"}`);
      } else {
        toast.error(result.error || 'Integration yangilashda xatolik');
      }
    } catch (error) {
      toast.error('Integration yangilashda xatolik');
    }
  };

  // Integration o'chirish
  const handleDeleteIntegration = async (integrationId: string) => {
    if (!confirm("Bu integration'ni o'chirishni xohlaysizmi?")) {
      return;
    }

    try {
      const result = await IntegrationService.deleteIntegration(integrationId);

      if (result.success) {
        await loadIntegrations();
        toast.success("Integration o'chirildi");
      } else {
        toast.error(result.error || "Integration o'chirishda xatolik");
      }
    } catch (error) {
      toast.error("Integration o'chirishda xatolik");
    }
  };

  // Webhook yoqish/o'chirish
  const handleToggleWebhook = async (webhookId: string, enabled: boolean) => {
    try {
      const result = await IntegrationService.updateWebhook(webhookId, {
        enabled,
      });

      if (result.success) {
        await loadWebhooks();
        toast.success(`Webhook ${enabled ? 'yoqildi' : "o'chirildi"}`);
      } else {
        toast.error(result.error || 'Webhook yangilashda xatolik');
      }
    } catch (error) {
      toast.error('Webhook yangilashda xatolik');
    }
  };

  // Webhook o'chirish
  const handleDeleteWebhook = async (webhookId: string) => {
    if (!confirm("Bu webhook'ni o'chirishni xohlaysizmi?")) {
      return;
    }

    try {
      const result = await IntegrationService.deleteWebhook(webhookId);

      if (result.success) {
        await loadWebhooks();
        toast.success("Webhook o'chirildi");
      } else {
        toast.error(result.error || "Webhook o'chirishda xatolik");
      }
    } catch (error) {
      toast.error("Webhook o'chirishda xatolik");
    }
  };

  // Integration type label
  const getIntegrationLabel = (type: Integration['type']) => {
    const available = IntegrationService.getAvailableIntegrations();
    return available.find(a => a.type === type)?.name || type;
  };

  // Integration icon
  const getIntegrationIcon = (type: Integration['type']) => {
    const available = IntegrationService.getAvailableIntegrations();
    return available.find(a => a.type === type)?.icon || '🔌';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Plug className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Integration Hub
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button
          variant={activeTab === 'integrations' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('integrations')}
        >
          <Plug className="w-4 h-4 mr-1" />
          Integration'lar
        </Button>
        <Button
          variant={activeTab === 'webhooks' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('webhooks')}
        >
          <WebhookIcon className="w-4 h-4 mr-1" />
          Webhook'lar
        </Button>
      </div>

      {/* Integrations tab */}
      {activeTab === 'integrations' && (
        <>
          {/* Available integrations */}
          <Card padding="md">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Mavjud Integration'lar
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {IntegrationService.getAvailableIntegrations().map(
                integration => (
                  <div
                    key={integration.type}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setShowAddIntegration(true)}
                  >
                    <div className="text-2xl mb-1">{integration.icon}</div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {integration.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {integration.description}
                    </p>
                  </div>
                )
              )}
            </div>
          </Card>

          {/* Active integrations */}
          {isLoading ? (
            <Card padding="md">
              <div className="text-center py-8 text-gray-500">
                Yuklanmoqda...
              </div>
            </Card>
          ) : integrations.length === 0 ? (
            <Card padding="md">
              <div className="text-center py-8 text-gray-500">
                <Plug className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Integration'lar mavjud emas</p>
                <p className="text-sm mt-2">Yuqoridagi ro'yxatdan qo'shing</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {integrations.map(integration => (
                <Card key={integration.id} padding="md">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getIntegrationIcon(integration.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {getIntegrationLabel(integration.type)}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {integration.type}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        integration.enabled
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {integration.enabled ? 'Faol' : "O'chirilgan"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <Button
                      variant={integration.enabled ? 'ghost' : 'primary'}
                      size="sm"
                      onClick={() =>
                        handleToggleIntegration(
                          integration.id,
                          !integration.enabled
                        )
                      }
                    >
                      {integration.enabled ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteIntegration(integration.id)}
                    >
                      <Trash2 className="w-4 h-4 text-danger-500" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Webhooks tab */}
      {activeTab === 'webhooks' && (
        <>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Webhook'lar
            </h3>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddWebhook(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Yangi Webhook
            </Button>
          </div>

          {isLoading ? (
            <Card padding="md">
              <div className="text-center py-8 text-gray-500">
                Yuklanmoqda...
              </div>
            </Card>
          ) : webhooks.length === 0 ? (
            <Card padding="md">
              <div className="text-center py-8 text-gray-500">
                <WebhookIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Webhook'lar mavjud emas</p>
                <p className="text-sm mt-2">Yangi webhook yarating</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {webhooks.map(webhook => (
                <Card key={webhook.id} padding="md">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {webhook.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 break-all">
                        {webhook.url}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map((event: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        webhook.enabled
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {webhook.enabled ? 'Faol' : "O'chirilgan"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <Button
                      variant={webhook.enabled ? 'ghost' : 'primary'}
                      size="sm"
                      onClick={() =>
                        handleToggleWebhook(webhook.id, !webhook.enabled)
                      }
                    >
                      {webhook.enabled ? "O'chirish" : 'Yoqish'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteWebhook(webhook.id)}
                    >
                      <Trash2 className="w-4 h-4 text-danger-500" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add forms (placeholders) */}
      {showAddIntegration && (
        <Card
          padding="md"
          className="fixed inset-4 z-50 bg-white dark:bg-gray-800 overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Integration Qo'shish
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddIntegration(false)}
            >
              ×
            </Button>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Integration qo'shish formasi kelajakda qo'shiladi.
          </p>
        </Card>
      )}

      {showAddWebhook && (
        <Card
          padding="md"
          className="fixed inset-4 z-50 bg-white dark:bg-gray-800 overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Webhook Qo'shish
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddWebhook(false)}
            >
              ×
            </Button>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Webhook qo'shish formasi kelajakda qo'shiladi.
          </p>
        </Card>
      )}
    </div>
  );
}
