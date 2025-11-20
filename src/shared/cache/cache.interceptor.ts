import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from './cache.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private cacheService: CacheService,
    private reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const cacheKey = this.reflector.get<string>(
      'cacheKey',
      context.getHandler(),
    );
    const ttl =
      this.reflector.get<number>('cache_ttl', context.getHandler()) ?? 60;

    if (!cacheKey) {
      return next.handle();
    }

    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return of(cached);
    }

    return next.handle().pipe(
      tap((result) => {
        void this.cacheService.set(cacheKey, result, ttl);
      }),
    );
  }
}
