import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { PayrollModule } from './payroll/payroll.module';
import { EmployeesModule } from './employees/employees.module';
import { ContractsModule } from './contracts/contracts.module';

const disableThrottler =
  process.env.DISABLE_THROTTLER === '1' || process.env.NODE_ENV === 'test';

const imports: any[] = [
  PrismaModule,
  PayrollModule,
  EmployeesModule,
  ContractsModule,
];
const providers = [] as any[];

if (!disableThrottler) {
  // cast to any because ThrottlerModule.forRoot returns a DynamicModule
  // and our `imports` array is typed as `any[]` to allow mixed entries.
  imports.unshift(
    // explicit shape for the options to avoid passing raw `any` into forRoot
    ThrottlerModule.forRoot([{ ttl: 60, limit: 20 }] as unknown as Parameters<
      typeof ThrottlerModule.forRoot
    >[0]) as any,
  );
  providers.push({ provide: APP_GUARD, useClass: ThrottlerGuard });
}

@Module({
  imports,
  controllers: [],
  providers,
})
export class AppModule {}
