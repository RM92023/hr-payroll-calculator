import { Module } from '@nestjs/common';
import { PayrollController } from './presentation/controllers/payroll.controller';
import { CalculatePayrollUseCase } from './application/use-cases/calculate-payroll.usecase';
import { PayrollCalculatorTemplate } from './domain/services/payroll.calculator.template';
import { ContractorTaxStrategy, EmployeeTaxStrategy, TaxStrategy } from './domain/services/tax.strategy';

class DefaultPayrollCalculator extends PayrollCalculatorTemplate {}

@Module({
  controllers: [PayrollController],
  providers: [
    EmployeeTaxStrategy,
    ContractorTaxStrategy,
    {
      provide: 'TAX_STRATEGIES',
      useFactory: (e: EmployeeTaxStrategy, c: ContractorTaxStrategy): TaxStrategy[] => [e, c],
      inject: [EmployeeTaxStrategy, ContractorTaxStrategy],
    },
    {
      provide: PayrollCalculatorTemplate,
      useFactory: (strategies: TaxStrategy[]) => new DefaultPayrollCalculator(strategies),
      inject: ['TAX_STRATEGIES'],
    },
    {
      provide: CalculatePayrollUseCase,
      useFactory: (calc: PayrollCalculatorTemplate) => new CalculatePayrollUseCase(calc),
      inject: [PayrollCalculatorTemplate],
    },
  ],
  exports: [CalculatePayrollUseCase],
})
export class PayrollModule {}
