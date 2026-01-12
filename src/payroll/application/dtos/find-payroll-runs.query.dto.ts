import { IsOptional, IsString, IsUUID, Matches } from 'class-validator';

export class FindPayrollRunsQueryDto {
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'period debe tener formato YYYY-MM (ej: 2026-01)',
  })
  period?: string;
}
