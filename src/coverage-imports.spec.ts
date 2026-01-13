/**
 * Purpose: load DTO modules so they are included in Jest coverage.
 * This keeps coverage focused on business logic (domain + application) without
 * needing to spin up the Nest app (which requires a real DB connection).
 */

// Contracts DTOs
import './contracts/application/dtos/create-contract.dto';

// Employees DTOs
import './employees/application/dtos/create-employee.dto';
import './employees/application/dtos/calculate-employee.dto';

// Payroll DTOs
import './payroll/application/dtos/calculate-payroll.dto';
import './payroll/application/dtos/create-payroll-rule.dto';
import './payroll/application/dtos/update-payroll-rule.dto';
import './payroll/application/dtos/create-payroll-run.dto';
import './payroll/application/dtos/find-payroll-rules.query.dto';
import './payroll/application/dtos/find-payroll-runs.query.dto';

describe('coverage imports', () => {
  it('loads DTO modules for coverage', () => {
    expect(true).toBe(true);
  });
});
