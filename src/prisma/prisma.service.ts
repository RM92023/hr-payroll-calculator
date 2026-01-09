import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      // runtime PrismaClient may be typed as unknown when @prisma/client isn't generated in some environments

      await (this.$connect as unknown as () => Promise<void>)();
    } catch (err: unknown) {
      // If a real DB is not available, log and continue. In tests we
      // provide MockPrismaService via PrismaModule when appropriate.
      const maybeErr = err;

      function hasMessage(x: unknown): x is { message: string } {
        return (
          typeof x === 'object' &&
          x !== null &&
          'message' in x &&
          typeof (x as any).message === 'string'
        );
      }

      let msg: string;
      if (hasMessage(maybeErr)) {
        msg = maybeErr.message;
      } else {
        msg = String(maybeErr);
      }

      console.warn('Prisma connect skipped or failed:', msg);
    }
  }

  enableShutdownHooks(app: INestApplication) {
    // PrismaClient's $on has a narrow typed event union; cast the method itself to unknown
    // and call it to avoid type errors while keeping the rest typed.

    // bind the client method to preserve internal `this` and avoid unbound-method lint error
    const $on = (
      this.$on as unknown as (
        this: PrismaClient,
        event: string,
        cb: () => void,
      ) => void
    ).bind(this) as (event: string, cb: () => void) => void;

    $on('beforeExit', () => {
      // avoid returning promise to the event handler (lint rule)
      void app.close();
    });
  }
}

// Minimal in-memory mock used for tests or when DATABASE_URL is not provided.
export type EmployeeRecord = {
  id: string;
  name?: string;
  email?: string;
  createdAt: Date;
  [key: string]: unknown;
};

@Injectable()
export class MockPrismaService {
  private employees: EmployeeRecord[] = [];

  // mimic prisma.employee.create
  employee = {
    create: ({
      data,
    }: {
      data: Partial<EmployeeRecord>;
    }): Promise<EmployeeRecord> => {
      const now = new Date();
      const record: EmployeeRecord = {
        id:
          (data.id as string) ??
          `mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        createdAt: (data.createdAt as Date) ?? now,
        ...(data as Record<string, unknown>),
      };

      this.employees.unshift(record);

      return Promise.resolve(record);
    },
    findMany: (
      _opts: { orderBy?: Record<string, unknown> } = {},
    ): Promise<EmployeeRecord[]> => {
      // simple return; tests expect descending creation order
      void _opts; // mark used for linter

      return Promise.resolve(this.employees.slice());
    },
  };

  $connect(): Promise<void> {
    return Promise.resolve();
  }

  $disconnect(): Promise<void> {
    return Promise.resolve();
  }

  $on(_event: string, _callback: () => void): void {
    // mark args used to satisfy linter
    void _event;
    void _callback;
  }
}
