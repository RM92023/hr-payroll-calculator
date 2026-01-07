import {
  PayrollInput,
  PayrollResult,
} from '../../domain/models/payroll.models';
import { PayrollCalculatorTemplate } from '../../domain/services/payroll.calculator.template';

export class CalculatePayrollUseCase {
  constructor(private readonly calculator: PayrollCalculatorTemplate) {}

  execute(input: PayrollInput): PayrollResult {
    return this.calculator.calculate(input);
  }
}
