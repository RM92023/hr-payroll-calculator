import { PrismaService } from '../../../prisma/prisma.service';
import { FindPayrollRunsQueryDto } from '../dtos/find-payroll-runs.query.dto';

export class FindPayrollRunsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: FindPayrollRunsQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.employeeId) where.employeeId = query.employeeId;
    if (query.period) where.period = query.period;

    return this.prisma.payrollRun.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        employee: true,
        contract: true,
      },
    });
  }
}
