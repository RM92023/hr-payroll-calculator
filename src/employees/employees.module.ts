import { Module } from '@nestjs/common';
import { EmployeesController } from './presentation/controllers/employees.controller';
import { CreateEmployeeUseCase } from './application/use-cases/create-employee.usecase';
import { FindEmployeesUseCase } from './application/use-cases/find-employees.usecase';

@Module({
  controllers: [EmployeesController],
  providers: [CreateEmployeeUseCase, FindEmployeesUseCase],
  exports: [CreateEmployeeUseCase, FindEmployeesUseCase],
})
export class EmployeesModule {}
