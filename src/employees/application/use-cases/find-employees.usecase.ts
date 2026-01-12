import { Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class FindEmployeesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<Employee[]> {
    return this.prisma.employee.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
