import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PayrollModule } from './payroll/payroll.module';
import { EmployeesModule } from './employees/employees.module';
import { ContractsModule } from './contracts/contracts.module';

@Module({
  imports: [PrismaModule, PayrollModule, EmployeesModule, ContractsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
