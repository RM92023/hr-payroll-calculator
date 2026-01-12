import { Injectable } from '@nestjs/common';
import {
  PayrollRuleRepository,
  PayrollRulePayload,
} from '../../domain/repositories/payroll-rule.repository';

@Injectable()
export class UpdatePayrollRuleUseCase {
  constructor(private readonly repo: PayrollRuleRepository) {}

  execute(id: string, payload: Partial<PayrollRulePayload>) {
    return this.repo.update(id, payload);
  }
}
