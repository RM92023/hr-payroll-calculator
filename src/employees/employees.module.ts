import { Module } from '@nestjs/common';
import { EmployeesController } from './presentation/controllers/employees.controller';
import { CreateEmployeeUseCase } from './application/use-cases/create-employee.usecase';
import { FindEmployeesUseCase } from './application/use-cases/find-employees.usecase';
import { EmployeeCalculatorTemplate } from './domain/services/employee.calculator.template';
import {
  DefaultEmployeeStrategy,
  EmployeeStrategy,
} from './domain/services/employee.strategy';
import { CalculateEmployeeUseCase } from './application/use-cases/calculate-employee.usecase';

class DefaultEmployeeCalculator extends EmployeeCalculatorTemplate {}

@Module({
  controllers: [EmployeesController],
  providers: [
    CreateEmployeeUseCase,
    FindEmployeesUseCase,
    DefaultEmployeeStrategy,
    {
      provide: 'EMPLOYEE_STRATEGIES',
      useFactory: (d: DefaultEmployeeStrategy): EmployeeStrategy[] => [d],
      inject: [DefaultEmployeeStrategy],
    },
    {
      provide: EmployeeCalculatorTemplate,
      useFactory: (strategies: EmployeeStrategy[]) =>
        new DefaultEmployeeCalculator(strategies),
      inject: ['EMPLOYEE_STRATEGIES'],
    },
    {
      provide: CalculateEmployeeUseCase,
      useFactory: (c: EmployeeCalculatorTemplate) =>
        new CalculateEmployeeUseCase(c),
      inject: [EmployeeCalculatorTemplate],
    },
  ],
  exports: [
    CreateEmployeeUseCase,
    FindEmployeesUseCase,
    CalculateEmployeeUseCase,
  ],
})
export class EmployeesModule {}
