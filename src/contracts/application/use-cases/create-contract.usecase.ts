import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateContractDto } from '../dtos/create-contract.dto';

@Injectable()
export class CreateContractUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreateContractDto) {
    // HUMAN REVIEW: Evito depender de errores técnicos de la DB (FK) para un caso
    // de negocio común. Si el empleado no existe, respondo 404.
    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employeeId },
    });
    if (!employee) throw new NotFoundException('Employee not found');

    const data = {
      employeeId: dto.employeeId,
      contractType: dto.contractType,
      baseSalary: dto.baseSalary,
      active: typeof dto.active === 'boolean' ? dto.active : true,
    };

    // If this contract is marked active, deactivate previous active contracts
    if (data.active) {
      return this.prisma.$transaction(async (tx) => {
        await tx.contract.updateMany({
          where: { employeeId: dto.employeeId, active: true },
          data: { active: false },
        });
        return tx.contract.create({ data });
      });
    }

    return this.prisma.contract.create({ data });
  }
}
