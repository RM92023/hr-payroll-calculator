import { CalculatePayrollUseCase } from './calculate-payroll.usecase';
import { ContractorTaxStrategy, EmployeeTaxStrategy } from '../../domain/services/tax.strategy';
import { PayrollCalculatorTemplate } from '../../domain/services/payroll.calculator.template';

class Calc extends PayrollCalculatorTemplate {}

describe('CalculatePayrollUseCase', () => {
  it('delegates calculation to calculator', () => {
    const calc = new Calc([new EmployeeTaxStrategy(), new ContractorTaxStrategy()]);
    const uc = new CalculatePayrollUseCase(calc);

    const res = uc.execute({ contractType: 'EMPLOYEE', baseSalary: 100_000, bonuses: 0, otherDeductions: 0 });

    expect(res.gross).toBe(100_000);
    expect(res.net).toBeLessThan(res.gross);
  });
});
