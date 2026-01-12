import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateContractDto } from '../../application/dtos/create-contract.dto';
import { CreateContractUseCase } from '../../application/use-cases/create-contract.usecase';
import { FindContractsUseCase } from '../../application/use-cases/find-contracts.usecase';

@Controller('contracts')
export class ContractsController {
  constructor(
    private readonly createUc: CreateContractUseCase,
    private readonly findUc: FindContractsUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateContractDto) {
    return await this.createUc.execute(dto);
  }

  @Get()
  async findAll() {
    return await this.findUc.execute();
  }
}
