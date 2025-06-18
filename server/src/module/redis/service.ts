import Redis from 'ioredis'
import config from '@/config'

export class RedisService {
  private readonly redis: Redis

  constructor() {
    this.redis = new Redis(config.redisUrl)
  }

  async set(key: string, value: any) {
    return await this.redis.set(key, value)
  }
  async get(key: string) {
    return await this.redis.get(key)
  }
  async expire(key: string, ttl: number) {
    await this.redis.expire(key, ttl)
  }
}
