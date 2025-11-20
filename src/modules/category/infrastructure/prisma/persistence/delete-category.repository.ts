import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { IDeleteCategoryRepository } from '@category/domain';

@Injectable()
export class DeleteCategoryRepository implements IDeleteCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }
}
