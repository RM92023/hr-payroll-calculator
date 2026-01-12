import { Module } from '@nestjs/common';
import { ContractsController } from './presentation/controllers/contracts.controller';
import { CreateContractUseCase } from './application/use-cases/create-contract.usecase';
import { FindContractsUseCase } from './application/use-cases/find-contracts.usecase';

@Module({
  controllers: [ContractsController],
  providers: [CreateContractUseCase, FindContractsUseCase],
  exports: [CreateContractUseCase, FindContractsUseCase],
})
export class ContractsModule {}
