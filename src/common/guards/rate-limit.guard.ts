import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const endpoint = request.path;
    const key = `rateLimit_${ip}_${endpoint}`;

    const requestCount = await this.cacheManager.get<number>(key);
    const limit = 100; // Requests per window
    const window = 15 * 60; // 15 minutes in seconds

    if (!requestCount) {
      await this.cacheManager.set(key, 1, window);
      return true;
    }

    if (requestCount >= limit) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.cacheManager.set(key, requestCount + 1, window);
    return true;
  }
}
