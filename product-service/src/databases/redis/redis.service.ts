import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      db: 0,
    });

    this.client.on('connect', () => {
      console.log('🔗 Connected to Redis');
    });

    this.client.on('error', (err) => {
      console.error('❌ Redis Error:', err);
    });
  }

  onModuleDestroy() {
    this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }
  set(key: string, value: string, ttl?: number) {
    if (ttl) {
      return this.client.set(key, value, 'EX', ttl);
    } else {
      return this.client.set(key, value);
    }
  }
  get(key: string) {
    return this.client.get(key);
  }
  del(key: string) {
    return this.client.del(key);
  }
}
