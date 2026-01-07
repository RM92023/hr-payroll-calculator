export type ContractType = 'EMPLOYEE' | 'CONTRACTOR';

export interface PayrollInput {
  contractType: ContractType;
  baseSalary: number;        // número simple para el reto
  bonuses?: number;          // suma de bonos
  otherDeductions?: number;  // deducciones extra
}

export interface PayrollResult {
  gross: number;
  taxes: number;
  mandatoryDeductions: number;
  otherDeductions: number;
  net: number;
  breakdown: Record<string, number>;
}
