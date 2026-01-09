import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { Inject } from '@nestjs/common';
import { Employee } from '@prisma/client';

export class CreateEmployeeUseCase {
  constructor(@Inject('PRISMA') private prisma: any) {}
  async execute(dto: CreateEmployeeDto): Promise<Employee> {
    // PRISMA is a runtime-provided client or mock; suppress unsafe-call/member-access lint here
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const created = await this.prisma.employee.create({ data: dto });
    return created as unknown as Employee;
  }
}
