/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EmployeeCalculatorTemplate } from './employee.calculator.template';
import { DefaultEmployeeStrategy, EmployeeStrategy } from './employee.strategy';
import { EmployeeModel } from '../models/employee.models';

class Calc extends EmployeeCalculatorTemplate {
  constructor(strategies: EmployeeStrategy[]) {
    super(strategies);
  }
}

describe('EmployeeCalculatorTemplate', () => {
  it('validates required fields', () => {
    const calc = new Calc([new DefaultEmployeeStrategy()]);

    // @ts-expect-error test purpose
    expect(() => calc.calculate(undefined)).toThrow('input required');
    expect(() => calc.calculate({})).toThrow('name required');
    expect(() => calc.calculate({ name: 'A' })).toThrow('email required');
  });

  it('throws when no strategy supports input', () => {
    const noStrategy: EmployeeStrategy = {
      supports: () => false,
      process: (i: any) => ({ ...(i as object) }) as EmployeeModel,
    };
    const calc = new Calc([noStrategy]);

    expect(() => calc.calculate({ name: 'A', email: 'a@mail.com' })).toThrow(
      'No employee strategy for given input',
    );
  });

  it('uses the first strategy that supports input', () => {
    const first: EmployeeStrategy = {
      supports: () => true,
      process: (input: any) =>
        ({
          ...(input as object),
          id: 'e1',
          createdAt: new Date(),
          name: input.name,
          email: input.email,
          tag: 'first',
        }) as EmployeeModel,
    };
    const second: EmployeeStrategy = {
      supports: () => true,
      process: (input: any) =>
        ({
          ...(input as object),
          id: 'e2',
          createdAt: new Date(),
          name: input.name,
          email: input.email,
          tag: 'second',
        }) as EmployeeModel,
    };

    const calc = new Calc([first, second]);
    const res = calc.calculate({ name: 'A', email: 'a@mail.com' });

    expect(res).toMatchObject({ name: 'A', email: 'a@mail.com', tag: 'first' });
  });

  it('DefaultEmployeeStrategy enriches id and createdAt when missing', () => {
    const calc = new Calc([new DefaultEmployeeStrategy()]);
    const res = calc.calculate({ name: 'A', email: 'a@mail.com' });

    expect(res.id).toBeDefined();
    expect(res.createdAt).toBeInstanceOf(Date);
  });
});
