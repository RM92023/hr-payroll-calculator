import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PayrollCalculatorTemplate } from '../../domain/services/payroll.calculator.template';
import { CreatePayrollRunDto } from '../dtos/create-payroll-run.dto';

export class CreatePayrollRunUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly calculator: PayrollCalculatorTemplate,
  ) {}

  async execute(dto: CreatePayrollRunDto) {
    // 1) Verificar que el empleado existe
    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employeeId },
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // 2) Seleccionar contrato
    const contract = dto.contractId
      ? await this.prisma.contract.findUnique({ where: { id: dto.contractId } })
      : await this.prisma.contract.findFirst({
          where: { employeeId: dto.employeeId, active: true },
          orderBy: { createdAt: 'desc' },
        });

    if (!contract) {
      throw new NotFoundException('Active contract not found for employee');
    }

    if (contract.employeeId !== dto.employeeId) {
      throw new BadRequestException('Contract does not belong to employee');
    }

    // 3) Calcular
    const result = this.calculator.calculate({
      contractType: contract.contractType,
      baseSalary: contract.baseSalary,
      bonuses: dto.bonuses,
      otherDeductions: dto.otherDeductions,
    });

    // 4) Persistir corrida
    const payload = {
      employeeId: dto.employeeId,
      contractId: contract.id,
      period: dto.period,
      gross: Math.round(result.gross),
      net: Math.round(result.net),
      breakdown: {
        ...result.breakdown,
        taxes: result.taxes,
        mandatoryDeductions: result.mandatoryDeductions,
        otherDeductions: result.otherDeductions,
      },
    };

    return this.prisma.payrollRun.create({ data: payload });
  }
}
