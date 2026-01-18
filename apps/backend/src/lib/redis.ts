import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Create Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError(err: Error) {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      // Only reconnect when the error contains "READONLY"
      return true;
    }
    return false;
  },
});

// Redis connection event handlers
redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err: Error) => {
  console.error('❌ Redis connection error:', err);
});

redis.on('ready', () => {
  console.log('🔌 Redis ready');
});

// Helper functions for common operations
export const redisHelpers = {
  // Set a value with optional TTL (in seconds)
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await redis.setex(key, ttl, serialized);
    } else {
      await redis.set(key, serialized);
    }
  },

  // Get a value and parse it
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  },

  // Delete one or more keys
  async del(...keys: string[]): Promise<number> {
    return await redis.del(...keys);
  },

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result === 1;
  },

  // Set expiration on a key (in seconds)
  async expire(key: string, seconds: number): Promise<boolean> {
    const result = await redis.expire(key, seconds);
    return result === 1;
  },

  // Get all keys matching a pattern
  async keys(pattern: string): Promise<string[]> {
    return await redis.keys(pattern);
  },

  // Increment a value
  async incr(key: string): Promise<number> {
    return await redis.incr(key);
  },

  // Decrement a value
  async decr(key: string): Promise<number> {
    return await redis.decr(key);
  },
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  await redis.quit();
  console.log('Redis connection closed');
});

export default redis;
