/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import MockPrismaService from './mock-prisma.service';

describe('MockPrismaService (unit)', () => {
  let mock: MockPrismaService;

  beforeEach(() => {
    mock = new MockPrismaService();
    mock.reset();
  });

  it('creates employee and enforces unique email', async () => {
    const e1 = await mock.employee.create({
      data: { name: 'A', email: 'a@mail' },
    });
    expect(e1.id).toBeDefined();
    await expect(
      mock.employee.create({ data: { name: 'B', email: 'a@mail' } }),
    ).rejects.toHaveProperty('code', 'P2002');
  });

  it('contract.create fails if employee missing', async () => {
    await expect(
      mock.contract.create({
        data: { employeeId: 'no', contractType: 'EMPLOYEE', baseSalary: 1000 },
      }),
    ).rejects.toHaveProperty('code', 'P2003');
  });

  it('payrollRun.create fails if employee or contract missing', async () => {
    await expect(
      mock.payrollRun.create({
        data: {
          employeeId: 'no',
          contractId: null,
          period: '2026-01',
          gross: 1,
          net: 1,
          breakdown: {},
        },
      }),
    ).rejects.toHaveProperty('code', 'P2003');
    const emp = await mock.employee.create({
      data: { name: 'C', email: 'c@mail' },
    });
    await expect(
      mock.payrollRun.create({
        data: {
          employeeId: emp.id,
          contractId: 'no',
          period: '2026-01',
          gross: 1,
          net: 1,
          breakdown: {},
        },
      }),
    ).rejects.toHaveProperty('code', 'P2003');
  });

  it('supports payroll rule raw insert/update/delete/select', async () => {
    // Insert (via $queryRaw parsing)
    const [ins] = await mock.$queryRaw(
      'INSERT INTO "PayrollRule" (id, key, label, "contractType", unit, value, enabled, "createdAt", "updatedAt") VALUES (\'x\',\'TEST\',\'T\',null,\'PERCENT\',1,true,now(),now()) RETURNING *',
    );
    expect(ins).toHaveProperty('id');

    const all = await mock.$queryRaw('SELECT * FROM "PayrollRule"');
    expect(Array.isArray(all)).toBe(true);

    const [upd] = await mock.$queryRaw(
      `UPDATE "PayrollRule" SET value = 2 WHERE id = '${ins.id}' RETURNING *`,
    );
    expect(upd.id).toBe(ins.id);

    const [del] = await mock.$queryRaw(
      `DELETE FROM "PayrollRule" WHERE id = '${ins.id}' RETURNING *`,
    );
    expect(del.id).toBe(ins.id);
  });
});

export {};
