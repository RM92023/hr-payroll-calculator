import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PayrollModule } from './payroll/payroll.module';
import { EmployeesModule } from './employees/employees.module';

@Module({
  imports: [PrismaModule, PayrollModule, EmployeesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
