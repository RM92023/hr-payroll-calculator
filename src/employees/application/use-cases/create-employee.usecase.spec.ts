import { CreateEmployeeUseCase } from './create-employee.usecase';

describe('CreateEmployeeUseCase', () => {
  it('creates employee via prisma', async () => {
    const prisma = {
      employee: { create: jest.fn().mockResolvedValue({ id: 'e1' }) },
    };

    const uc = new CreateEmployeeUseCase(prisma as any);
    const res = await uc.execute({ name: 'A', email: 'a@mail.com' } as any);

    expect(res).toEqual({ id: 'e1' });
    expect(prisma.employee.create).toHaveBeenCalledWith({
      data: { name: 'A', email: 'a@mail.com' },
    });
  });
});
