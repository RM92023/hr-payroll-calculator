import { NotFoundException } from '@nestjs/common';
import { CreateContractUseCase } from './create-contract.usecase';

describe('CreateContractUseCase', () => {
  const makePrisma = () => ({
    employee: { findUnique: jest.fn() },
    contract: { create: jest.fn(), updateMany: jest.fn() },
    $transaction: jest.fn(),
  });

  it('throws 404 when employee does not exist', async () => {
    const prisma = makePrisma();
    prisma.employee.findUnique.mockResolvedValue(null);

    const uc = new CreateContractUseCase(prisma as any);

    await expect(
      uc.execute({
        employeeId: 'e1',
        contractType: 'EMPLOYEE',
        baseSalary: 1000,
      } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should create contract', async () => {
    const prisma = makePrisma();
    prisma.employee.findUnique.mockResolvedValue({ id: 'e1' });
    prisma.contract.create.mockResolvedValue({ id: 'c1' });

    const uc = new CreateContractUseCase(prisma as any);

    const res = await uc.execute({
      employeeId: 'e1',
      contractType: 'EMPLOYEE',
      baseSalary: 1000,
      active: false,
    } as any);

    expect(res).toEqual({ id: 'c1' });
    expect(prisma.contract.create).toHaveBeenCalledWith({
      data: {
        employeeId: 'e1',
        contractType: 'EMPLOYEE',
        baseSalary: 1000,
        active: false,
      },
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
  it('creates contract without transaction when active=false', async () => {
    const prisma = makePrisma();
    prisma.employee.findUnique.mockResolvedValue({ id: 'e1' });
    prisma.contract.create.mockResolvedValue({ id: 'c1' });

    const uc = new CreateContractUseCase(prisma as any);

    const res = await uc.execute({
      employeeId: 'e1',
      contractType: 'EMPLOYEE',
      baseSalary: 1000,
      active: false,
    } as any);

    expect(res).toEqual({ id: 'c1' });
    expect(prisma.contract.create).toHaveBeenCalledWith({
      data: {
        employeeId: 'e1',
        contractType: 'EMPLOYEE',
        baseSalary: 1000,
        active: false,
      },
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('when active=true, deactivates previous and creates inside transaction', async () => {
    const prisma = makePrisma();
    prisma.employee.findUnique.mockResolvedValue({ id: 'e1' });

    const tx = {
      contract: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        create: jest.fn().mockResolvedValue({ id: 'c2' }),
      },
    };

    prisma.$transaction.mockImplementation((fn: (trx: any) => Promise<any>) =>
      fn(tx),
    );

    const uc = new CreateContractUseCase(prisma as any);

    const res = await uc.execute({
      employeeId: 'e1',
      contractType: 'EMPLOYEE',
      baseSalary: 2000,
    } as any);

    expect(res).toEqual({ id: 'c2' });
    expect(tx.contract.updateMany).toHaveBeenCalledWith({
      where: { employeeId: 'e1', active: true },
      data: { active: false },
    });
    expect(tx.contract.create).toHaveBeenCalledWith({
      data: {
        employeeId: 'e1',
        contractType: 'EMPLOYEE',
        baseSalary: 2000,
        active: true,
      },
    });
  });
});
