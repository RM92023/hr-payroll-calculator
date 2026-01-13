import { CalculateEmployeeUseCase } from './calculate-employee.usecase';

describe('CalculateEmployeeUseCase', () => {
  it('delegates to calculator template', async () => {
    const calculator = {
      calculate: jest.fn().mockReturnValue({ name: 'A', email: 'a@mail.com' }),
    };

    const uc = new CalculateEmployeeUseCase(calculator as any);
    const res = await uc.execute({ name: 'A', email: 'a@mail.com' } as any);

    expect(res).toEqual({ name: 'A', email: 'a@mail.com' });
    expect(calculator.calculate).toHaveBeenCalledWith({
      name: 'A',
      email: 'a@mail.com',
    });
  });
});
