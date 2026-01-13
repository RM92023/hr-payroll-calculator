import { FindContractsUseCase } from './find-contracts.usecase';

describe('FindContractsUseCase', () => {
  it('returns contracts ordered by createdAt desc', async () => {
    const prisma = {
      contract: { findMany: jest.fn().mockResolvedValue([{ id: 'c1' }]) },
    };

    const uc = new FindContractsUseCase(prisma as any);
    const res = await uc.execute();

    expect(res).toEqual([{ id: 'c1' }]);
    expect(prisma.contract.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
  });
});
