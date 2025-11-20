export type PaginationMeta = {
  total: number;
  page: number;
  size: number;
  lastPage: number;
  prevPage: number | null;
  nextPage: number | null;
};
