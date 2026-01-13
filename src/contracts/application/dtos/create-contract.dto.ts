import { ContractType } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateContractDto {
  @IsString()
  employeeId!: string;

  @IsEnum(ContractType)
  contractType!: ContractType;

  @IsInt()
  @Min(0)
  baseSalary!: number;

  @IsOptional()
  active?: boolean;
}
