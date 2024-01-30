import Redis from 'ioredis'
import config from '@/config'

type Prefix = 'token'

export class RedisService {
  constructor() {
    this.redis = new Redis(config.redisUrl)
  }
  redis: Redis

  async set(prfix: Prefix, key: string, value: any) {
    return await this.redis.set(`${prfix}_${key}`, value)
    // if (ttl) {
    //   await this.expire(key, ttl)
    // }
  }
  async get(prfix: Prefix, key: string) {
    return await this.redis.get(`${prfix}_${key}`)
  }
  async expire(prfix: Prefix, key: string, ttl: number) {
    await this.redis.expire(`${prfix}_${key}`, ttl)
  }
}
