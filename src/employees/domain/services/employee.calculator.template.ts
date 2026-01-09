import { EmployeeModel } from '../models/employee.models';
import { EmployeeStrategy } from './employee.strategy';

export abstract class EmployeeCalculatorTemplate {
  constructor(private readonly strategies: EmployeeStrategy[]) {}

  // TEMPLATE METHOD: defines algorithm to transform/compute employee data
  calculate(input: Partial<EmployeeModel>): EmployeeModel {
    this.validate(input);

    // Default behaviour: pick a strategy that supports the input and delegate
    const strategy = this.strategies.find((s) => s.supports(input));
    if (!strategy) throw new Error('No employee strategy for given input');

    return strategy.process(input as EmployeeModel);
  }

  protected validate(input: Partial<EmployeeModel>) {
    if (!input) throw new Error('input required');
    if (!input.name) throw new Error('name required');
    if (!input.email) throw new Error('email required');
  }
}
