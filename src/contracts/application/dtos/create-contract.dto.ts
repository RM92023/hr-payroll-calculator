import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateContractDto {
  @IsString()
  employeeId!: string;

  @IsEnum(['EMPLOYEE', 'CONTRACTOR'])
  contractType!: 'EMPLOYEE' | 'CONTRACTOR';

  @IsInt()
  @Min(0)
  baseSalary!: number;

  @IsOptional()
  active?: boolean;
}
