import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePayrollRuleDto {
  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  contractType?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  enabled?: boolean;
}
