import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { PaginatedResult } from '../types/paginated-result.type';

type PrismaDelegate<T, FindManyArgs, CountArgs> = {
  findMany: (args: FindManyArgs) => Promise<T[]>;
  count: (args?: CountArgs) => Promise<number>;
};

export async function paginate<T, Entity, FindManyArgs, CountArgs>(
  model: PrismaDelegate<T, FindManyArgs, CountArgs>,
  query: PaginationQueryDto,
  mapFn: (item: T) => Entity,
  options: Omit<FindManyArgs, 'skip' | 'take' | 'orderBy'>,
  orderBy?: FindManyArgs extends { orderBy: infer O } ? O : unknown,
  where?: CountArgs extends { where: infer W } ? W : unknown,
): Promise<PaginatedResult<Entity>> {
  const { page = 1, size = 10 } = query;
  const skip = (page - 1) * size;
  const take = size;

  const [total, items] = await Promise.all([
    model.count({ where } as CountArgs),
    model.findMany({ ...options, skip, take, orderBy } as FindManyArgs),
  ]);

  const data = items.map(mapFn);
  const lastPage = Math.ceil(total / size);
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < lastPage ? page + 1 : null;

  return {
    data,
    meta: {
      total,
      page,
      size,
      lastPage,
      prevPage,
      nextPage,
    },
  };
}
