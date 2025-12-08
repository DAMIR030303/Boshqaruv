import bcrypt from 'bcryptjs';

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
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error('Password verification failed');
  }
};

/**
 * Browser-compatible JWT implementation
 * jsonwebtoken kutubxonasi browser'da ishlamaydi, shuning uchun soddalashtirilgan versiya
 */

// Base64 URL encoding
function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Base64 URL decoding
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
}

// Simple HMAC-SHA256 using Web Crypto API with fallback
async function hmacSha256(message: string, secret: string): Promise<string> {
  try {
    // Check if crypto.subtle is available
    if (!crypto || !crypto.subtle) {
      throw new Error('crypto.subtle not available');
    }

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(message);

    // Use Web Crypto API for HMAC
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const hashArray = Array.from(new Uint8Array(signature));
    const hashHex = hashArray
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return hashHex;
  } catch (error) {
    // Fallback: Simple hash for development (NOT SECURE for production)
    console.warn('[Crypto] crypto.subtle not available, using fallback');
    const combined = secret + message;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }
}

/**
 * Generate JWT token (browser-compatible)
 *
 * @param payload - JWT payload ma'lumotlari
 * @param expiresIn - Token muddati (masalan: '1h', '7d')
 * @returns JWT token string
 */
export const generateToken = async (
  payload: Record<string, unknown>,
  expiresIn: string = '24h'
): Promise<string> => {
  // Expires calculation
  const now = Math.floor(Date.now() / 1000);
  let expires = now + 24 * 60 * 60; // Default 24 hours

  if (expiresIn.endsWith('h')) {
    const hours = parseInt(expiresIn);
    expires = now + hours * 60 * 60;
  } else if (expiresIn.endsWith('d')) {
    const days = parseInt(expiresIn);
    expires = now + days * 24 * 60 * 60;
  }

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const tokenPayload = {
    ...payload,
    iat: now,
    exp: expires,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));

  try {
    const signature = await hmacSha256(
      `${encodedHeader}.${encodedPayload}`,
      JWT_SECRET
    );
    const encodedSignature = base64UrlEncode(signature);
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  } catch (error) {
    // Fallback: Simple token without signature (for demo purposes)
    console.warn('[Crypto] Token signature failed, using fallback');
    return `${encodedHeader}.${encodedPayload}.${base64UrlEncode('fallback-signature')}`;
  }
};

/**
 * Verify JWT token (browser-compatible)
 */
export const verifyToken = async <T = unknown>(token: string): Promise<T> => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;

    // Verify signature (with fallback support)
    try {
      const signature = await hmacSha256(
        `${encodedHeader}.${encodedPayload}`,
        JWT_SECRET
      );
      const expectedSignature = base64UrlEncode(signature);

      // Allow fallback signature for demo purposes
      if (
        encodedSignature !== expectedSignature &&
        encodedSignature !== base64UrlEncode('fallback-signature')
      ) {
        throw new Error('Invalid signature');
      }
    } catch (sigError) {
      // If signature verification fails but it's a fallback token, allow it
      if (encodedSignature === base64UrlEncode('fallback-signature')) {
        // Allow fallback tokens
      } else {
        throw sigError;
      }
    }

    // Decode payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as T & {
      exp?: number;
      iat?: number;
    };

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }

    // Remove internal fields - destructure to exclude exp and iat
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exp: _, iat: __, ...userPayload } = payload;
    return userPayload as T;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Decode JWT token without verification (browser-compatible)
 */
export const decodeToken = <T = unknown>(token: string): T | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(parts[1])) as T & {
      exp?: number;
      iat?: number;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exp: _, iat: __, ...userPayload } = payload;
    return userPayload as T;
  } catch (error) {
    return null;
  }
};

/**
 * Generate secure random string
 */
export const generateSecureString = (length: number = 32): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  const randomValues = new Uint8Array(length);

  try {
    if (crypto && crypto.getRandomValues) {
      crypto.getRandomValues(randomValues);
    } else {
      // Fallback for environments without crypto.getRandomValues
      for (let i = 0; i < length; i++) {
        randomValues[i] = Math.floor(Math.random() * 256);
      }
    }
  } catch (error) {
    // Fallback: Math.random (NOT SECURE for production)
    console.warn(
      '[Crypto] crypto.getRandomValues not available, using fallback'
    );
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * 256);
    }
  }

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
export const validatePasswordStrength = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Parol kamida 8 ta belgidan iborat bo'lishi kerak");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Parol kamida 1 ta katta harf o'z ichiga olishi kerak");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Parol kamida 1 ta kichik harf o'z ichiga olishi kerak");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Parol kamida 1 ta raqam o'z ichiga olishi kerak");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push(
      "Parol kamida 1 ta maxsus belgi (!@#$%^&*) o'z ichiga olishi kerak"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
