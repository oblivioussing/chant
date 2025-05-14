import Redis from 'ioredis'
import config from '@/config'

type Prefix = 'token'

export class RedisService {
  private readonly redis: Redis

  constructor() {
    this.redis = new Redis(config.redisUrl)
  }

  async set(prefix: Prefix, key: string, value: any) {
    return await this.redis.set(`${prefix}_${key}`, value)
  }
  async get(prefix: Prefix, key: string) {
    return await this.redis.get(`${prefix}_${key}`)
  }
  async expire(prefix: Prefix, key: string, ttl: number) {
    await this.redis.expire(`${prefix}_${key}`, ttl)
  }
}
