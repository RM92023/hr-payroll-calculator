import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateContractDto } from '../dtos/create-contract.dto';

@Injectable()
export class CreateContractUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreateContractDto) {
    const data = {
      employeeId: dto.employeeId,
      contractType: dto.contractType,
      baseSalary: dto.baseSalary,
      active: typeof dto.active === 'boolean' ? dto.active : true,
    };
    return this.prisma.contract.create({ data });
  }
}
