import { Injectable } from '@nestjs/common';
import {
  PayrollRuleRepository,
  PayrollRulePayload,
} from '../../domain/repositories/payroll-rule.repository';

@Injectable()
export class CreatePayrollRuleUseCase {
  constructor(private readonly repo: PayrollRuleRepository) {}

  execute(payload: PayrollRulePayload) {
    return this.repo.create(payload);
  }
}
