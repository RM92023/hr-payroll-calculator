import { IsOptional, IsEnum } from 'class-validator';
import { ContractType } from '@prisma/client';

export class FindPayrollRulesQueryDto {
  @IsOptional()
  @IsEnum(ContractType)
  contractType?: ContractType;
}
