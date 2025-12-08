import { useCallback, useEffect, useState } from 'react';

import { format } from 'date-fns';
import { AtSign, Edit, MessageSquare, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { CollaborationService } from '../../services/collaborationService';
import type { Comment, UserProfile } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface CommentSectionProps {
  /** Entity turi */
  entityType: Comment['entityType'];
  /** Entity ID */
  entityId: string;
  /** Foydalanuvchi profil ma'lumotlari */
  userProfile?: UserProfile;
  /** Faqat o'qish */
  readOnly?: boolean;
}

/**
 * CommentSection - Vazifalar va hujjatlarda sharhlar bo'limi
 * Real-time comments va @mentions
 */
export function CommentSection({
  entityType,
  entityId,
  userProfile,
  readOnly = false,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Sharhlarni yuklash
  const loadComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await CollaborationService.getComments(
        entityType,
        entityId
      );

      if (result.success && result.data) {
        setComments(result.data);
      } else {
        toast.error(result.error || 'Sharhlarni yuklashda xatolik');
      }
    } catch (error) {
      toast.error('Sharhlarni yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    loadComments();

    // Real-time subscription
    const unsubscribe = CollaborationService.subscribeToComments(
      entityType,
      entityId,
      comment => {
        setComments(prev => [...prev, comment]);
      }
    );

    return unsubscribe;
  }, [entityType, entityId, loadComments]);

  // Sharh qo'shish
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('Iltimos, sharh yozing');
      return;
    }

    if (!userProfile?.name) {
      toast.error("Foydalanuvchi ma'lumotlari topilmadi");
      return;
    }

    try {
      const mentions = CollaborationService.parseMentions(newComment);
      const result = await CollaborationService.addComment(
        entityType,
        entityId,
        userProfile.name,
        newComment,
        mentions
      );

      if (result.success && result.data) {
        setComments(prev => [...prev, result.data!]);
        setNewComment('');
        toast.success("Sharh qo'shildi");
      } else {
        toast.error(result.error || "Sharh qo'shishda xatolik");
      }
    } catch (error) {
      toast.error("Sharh qo'shishda xatolik");
    }
  };

  // Sharhni yangilash
  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) {
      toast.error('Iltimos, sharh yozing');
      return;
    }

    try {
      const result = await CollaborationService.updateComment(
        commentId,
        entityType,
        entityId,
        editContent
      );

      if (result.success && result.data) {
        setComments(prev =>
          prev.map(c => (c.id === commentId ? result.data! : c))
        );
        setEditingId(null);
        setEditContent('');
        toast.success('Sharh yangilandi');
      } else {
        toast.error(result.error || 'Sharh yangilashda xatolik');
      }
    } catch (error) {
      toast.error('Sharh yangilashda xatolik');
    }
  };

  // Sharhni o'chirish
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Bu sharhni o'chirishni xohlaysizmi?")) {
      return;
    }

    try {
      const result = await CollaborationService.deleteComment(
        commentId,
        entityType,
        entityId
      );

      if (result.success) {
        setComments(prev => prev.filter(c => c.id !== commentId));
        toast.success("Sharh o'chirildi");
      } else {
        toast.error(result.error || "Sharh o'chirishda xatolik");
      }
    } catch (error) {
      toast.error("Sharh o'chirishda xatolik");
    }
  };

  // @Mentions'ni highlight qilish
  const highlightMentions = (text: string) => {
    const mentionRegex = /@(\w+)/g;
    const parts = text.split(mentionRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // Mention
        return (
          <span key={index} className="text-primary-500 font-medium">
            @{part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <MessageSquare className="w-5 h-5 text-primary-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Sharhlar ({comments.length})
        </h3>
      </div>

      {/* Add comment form */}
      {!readOnly && (
        <Card padding="md">
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Sharh yozing... @mention qo'llab-quvvatlanadi"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <AtSign className="w-3 h-3" />
                <span>@username yozib xodimni chaqiring</span>
              </div>
              <Button variant="primary" size="sm" onClick={handleAddComment}>
                <Send className="w-4 h-4 mr-1" />
                Yuborish
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Comments list */}
      {isLoading ? (
        <Card padding="md">
          <div className="text-center py-4 text-gray-500">Yuklanmoqda...</div>
        </Card>
      ) : comments.length === 0 ? (
        <Card padding="md">
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Sharhlar mavjud emas</p>
            {!readOnly && (
              <p className="text-sm mt-2">Birinchi sharhni siz yozing!</p>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {comments.map(comment => (
            <Card key={comment.id} padding="md">
              {editingId === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    rows={2}
                  />
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateComment(comment.id)}
                    >
                      Saqlash
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingId(null);
                        setEditContent('');
                      }}
                    >
                      Bekor qilish
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {comment.author}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(comment.createdAt, 'd MMM yyyy, HH:mm', {
                            locale: undefined,
                          })}
                        </span>
                        {comment.updatedAt && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            (tahrirlangan)
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {highlightMentions(comment.content)}
                      </p>
                      {comment.mentions && comment.mentions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {comment.mentions.map((mention, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded"
                            >
                              @{mention}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {!readOnly && userProfile?.name === comment.author && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditContent(comment.content);
                        }}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Tahrirlash
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-1 text-danger-500" />
                        O'chirish
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
