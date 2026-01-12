import { Injectable } from '@nestjs/common';
import { PayrollRuleRepository } from '../../domain/repositories/payroll-rule.repository';

export type FindPayrollRulesFilter = { contractType?: string } | undefined;

@Injectable()
export class FindPayrollRulesUseCase {
  constructor(private readonly repo: PayrollRuleRepository) {}

  execute(filter?: FindPayrollRulesFilter) {
    if (filter?.contractType) {
      return this.repo.findAll({ contractType: filter.contractType });
    }
    return this.repo.findAll();
  }
}
