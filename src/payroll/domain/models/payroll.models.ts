export type ContractType = 'EMPLOYEE' | 'CONTRACTOR';

export interface PayrollInput {
  contractType: ContractType;
  baseSalary: number; // número simple para el reto
  bonuses?: number; // suma de bonos
  otherDeductions?: number; // deducciones extra
}

export interface PayrollResult {
  gross: number;
  taxes: number;
  mandatoryDeductions: number;
  otherDeductions: number;
  net: number;
  breakdown: Record<string, number>;
}

export interface PayrollRulesSnapshot {
  employee: {
    healthPct: number;
    pensionPct: number;
    extraMandatoryPct: number;
    withholdingPct: number;
    withholdingThreshold: number;
  };
  contractor: {
    withholdingPct: number;
  };
}

export interface PayrollInput {
  contractType: ContractType;
  baseSalary: number;
  bonuses?: number;
  otherDeductions?: number;

  rules?: PayrollRulesSnapshot;
}
