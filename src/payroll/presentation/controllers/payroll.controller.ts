import { Body, Controller, Get, Post } from '@nestjs/common';
import { CalculatePayrollUseCase } from '../../application/use-cases/calculate-payroll.usecase';
import { CalculatePayrollDto } from '../../application/dtos/calculate-payroll.dto';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly uc: CalculatePayrollUseCase) {}

  @Post('calculate')
  calculate(@Body() dto: CalculatePayrollDto) {
    return this.uc.execute(dto);
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
