import { CreatePayrollRuleUseCase } from './create-payroll-rule.usecase';
import { DeletePayrollRuleUseCase } from './delete-payroll-rule.usecase';
import { FindPayrollRuleUseCase } from './find-payroll-rule.usecase';
import { FindPayrollRulesUseCase } from './find-payroll-rules.usecase';
import { UpdatePayrollRuleUseCase } from './update-payroll-rule.usecase';

describe('Payroll rule use cases', () => {
  const makeRepo = () => ({
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  it('CreatePayrollRuleUseCase delegates to repo', async () => {
    const repo = makeRepo();
    repo.create.mockResolvedValue({ id: 'r1' });

    const uc = new CreatePayrollRuleUseCase(repo as any);
    const res = await uc.execute({
      key: 'K',
      label: 'L',
      unit: 'PERCENT',
      value: 1,
    });

    expect(res).toEqual({ id: 'r1' });
    expect(repo.create).toHaveBeenCalledWith({
      key: 'K',
      label: 'L',
      unit: 'PERCENT',
      value: 1,
    });
  });

  it('FindPayrollRuleUseCase delegates to repo', async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue({ id: 'x' });

    const uc = new FindPayrollRuleUseCase(repo as any);
    const res = await uc.execute('x');

    expect(res).toEqual({ id: 'x' });
    expect(repo.findById).toHaveBeenCalledWith('x');
  });

  it('FindPayrollRulesUseCase calls findAll without filter', async () => {
    const repo = makeRepo();
    repo.findAll.mockResolvedValue([]);

    const uc = new FindPayrollRulesUseCase(repo as any);
    await uc.execute();

    expect(repo.findAll).toHaveBeenCalledWith();
  });

  it('FindPayrollRulesUseCase calls findAll with contractType when provided', async () => {
    const repo = makeRepo();
    repo.findAll.mockResolvedValue([]);

    const uc = new FindPayrollRulesUseCase(repo as any);
    await uc.execute({ contractType: 'EMPLOYEE' });

    expect(repo.findAll).toHaveBeenCalledWith({ contractType: 'EMPLOYEE' });
  });

  it('UpdatePayrollRuleUseCase delegates to repo', async () => {
    const repo = makeRepo();
    repo.update.mockResolvedValue({ id: 'r1', value: 2 });

    const uc = new UpdatePayrollRuleUseCase(repo as any);
    const res = await uc.execute('r1', { value: 2 });

    expect(res).toEqual({ id: 'r1', value: 2 });
    expect(repo.update).toHaveBeenCalledWith('r1', { value: 2 });
  });

  it('DeletePayrollRuleUseCase delegates to repo', async () => {
    const repo = makeRepo();
    repo.delete.mockResolvedValue({ id: 'r1' });

    const uc = new DeletePayrollRuleUseCase(repo as any);
    const res = await uc.execute('r1');

    expect(res).toEqual({ id: 'r1' });
    expect(repo.delete).toHaveBeenCalledWith('r1');
  });
});
