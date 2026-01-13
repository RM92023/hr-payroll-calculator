import { FindPayrollRunsUseCase } from './find-payroll-runs.usecase';

describe('FindPayrollRunsUseCase', () => {
  const makePrisma = () => ({
    payrollRun: { findMany: jest.fn() },
  });

  it('builds empty filter when no query params', async () => {
    const prisma = makePrisma();
    prisma.payrollRun.findMany.mockResolvedValue([]);

    const usecase = new FindPayrollRunsUseCase(prisma as any);
    await usecase.execute({} as any);

    expect(prisma.payrollRun.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {},
        orderBy: { createdAt: 'desc' },
        include: { employee: true, contract: true },
      }),
    );
  });

  it('filters by employeeId and period when provided', async () => {
    const prisma = makePrisma();
    prisma.payrollRun.findMany.mockResolvedValue([]);

    const usecase = new FindPayrollRunsUseCase(prisma as any);
    await usecase.execute({ employeeId: 'e1', period: '2026-01' } as any);

    expect(prisma.payrollRun.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { employeeId: 'e1', period: '2026-01' },
      }),
    );
  });
});
