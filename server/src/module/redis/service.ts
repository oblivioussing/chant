import Redis from 'ioredis'
import config from '@/config'

type Prefix = 'token'

export class RedisService {
  private readonly redis: Redis

  constructor() {
    this.redis = new Redis(config.redisUrl)
  }

  async set(prfix: Prefix, key: string, value: any) {
    return await this.redis.set(`${prfix}_${key}`, value)
  }
  async get(prfix: Prefix, key: string) {
    return await this.redis.get(`${prfix}_${key}`)
  }
  async expire(prfix: Prefix, key: string, ttl: number) {
    await this.redis.expire(`${prfix}_${key}`, ttl)
  }
}
