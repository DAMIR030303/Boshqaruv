import { useCallback, useEffect, useState } from 'react';

import {
  CheckCircle,
  Copy,
  Edit,
  Play,
  Plus,
  Trash2,
  Workflow as WorkflowIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { WorkflowService } from '../../services/workflowService';
import type {
  UserProfile,
  Workflow,
  WorkflowAction,
  WorkflowTrigger,
} from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface WorkflowBuilderProps {
  /** Foydalanuvchi profil ma'lumotlari */
  userProfile?: UserProfile;
}

/**
 * WorkflowBuilder - Visual workflow yaratish interfeysi
 * Workflow builder va automation paneli
 */
export function WorkflowBuilder({ userProfile }: WorkflowBuilderProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Workflow'larni yuklash
  const loadWorkflows = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await WorkflowService.getWorkflows(userProfile?.name);

      if (result.success && result.data) {
        setWorkflows(result.data);
      } else {
        toast.error(result.error || "Workflow'larni yuklashda xatolik");
      }
    } catch (error) {
      toast.error("Workflow'larni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  }, [userProfile?.name]);

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  // Workflow'ni ishga tushirish
  const handleExecute = async (workflowId: string) => {
    try {
      const result = await WorkflowService.executeWorkflow(workflowId);

      if (result.success && result.data) {
        toast.success(`${result.data.actionsRun} ta action bajarildi`);
      } else {
        toast.error(result.error || 'Workflow ishga tushirishda xatolik');
      }
    } catch (error) {
      toast.error('Workflow ishga tushirishda xatolik');
    }
  };

  // Workflow'ni o'chirish
  const handleDelete = async (workflowId: string) => {
    if (!confirm("Bu workflow'ni o'chirishni xohlaysizmi?")) {
      return;
    }

    try {
      const result = await WorkflowService.deleteWorkflow(workflowId);

      if (result.success) {
        await loadWorkflows();
        toast.success("Workflow o'chirildi");
      } else {
        toast.error(result.error || "Workflow o'chirishda xatolik");
      }
    } catch (error) {
      toast.error("Workflow o'chirishda xatolik");
    }
  };

  // Workflow'ni yoqish/o'chirish
  const handleToggle = async (workflowId: string, enabled: boolean) => {
    try {
      const result = await WorkflowService.updateWorkflow(workflowId, {
        enabled,
      });

      if (result.success) {
        await loadWorkflows();
        toast.success(`Workflow ${enabled ? 'yoqildi' : "o'chirildi"}`);
      } else {
        toast.error(result.error || 'Workflow yangilashda xatolik');
      }
    } catch (error) {
      toast.error('Workflow yangilashda xatolik');
    }
  };

  // Template'dan workflow yaratish
  const handleCreateFromTemplate = async (template: Workflow) => {
    try {
      const result = await WorkflowService.createWorkflow({
        ...template,
        createdBy: userProfile?.name || 'unknown',
      });

      if (result.success) {
        await loadWorkflows();
        toast.success('Workflow yaratildi');
      } else {
        toast.error(result.error || 'Workflow yaratishda xatolik');
      }
    } catch (error) {
      toast.error('Workflow yaratishda xatolik');
    }
  };

  // Trigger type label
  const getTriggerLabel = (type: WorkflowTrigger['type']) => {
    switch (type) {
      case 'time':
        return 'Vaqt';
      case 'event':
        return 'Event';
      case 'condition':
        return 'Shart';
      case 'manual':
        return "Qo'lda";
      default:
        return type;
    }
  };

  // Action type label
  const getActionLabel = (type: WorkflowAction['type']) => {
    switch (type) {
      case 'create_task':
        return 'Vazifa yaratish';
      case 'send_notification':
        return 'Bildirishnoma';
      case 'update_status':
        return 'Status yangilash';
      case 'send_email':
        return 'Email yuborish';
      case 'webhook':
        return 'Webhook';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <WorkflowIcon className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Workflow Automation
          </h2>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Yangi
        </Button>
      </div>

      {/* Templates */}
      <Card padding="md">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Tayyor shablonlar
        </h3>
        <div className="space-y-2">
          {WorkflowService.getTemplates().map(template => (
            <div
              key={template.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {template.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {template.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCreateFromTemplate(template)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Workflows list */}
      {isLoading ? (
        <Card padding="md">
          <div className="text-center py-8 text-gray-500">Yuklanmoqda...</div>
        </Card>
      ) : workflows.length === 0 ? (
        <Card padding="md">
          <div className="text-center py-8 text-gray-500">
            <WorkflowIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Workflow'lar mavjud emas</p>
            <p className="text-sm mt-2">
              Tayyor shablonlardan yarating yoki yangi workflow yarating
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {workflows.map(workflow => (
            <Card key={workflow.id} padding="md">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {workflow.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        workflow.enabled
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {workflow.enabled ? 'Yoqilgan' : "O'chirilgan"}
                    </span>
                  </div>
                  {workflow.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {workflow.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Trigger */}
              <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Trigger:
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {getTriggerLabel(workflow.trigger.type)}
                </p>
              </div>

              {/* Actions */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Actions:
                </p>
                <div className="space-y-1">
                  {workflow.actions.map(
                    (action: WorkflowAction, index: number) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {getActionLabel(action.type)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={workflow.enabled ? 'ghost' : 'primary'}
                  size="sm"
                  onClick={() => handleToggle(workflow.id, !workflow.enabled)}
                >
                  {workflow.enabled ? "O'chirish" : 'Yoqish'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExecute(workflow.id)}
                >
                  <Play className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Edit functionality - to be implemented
                    toast.info("Tahrirlash funksiyasi tez orada qo'shiladi");
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(workflow.id)}
                >
                  <Trash2 className="w-4 h-4 text-danger-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create form (placeholder) */}
      {showCreateForm && (
        <Card
          padding="md"
          className="fixed inset-4 z-50 bg-white dark:bg-gray-800 overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Yangi Workflow
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateForm(false)}
            >
              ×
            </Button>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Workflow yaratish formasi kelajakda qo'shiladi. Hozircha tayyor
            shablonlardan foydalaning.
          </p>
        </Card>
      )}
    </div>
  );
}
