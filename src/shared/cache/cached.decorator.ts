import { SetMetadata } from '@nestjs/common';

export const Cached = (key: string, ttl = 60) =>
  SetMetadata('cache_key', key) && SetMetadata('cache_ttl', ttl);
