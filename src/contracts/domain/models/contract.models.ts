export type ContractStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface ContractModel {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate?: Date | null;
  salary: number;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR';
  status: ContractStatus;
  createdAt: Date;
}
