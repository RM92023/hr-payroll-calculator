import { PayrollInput } from '../models/payroll.models';

export interface TaxStrategy {
  supports(input: PayrollInput): boolean;
  computeTaxes(
    gross: number,
    input: PayrollInput,
  ): { total: number; detail: Record<string, number> };
}

export class EmployeeTaxStrategy implements TaxStrategy {
  supports(input: PayrollInput) {
    return input.contractType === 'EMPLOYEE';
  }

  computeTaxes(gross: number) {
    // Reglas FICTICIAS para el reto (no legales): salud 4%, pensión 4%, retención 10% sobre excedente.
    const health = gross * 0.04;
    const pension = gross * 0.04;
    const withholding = Math.max(0, (gross - 2_000_000) * 0.1);
    const total = health + pension + withholding;

    return { total, detail: { health, pension, withholding } };
  }
}

export class ContractorTaxStrategy implements TaxStrategy {
  supports(input: PayrollInput) {
    return input.contractType === 'CONTRACTOR';
  }

  computeTaxes(gross: number) {
    // FICTICIO: retención única 12%
    const withholding = gross * 0.12;
    return { total: withholding, detail: { withholding } };
  }
}
