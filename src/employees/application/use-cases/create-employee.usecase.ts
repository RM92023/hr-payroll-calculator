import { Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreateEmployeeDto): Promise<Employee> {
    return this.prisma.employee.create({ data: dto });
  }
}
