import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { PayrollModule } from './payroll/payroll.module';
import { EmployeesModule } from './employees/employees.module';
import { ContractsModule } from './contracts/contracts.module';

@Module({
  imports: [
    ThrottlerModule.forRoot(([{ ttl: 60, limit: 20 }] as unknown) as any),
    PrismaModule,
    PayrollModule,
    EmployeesModule,
    ContractsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
