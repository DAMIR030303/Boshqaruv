import { describe, expect, it } from 'vitest';

import { FormSchemas, ValidationSchemas } from '../validation';

describe('ValidationSchemas', () => {
  describe('username', () => {
    it('validates correct username', () => {
      const result = ValidationSchemas.username.safeParse('john_doe123');
      expect(result.success).toBe(true);
    });

    it('rejects username shorter than 3 characters', () => {
      const result = ValidationSchemas.username.safeParse('ab');
      expect(result.success).toBe(false);
    });

    it('rejects username longer than 20 characters', () => {
      const result = ValidationSchemas.username.safeParse('a'.repeat(21));
      expect(result.success).toBe(false);
    });

    it('rejects username with special characters', () => {
      const result = ValidationSchemas.username.safeParse('john@doe');
      expect(result.success).toBe(false);
    });
  });

  describe('password', () => {
    it('validates correct password', () => {
      const result = ValidationSchemas.password.safeParse('Password123!');
      expect(result.success).toBe(true);
    });

    it('rejects password shorter than 8 characters', () => {
      const result = ValidationSchemas.password.safeParse('Pass1!');
      expect(result.success).toBe(false);
    });

    it('rejects password without uppercase letter', () => {
      const result = ValidationSchemas.password.safeParse('password123!');
      expect(result.success).toBe(false);
    });

    it('rejects password without lowercase letter', () => {
      const result = ValidationSchemas.password.safeParse('PASSWORD123!');
      expect(result.success).toBe(false);
    });

    it('rejects password without number', () => {
      const result = ValidationSchemas.password.safeParse('Password!');
      expect(result.success).toBe(false);
    });

    it('rejects password without special character', () => {
      const result = ValidationSchemas.password.safeParse('Password123');
      expect(result.success).toBe(false);
    });
  });

  describe('email', () => {
    it('validates correct email', () => {
      const result = ValidationSchemas.email.safeParse('test@example.com');
      expect(result.success).toBe(true);
    });

    it('rejects invalid email format', () => {
      const result = ValidationSchemas.email.safeParse('invalid-email');
      expect(result.success).toBe(false);
    });

    it('rejects email shorter than 5 characters', () => {
      const result = ValidationSchemas.email.safeParse('a@b.c');
      expect(result.success).toBe(false);
    });
  });

  describe('phone', () => {
    it('validates correct phone number', () => {
      const result = ValidationSchemas.phone.safeParse('+998901234567');
      expect(result.success).toBe(true);
    });

    it('rejects phone number without +998 prefix', () => {
      const result = ValidationSchemas.phone.safeParse('901234567');
      expect(result.success).toBe(false);
    });

    it('rejects phone number with wrong length', () => {
      const result = ValidationSchemas.phone.safeParse('+99890123456');
      expect(result.success).toBe(false);
    });
  });

  describe('taskTitle', () => {
    it('validates correct task title', () => {
      const result = ValidationSchemas.taskTitle.safeParse('Complete project');
      expect(result.success).toBe(true);
    });

    it('rejects task title shorter than 3 characters', () => {
      const result = ValidationSchemas.taskTitle.safeParse('AB');
      expect(result.success).toBe(false);
    });

    it('rejects task title longer than 100 characters', () => {
      const result = ValidationSchemas.taskTitle.safeParse('a'.repeat(101));
      expect(result.success).toBe(false);
    });
  });

  describe('positiveNumber', () => {
    it('validates positive number', () => {
      const result = ValidationSchemas.positiveNumber.safeParse(10);
      expect(result.success).toBe(true);
    });

    it('rejects negative number', () => {
      const result = ValidationSchemas.positiveNumber.safeParse(-5);
      expect(result.success).toBe(false);
    });

    it('rejects zero', () => {
      const result = ValidationSchemas.positiveNumber.safeParse(0);
      expect(result.success).toBe(false);
    });
  });

  describe('percentage', () => {
    it('validates percentage between 0 and 100', () => {
      const result = ValidationSchemas.percentage.safeParse(50);
      expect(result.success).toBe(true);
    });

    it('rejects percentage less than 0', () => {
      const result = ValidationSchemas.percentage.safeParse(-1);
      expect(result.success).toBe(false);
    });

    it('rejects percentage greater than 100', () => {
      const result = ValidationSchemas.percentage.safeParse(101);
      expect(result.success).toBe(false);
    });
  });
});

describe('FormSchemas', () => {
  describe('login', () => {
    it('validates correct login data', () => {
      const result = FormSchemas.login.safeParse({
        username: 'john_doe',
        password: 'Password123!',
      });
      expect(result.success).toBe(true);
    });

    it('rejects login with invalid username', () => {
      const result = FormSchemas.login.safeParse({
        username: 'ab',
        password: 'Password123!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects login with invalid password', () => {
      const result = FormSchemas.login.safeParse({
        username: 'john_doe',
        password: 'weak',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('task', () => {
    it('validates correct task data', () => {
      const result = FormSchemas.task.safeParse({
        title: 'Complete project',
        description: 'Finish the project',
        assignee: 'user-1',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(),
      });
      expect(result.success).toBe(true);
    });

    it('rejects task with invalid title', () => {
      const result = FormSchemas.task.safeParse({
        title: 'AB',
        description: 'Finish the project',
        assignee: 'user-1',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(),
      });
      expect(result.success).toBe(false);
    });
  });
});
