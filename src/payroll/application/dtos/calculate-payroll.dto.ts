import { IsIn, IsNumber, IsOptional, Min } from 'class-validator';

export class CalculatePayrollDto {
  @IsIn(['EMPLOYEE', 'CONTRACTOR'])
  contractType!: 'EMPLOYEE' | 'CONTRACTOR';

  @IsNumber()
  @Min(0)
  baseSalary!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bonuses?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  otherDeductions?: number;
}
