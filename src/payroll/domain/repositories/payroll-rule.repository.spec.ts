/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PayrollRuleRepository } from './payroll-rule.repository';

describe('PayrollRuleRepository (unit)', () => {
  let repo: PayrollRuleRepository;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      $queryRaw: jest.fn(),
    };
    repo = new PayrollRuleRepository(mockPrisma);
  });

  it('findAll returns empty array when none', async () => {
    mockPrisma.$queryRaw.mockResolvedValueOnce([]);
    const res = await repo.findAll();
    expect(res).toEqual([]);
    expect(mockPrisma.$queryRaw).toHaveBeenCalled();
  });

  it('findAll with contractType filters', async () => {
    const rows = [
      {
        id: '1',
        key: 'k',
        label: 'l',
        unit: 'PERCENT',
        value: 1,
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contractType: 'EMPLOYEE',
      },
    ];
    mockPrisma.$queryRaw.mockResolvedValueOnce(rows);
    const res = await repo.findAll({ contractType: 'EMPLOYEE' });
    expect(res).toBe(rows);
  });

  it('findById returns single item or null', async () => {
    const row = {
      id: 'abc',
      key: 'k',
      label: 'l',
      unit: 'PERCENT',
      value: 1,
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contractType: null,
    };
    mockPrisma.$queryRaw.mockResolvedValueOnce([row]);
    const r = await repo.findById('abc');
    expect(r).toEqual(row);

    mockPrisma.$queryRaw.mockResolvedValueOnce([]);
    const r2 = await repo.findById('nope');
    expect(r2).toBeNull();
  });

  it('create returns created rule', async () => {
    const payload = {
      key: 'K',
      label: 'L',
      unit: 'PERCENT',
      value: 2,
      contractType: null,
    };
    const created = {
      id: 'id1',
      ...payload,
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPrisma.$queryRaw.mockResolvedValueOnce([created]);
    const res = await repo.create(payload as any);
    expect(res).toEqual(created);
  });

  it('update returns updated rule or null', async () => {
    const updated = {
      id: 'u1',
      key: 'K',
      label: 'L',
      unit: 'PERCENT',
      value: 3,
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contractType: null,
    };
    mockPrisma.$queryRaw.mockResolvedValueOnce([updated]);
    const res = await repo.update('u1', { value: 3 });
    expect(res).toEqual(updated);

    mockPrisma.$queryRaw.mockResolvedValueOnce([]);
    const res2 = await repo.update('nope', { value: 1 });
    expect(res2).toBeNull();
  });

  it('delete returns deleted or null', async () => {
    const deleted = {
      id: 'd1',
      key: 'K',
      label: 'L',
      unit: 'PERCENT',
      value: 3,
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contractType: null,
    };
    mockPrisma.$queryRaw.mockResolvedValueOnce([deleted]);
    const res = await repo.delete('d1');
    expect(res).toEqual(deleted);

    mockPrisma.$queryRaw.mockResolvedValueOnce([]);
    const res2 = await repo.delete('nope');
    expect(res2).toBeNull();
  });
});

export {};
