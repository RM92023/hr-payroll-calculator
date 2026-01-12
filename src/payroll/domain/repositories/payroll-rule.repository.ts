import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { randomUUID } from 'crypto';

export interface PayrollRulePayload {
  key: string;
  label: string;
  contractType?: string | null;
  unit: string;
  value: number;
  enabled?: boolean;
}

export interface PayrollRuleModel extends PayrollRulePayload {
  id: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class PayrollRuleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter?: {
    contractType?: string;
  }): Promise<PayrollRuleModel[]> {
    if (filter?.contractType) {
      const rows = await this.prisma.$queryRaw<PayrollRuleModel[]>`
        SELECT * FROM "PayrollRule" WHERE "contractType" = ${filter.contractType}
      `;
      return rows ?? [];
    }
    const rows = await this.prisma.$queryRaw<
      PayrollRuleModel[]
    >`SELECT * FROM "PayrollRule"`;
    return rows ?? [];
  }

  async findById(id: string): Promise<PayrollRuleModel | null> {
    const res = await this.prisma.$queryRaw<
      PayrollRuleModel[]
    >`SELECT * FROM "PayrollRule" WHERE id = ${id} LIMIT 1`;
    return Array.isArray(res) ? (res[0] ?? null) : null;
  }

  async create(payload: PayrollRulePayload): Promise<PayrollRuleModel> {
    const id = randomUUID();
    const res = await this.prisma.$queryRaw<PayrollRuleModel[]>`
      INSERT INTO "PayrollRule" (id, key, label, "contractType", unit, value, enabled, "createdAt", "updatedAt")
      VALUES (${id}, ${payload.key}, ${payload.label}, ${payload.contractType ?? null}, ${payload.unit}, ${payload.value}, coalesce(${payload.enabled}, true), now(), now())
      RETURNING *
    `;
    return Array.isArray(res) ? res[0] : (res as unknown as PayrollRuleModel);
  }

  async update(
    id: string,
    payload: Partial<PayrollRulePayload>,
  ): Promise<PayrollRuleModel | null> {
    const res = await this.prisma.$queryRaw<PayrollRuleModel[]>`
      UPDATE "PayrollRule" SET
        key = COALESCE(${payload.key}, "PayrollRule".key),
        label = COALESCE(${payload.label}, "PayrollRule".label),
        "contractType" = COALESCE(${payload.contractType}, "PayrollRule"."contractType"),
        unit = COALESCE(${payload.unit}, "PayrollRule".unit),
        value = COALESCE(${payload.value}, "PayrollRule".value),
        enabled = COALESCE(${payload.enabled}, "PayrollRule".enabled),
        "updatedAt" = now()
      WHERE id = ${id}
      RETURNING *
    `;
    return Array.isArray(res) ? (res[0] ?? null) : null;
  }

  async delete(id: string): Promise<PayrollRuleModel | null> {
    const res = await this.prisma.$queryRaw<
      PayrollRuleModel[]
    >`DELETE FROM "PayrollRule" WHERE id = ${id} RETURNING *`;
    return Array.isArray(res) ? (res[0] ?? null) : null;
  }
}
