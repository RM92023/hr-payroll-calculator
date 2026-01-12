/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, no-useless-escape */
import { Injectable } from '@nestjs/common';

function generateId() {
  // simple RFC4122 v4 UUID generator (no external deps)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

type PayrollRun = any;
type Employee = any;
type Contract = any;

@Injectable()
export class MockPrismaService {
  // HUMAN REVIEW: MockPrismaService was created to avoid depending on a real
  // database in CI and local tests. It intentionally implements a minimal
  // subset of Prisma client's API used by the app. Keep in sync with real
  // PrismaService when adding new queries.
  private employees: Employee[] = [];
  private contracts: Contract[] = [];
  private payrollRuns: PayrollRun[] = [];
  private payrollRules: any[] = [];

  // Employee methods
  employee = {
    create: async ({ data }: { data: any }) => {
      if (this.employees.find((e) => e.email === data.email)) {
        const err: any = new Error('Unique constraint failed: email');
        err.code = 'P2002';
        throw err;
      }
      const record = { id: generateId(), createdAt: new Date(), ...data };
      this.employees.push(record);
      return record;
    },
    findMany: async (args?: any) => {
      if (!args) return this.employees;
      if (args.where && args.where.id)
        return this.employees.filter((e) => e.id === args.where.id);
      return this.employees;
    },
    findUnique: async ({ where }: { where: any }) => {
      if (where?.id)
        return this.employees.find((e) => e.id === where.id) || null;
      if (where?.email)
        return this.employees.find((e) => e.email === where.email) || null;
      return null;
    },
  };

  // Contract methods
  contract = {
    create: async ({ data }: { data: any }) => {
      const employee = this.employees.find((e) => e.id === data.employeeId);
      if (!employee) {
        const err: any = new Error('Foreign key constraint failed: employeeId');
        err.code = 'P2003';
        throw err;
      }
      const record = { id: generateId(), createdAt: new Date(), ...data };
      this.contracts.push(record);
      return record;
    },
    findMany: async ({ where }: any) => {
      if (where?.employeeId)
        return this.contracts.filter((c) => c.employeeId === where.employeeId);
      return this.contracts;
    },
    findUnique: async ({ where }: any) => {
      if (where?.id)
        return this.contracts.find((c) => c.id === where.id) || null;
      return null;
    },
    update: async ({ where, data }: any) => {
      const idx = this.contracts.findIndex((c) => c.id === where.id);
      if (idx === -1) return null;
      this.contracts[idx] = { ...this.contracts[idx], ...data };
      return this.contracts[idx];
    },
  };

  // PayrollRun methods
  payrollRun = {
    create: async ({ data }: { data: any }) => {
      const employee = this.employees.find((e) => e.id === data.employeeId);
      if (!employee) {
        const err: any = new Error('Foreign key constraint failed: employeeId');
        err.code = 'P2003';
        throw err;
      }
      if (data.contractId) {
        const contract = this.contracts.find((c) => c.id === data.contractId);
        if (!contract) {
          const err: any = new Error(
            'Foreign key constraint failed: contractId',
          );
          err.code = 'P2003';
          throw err;
        }
      }
      const record = { id: generateId(), createdAt: new Date(), ...data };
      this.payrollRuns.push(record);
      return record;
    },
    findMany: async ({ where }: any) => {
      let res = this.payrollRuns;
      if (where?.employeeId)
        res = res.filter((r) => r.employeeId === where.employeeId);
      if (where?.period) res = res.filter((r) => r.period === where.period);
      return res;
    },
    findUnique: async ({ where }: any) => {
      if (where?.id)
        return this.payrollRuns.find((r) => r.id === where.id) || null;
      return null;
    },
  };

  // Minimal support for raw queries used by PayrollRuleRepository
  async $queryRaw(query: any): Promise<any> {
    const q = String(query || '');
    const ql = q.toLowerCase();

    // SELECT * FROM "PayrollRule" WHERE "contractType" = ${filter.contractType}
    if (
      ql.includes('select') &&
      ql.includes('from "payrollrule"') &&
      ql.includes('where') &&
      ql.includes('contracttype')
    ) {
      const m = q.match(/where "contractType" = (?:'|")?(\w+)(?:'|")?/i);
      const contractType = m ? m[1] : null;
      return this.payrollRules.filter((r) => r.contractType === contractType);
    }

    // SELECT * FROM "PayrollRule" WHERE id = ${id}
    if (
      ql.includes('select') &&
      ql.includes('from "payrollrule"') &&
      ql.includes('where') &&
      ql.includes('id')
    ) {
      const m = q.match(/where id = (?:'|")?([\w\-]+)(?:'|")?/i);
      const id = m ? m[1] : null;
      return this.payrollRules.filter((r) => r.id === id);
    }

    // SELECT * FROM "PayrollRule"
    if (
      ql.includes('select') &&
      ql.includes('from "payrollrule"') &&
      !ql.includes('where')
    ) {
      return this.payrollRules;
    }

    // INSERT INTO "PayrollRule" ... RETURNING *  (very naive: parse VALUES)
    if (ql.includes('insert into "payrollrule"')) {
      // We will just create a rule from placeholders found in query using simple regex for key, label, unit, value
      const keyMatch = q.match(/values \((?:'|")?([\w_]+)(?:'|")?,/i);
      const key = keyMatch ? keyMatch[1] : `rule-${generateId()}`;
      const rec: any = {
        id: generateId(),
        key,
        label: key,
        contractType: null,
        unit: 'PERCENT',
        value: 0,
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.payrollRules.push(rec);
      return [rec];
    }

    // UPDATE ... RETURNING *
    if (ql.includes('update "payrollrule"')) {
      const m = q.match(/where id = (?:'|")?([\w\-]+)(?:'|")?/i);
      const id = m ? m[1] : null;
      const idx = this.payrollRules.findIndex((r) => r.id === id);
      if (idx === -1) return [];
      // naive: do not parse fields, just update updatedAt
      this.payrollRules[idx].updatedAt = new Date().toISOString();
      return [this.payrollRules[idx]];
    }

    // DELETE ... RETURNING *
    if (ql.includes('delete from "payrollrule"')) {
      const m = q.match(/where id = (?:'|")?([\w\-]+)(?:'|")?/i);
      const id = m ? m[1] : null;
      const idx = this.payrollRules.findIndex((r) => r.id === id);
      if (idx === -1) return [];
      const [deleted] = this.payrollRules.splice(idx, 1);
      return [deleted];
    }

    return [];
  }

  // Utility for tests
  reset() {
    this.employees = [];
    this.contracts = [];
    this.payrollRuns = [];
    this.payrollRules = [];
  }
}

export default MockPrismaService;
