import { Inject } from '@nestjs/common';
import { Employee } from '@prisma/client';

export class FindEmployeesUseCase {
  constructor(@Inject('PRISMA') private prisma: any) {}

  async execute(): Promise<Employee[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const list = await this.prisma.employee.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return list as unknown as Employee[];
  }
}
