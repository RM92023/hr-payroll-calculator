import { Injectable } from '@nestjs/common';
import { PayrollRuleRepository } from '../../domain/repositories/payroll-rule.repository';

@Injectable()
export class FindPayrollRuleUseCase {
  constructor(private readonly repo: PayrollRuleRepository) {}

  execute(id: string) {
    return this.repo.findById(id);
  }
}
