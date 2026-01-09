import { EmployeeModel } from '../models/employee.models';

export interface EmployeeStrategy {
  supports(input: Partial<EmployeeModel>): boolean;
  process(input: EmployeeModel): EmployeeModel;
}

// Default simple strategy: returns the same model with a createdAt if missing
export class DefaultEmployeeStrategy implements EmployeeStrategy {
  supports() {
    return true; // fallback strategy
  }

  process(input: EmployeeModel): EmployeeModel {
    return {
      ...input,
      id: input.id ?? `emp_${Date.now()}`,
      createdAt: input.createdAt ?? new Date(),
    } as EmployeeModel;
  }
}
