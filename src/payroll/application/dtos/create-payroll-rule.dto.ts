import { ContractType, RuleUnit } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePayrollRuleDto {
  @IsString()
  key: string;

  @IsString()
  label: string;

  @IsOptional()
  @IsEnum(ContractType)
  contractType?: ContractType;

  @IsEnum(RuleUnit)
  unit: RuleUnit;

  @IsNumber()
  @Min(0)
  value: number;
}
