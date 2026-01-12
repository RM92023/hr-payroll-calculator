import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePayrollRuleDto {
  @IsString()
  key: string;

  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  contractType?: string;

  @IsString()
  unit: string;

  @IsNumber()
  value: number;
}
