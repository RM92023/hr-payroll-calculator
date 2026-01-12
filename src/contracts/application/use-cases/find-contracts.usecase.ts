import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class FindContractsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    return this.prisma.contract.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
