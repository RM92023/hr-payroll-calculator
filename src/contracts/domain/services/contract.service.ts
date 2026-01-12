import { ContractModel } from '../models/contract.models';

export class ContractService {
  calculateDurationMonths(
    contract: Pick<ContractModel, 'startDate' | 'endDate'>,
  ): number {
    const start = new Date(contract.startDate).getTime();
    const end = contract.endDate
      ? new Date(contract.endDate).getTime()
      : Date.now();
    const months = Math.floor((end - start) / (1000 * 60 * 60 * 24 * 30));
    return months;
  }
}
