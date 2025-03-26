import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ICache } from './cache.interface';
import { RedisService } from 'src/databases/redis/redis.service';

@Injectable()
export class CacheProxy implements ICache {
  constructor(@Inject() private redisService: RedisService) {}
  async getOrSet<T>(
    key: string,
    fetchData: () => Promise<T>,
    ttl: number = 300,
  ): Promise<T> {
    const cachedData = await this.redisService.get(key);
    if (cachedData) {
      return JSON.parse(cachedData) as T;
    }
    const data = await fetchData();
    if (!data) throw new BadRequestException('Not found');
    if (data) {
      await this.redisService.set(key, JSON.stringify(data), ttl * 1000);
    }
    return data;
  }
  async deleteCache(key: string): Promise<void> {
    await this.redisService.del(key);
  }
}
