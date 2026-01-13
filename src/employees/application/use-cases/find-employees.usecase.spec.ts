import { FindEmployeesUseCase } from './find-employees.usecase';

describe('FindEmployeesUseCase', () => {
  it('returns employees ordered by createdAt desc', async () => {
    const prisma = {
      employee: { findMany: jest.fn().mockResolvedValue([{ id: 'e1' }]) },
    };

    const uc = new FindEmployeesUseCase(prisma as any);
    const res = await uc.execute();

    expect(res).toEqual([{ id: 'e1' }]);
    expect(prisma.employee.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
  });
});
