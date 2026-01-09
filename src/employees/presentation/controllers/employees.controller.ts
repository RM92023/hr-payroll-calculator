import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateEmployeeDto } from '../../application/dtos/create-employee.dto';
import { CreateEmployeeUseCase } from '../../application/use-cases/create-employee.usecase';
import { FindEmployeesUseCase } from '../../application/use-cases/find-employees.usecase';
import { CalculateEmployeeUseCase } from '../../application/use-cases/calculate-employee.usecase';
import type { Employee } from '@prisma/client';
import type { EmployeeModel } from '../../domain/models/employee.models';

@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly createUseCase: CreateEmployeeUseCase,
    private readonly findUseCase: FindEmployeesUseCase,
    private readonly calculateUseCase: CalculateEmployeeUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateEmployeeDto): Promise<Employee> {
    return (await this.createUseCase.execute(dto)) as unknown as Employee;
  }

  @Get()
  async findAll(): Promise<Employee[]> {
    return (await this.findUseCase.execute()) as unknown as Employee[];
  }

  @Post('process')
  async process(@Body() dto: Partial<EmployeeModel>): Promise<Employee> {
    // cast is necessary because calculator returns EmployeeModel-like objects
    return (await this.calculateUseCase.execute(dto)) as unknown as Employee;
  }
}
