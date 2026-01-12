import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';

/**
 * Crea una corrida de nómina (PayrollRun) y la persiste.
 *
 * Nota: Este reto no pretende representar reglas legales reales.
 */
export class CreatePayrollRunDto {
  @IsUUID()
  employeeId!: string;

  /**
   * Periodo en formato YYYY-MM (ej: 2026-01)
   */
  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'period debe tener formato YYYY-MM (ej: 2026-01)',
  })
  period!: string;

  /**
   * Si se envía, se usa este contrato. Si no, se toma el contrato activo más reciente.
   */
  @IsOptional()
  @IsUUID()
  contractId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bonuses?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  otherDeductions?: number;
}
