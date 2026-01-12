import { Module } from '@nestjs/common';
import { PayrollController } from './presentation/controllers/payroll.controller';
import { CalculatePayrollUseCase } from './application/use-cases/calculate-payroll.usecase';
import { CreatePayrollRunUseCase } from './application/use-cases/create-payroll-run.usecase';
import { FindPayrollRunsUseCase } from './application/use-cases/find-payroll-runs.usecase';
import { PrismaService } from '../prisma/prisma.service';
import { PayrollCalculatorTemplate } from './domain/services/payroll.calculator.template';
import {
  ContractorTaxStrategy,
  EmployeeTaxStrategy,
  TaxStrategy,
} from './domain/services/tax.strategy';

class DefaultPayrollCalculator extends PayrollCalculatorTemplate {}

@Module({
  controllers: [PayrollController],
  providers: [
    EmployeeTaxStrategy,
    ContractorTaxStrategy,
    {
      // HUMAN REVIEW: Mantengo el dominio puro (sin Nest). Inyecto estrategias desde el módulo
      // para que el template/calculadora sea fácil de testear y no cree dependencias internamente.
      provide: 'TAX_STRATEGIES',
      useFactory: (
        e: EmployeeTaxStrategy,
        c: ContractorTaxStrategy,
      ): TaxStrategy[] => [e, c],
      inject: [EmployeeTaxStrategy, ContractorTaxStrategy],
    },
    {
      provide: PayrollCalculatorTemplate,
      useFactory: (strategies: TaxStrategy[]) =>
        new DefaultPayrollCalculator(strategies),
      inject: ['TAX_STRATEGIES'],
    },
    {
      provide: CalculatePayrollUseCase,
      useFactory: (calc: PayrollCalculatorTemplate) =>
        new CalculatePayrollUseCase(calc),
      inject: [PayrollCalculatorTemplate],
    },
    {
      provide: CreatePayrollRunUseCase,
      useFactory: (prisma: PrismaService, calc: PayrollCalculatorTemplate) =>
        new CreatePayrollRunUseCase(prisma, calc),
      inject: [PrismaService, PayrollCalculatorTemplate],
    },
    {
      provide: FindPayrollRunsUseCase,
      useFactory: (prisma: PrismaService) => new FindPayrollRunsUseCase(prisma),
      inject: [PrismaService],
    },
  ],
  exports: [
    CalculatePayrollUseCase,
    CreatePayrollRunUseCase,
    FindPayrollRunsUseCase,
  ],
})
export class PayrollModule {}
