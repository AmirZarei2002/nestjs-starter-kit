import { PaginationMeta } from './pagination-meta.type';

export type PaginatedResult<T> = {
  data: T[];
  meta: PaginationMeta;
};
