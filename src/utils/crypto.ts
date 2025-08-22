import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Get JWT secret from environment
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'fallback-secret-key';
const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Password hashing failed');
  }
};

/**
 * Compare password with hash
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error('Password verification failed');
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (payload: Record<string, unknown>, expiresIn: string = '24h'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verify JWT token
 */
export const verifyToken = <T = unknown>(token: string): T => {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Decode JWT token without verification
 */
export const decodeToken = <T = unknown>(token: string): T | null => {
  return jwt.decode(token) as T | null;
};

/**
 * Generate secure random string
 */
export const generateSecureString = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  
  return result;
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Parol kamida 8 ta belgidan iborat bo\'lishi kerak');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Parol kamida 1 ta katta harf o\'z ichiga olishi kerak');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Parol kamida 1 ta kichik harf o\'z ichiga olishi kerak');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Parol kamida 1 ta raqam o\'z ichiga olishi kerak');
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Parol kamida 1 ta maxsus belgi (!@#$%^&*) o\'z ichiga olishi kerak');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};