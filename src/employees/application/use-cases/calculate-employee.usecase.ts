import { EmployeeModel } from '../../domain/models/employee.models';
import { EmployeeCalculatorTemplate } from '../../domain/services/employee.calculator.template';

export class CalculateEmployeeUseCase {
  constructor(private readonly calculator: EmployeeCalculatorTemplate) {}
  async execute(input: Partial<EmployeeModel>): Promise<EmployeeModel> {
    // calculator.calculate is synchronous by design in the template; wrap in Promise for uniform async use
    return Promise.resolve(
      this.calculator.calculate(input) as unknown as EmployeeModel,
    );
  }
}
