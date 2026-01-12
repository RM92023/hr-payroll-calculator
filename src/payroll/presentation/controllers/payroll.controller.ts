import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreatePayrollRunUseCase } from '../../application/use-cases/create-payroll-run.usecase';
import { FindPayrollRunsUseCase } from '../../application/use-cases/find-payroll-runs.usecase';
import { CreatePayrollRunDto } from '../../application/dtos/create-payroll-run.dto';
import { FindPayrollRunsQueryDto } from '../../application/dtos/find-payroll-runs.query.dto';

@Controller('payroll')
export class PayrollController {
  constructor(
    private readonly createRunUseCase: CreatePayrollRunUseCase,
    private readonly findRunsUseCase: FindPayrollRunsUseCase,
  ) {}

  @Post('runs')
  createRun(@Body() dto: CreatePayrollRunDto) {
    return this.createRunUseCase.execute(dto);
  }

  @Get('runs')
  findRuns(@Query() query: FindPayrollRunsQueryDto) {
    return this.findRunsUseCase.execute(query);
  }

  @Get('rules')
  rules() {
    return {
      note: 'Reglas ficticias de reto (no legales).',
      employee: {
        health: '4%',
        pension: '4%',
        withholding: '10% sobre excedente de 2,000,000',
        extraMandatory: '1%',
      },
      contractor: { withholding: '12%' },
    };
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
