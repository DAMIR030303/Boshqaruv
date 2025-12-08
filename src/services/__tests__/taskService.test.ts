import { describe, expect, it, beforeEach, vi } from 'vitest';

import { TaskService } from '../taskService';

// Mock Supabase
vi.mock('../../utils/supabaseClient', () => ({
  isSupabaseConfigured: vi.fn(() => false),
  supabase: {
    from: vi.fn(),
  },
}));

describe('TaskService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTasks', () => {
    it('returns all tasks when no assignee specified', async () => {
      const result = await TaskService.getTasks();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data?.length).toBeGreaterThan(0);
    });

    it('returns filtered tasks when assignee specified', async () => {
      const result = await TaskService.getTasks('Javohir Tursunov');

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(
        result.data?.every(task => task.assignee === 'Javohir Tursunov')
      ).toBe(true);
    });

    it('returns empty array when assignee has no tasks', async () => {
      const result = await TaskService.getTasks('Non-existent User');

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });

  describe('getTaskById', () => {
    it('returns task when found', async () => {
      const result = await TaskService.getTaskById('task-1');

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe('task-1');
      expect(result.data?.title).toBeDefined();
    });

    it('returns error when task not found', async () => {
      const result = await TaskService.getTaskById('non-existent-id');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.data).toBeUndefined();
    });
  });

  describe('createTask', () => {
    it('creates a new task successfully', async () => {
      const newTask = {
        title: 'New Task',
        description: 'Task description',
        assignee: 'Test User',
        status: 'pending' as const,
        priority: 'medium' as const,
        dueDate: new Date(),
      };

      const result = await TaskService.createTask(newTask);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.title).toBe(newTask.title);
      expect(result.data?.id).toBeDefined();
      expect(result.data?.createdAt).toBeDefined();
      expect(result.data?.updatedAt).toBeDefined();
    });

    it('creates task with all required fields', async () => {
      const newTask = {
        title: 'Complete Project',
        description: 'Finish the project',
        assignee: 'Developer',
        status: 'in-progress' as const,
        priority: 'high' as const,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      const result = await TaskService.createTask(newTask);

      expect(result.success).toBe(true);
      expect(result.data?.title).toBe(newTask.title);
      expect(result.data?.description).toBe(newTask.description);
      expect(result.data?.assignee).toBe(newTask.assignee);
      expect(result.data?.status).toBe(newTask.status);
      expect(result.data?.priority).toBe(newTask.priority);
    });
  });

  describe('updateTask', () => {
    it('updates task successfully', async () => {
      const updates = {
        title: 'Updated Title',
        status: 'completed' as const,
      };

      const result = await TaskService.updateTask('task-1', updates);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.title).toBe(updates.title);
      expect(result.data?.status).toBe(updates.status);
      expect(result.data?.updatedAt).toBeDefined();
    });

    it('returns error when task not found', async () => {
      const updates = { title: 'Updated Title' };

      const result = await TaskService.updateTask('non-existent-id', updates);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('updates multiple fields', async () => {
      const updates = {
        title: 'New Title',
        description: 'New Description',
        priority: 'high' as const,
      };

      const result = await TaskService.updateTask('task-1', updates);

      expect(result.success).toBe(true);
      expect(result.data?.title).toBe(updates.title);
      expect(result.data?.description).toBe(updates.description);
      expect(result.data?.priority).toBe(updates.priority);
    });
  });

  describe('deleteTask', () => {
    it('deletes task successfully', async () => {
      const result = await TaskService.deleteTask('task-1');

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('handles deletion of non-existent task', async () => {
      const result = await TaskService.deleteTask('non-existent-id');

      expect(result.success).toBe(true);
    });
  });

  describe('mapToTask', () => {
    it('correctly maps Supabase data to Task type', () => {
      const supabaseData = {
        id: 'test-id',
        title: 'Test Task',
        description: 'Test Description',
        assignee: 'Test User',
        status: 'pending',
        priority: 'medium',
        due_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Access private method via type assertion for testing
      const mapped = (
        TaskService as unknown as {
          mapToTask: (data: Record<string, unknown>) => unknown;
        }
      ).mapToTask(supabaseData);

      expect(mapped).toMatchObject({
        id: 'test-id',
        title: 'Test Task',
        description: 'Test Description',
        assignee: 'Test User',
        status: 'pending',
        priority: 'medium',
      });
    });
  });
});
