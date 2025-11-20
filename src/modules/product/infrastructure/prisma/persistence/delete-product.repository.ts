import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { IDeleteProductRepository } from '@product/domain';

@Injectable()
export class DeleteProductRepository implements IDeleteProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }
}

