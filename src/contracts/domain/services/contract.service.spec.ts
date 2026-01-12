import { ContractService } from './contract.service';

describe('ContractService', () => {
  it('calculates months duration between dates', () => {
    const svc = new ContractService();
    const start = new Date('2024-01-01');
    const end = new Date('2024-04-01');
    const months = svc.calculateDurationMonths({
      startDate: start,
      endDate: end,
    });
    expect(months).toBeGreaterThanOrEqual(2);
  });

  it('uses now when endDate is not provided', () => {
    const svc = new ContractService();
    const start = new Date();
    const months = svc.calculateDurationMonths({
      startDate: start,
      endDate: undefined,
    });
    expect(typeof months).toBe('number');
  });
});
