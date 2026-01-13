/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaExceptionFilter } from '../src/prisma/prisma-exception.filter';

type PayrollRunResponse = {
  id: string;
  employeeId: string;
  contractId: string;
  period: string;
  gross: number;
  net: number;
  breakdown: Record<string, unknown>;
};

describe('Payroll API (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(APP_GUARD)
      .useValue({ canActivate: () => true })
      .overrideProvider(ThrottlerGuard)
      .useValue({ canActivate: () => true, onModuleInit: () => {} })
      .compile();

    app = moduleRef.createNestApplication();

    // Igual que en main.ts (buena práctica para que e2e sea real)
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    // Keep error mapping consistent with main.ts
    app.useGlobalFilters(new PrismaExceptionFilter());

    prisma = moduleRef.get(PrismaService);

    await app.init();

    server = app.getHttpServer() as unknown as any;
  });

  beforeEach(async () => {
    // Ensure isolation between tests (real DB)
    await prisma.payrollRun.deleteMany();
    await prisma.contract.deleteMany();
    await prisma.employee.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/payroll/health (GET)', async () => {
    await request(server)
      .get('/payroll/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('/payroll/rules (GET)', async () => {
    await request(server).get('/payroll/rules').expect(200);
  });

  it('/payroll/rules CRUD (POST/PUT/DELETE)', async () => {
    const createRes = await request(server)
      .post('/payroll/rules')
      .send({
        key: `EMPLOYEE_TEST_${Date.now()}`,
        label: 'Test rule',
        contractType: 'EMPLOYEE',
        unit: 'PERCENT',
        value: 5,
      })
      .expect(201);

    const ruleId = createRes.body.id as string;
    expect(ruleId).toBeDefined();

    await request(server)
      .put(`/payroll/rules/${ruleId}`)
      .send({ value: 6, enabled: false })
      .expect(200);

    await request(server).delete(`/payroll/rules/${ruleId}`).expect(200);
  });

  it('/payroll/runs (POST) creates a PayrollRun', async () => {
    // 1) employee
    const emp = await request(server)
      .post('/employees')
      .send({ name: 'Payroll Emp', email: `payroll.${Date.now()}@mail.com` })
      .expect(201);

    const employeeId = emp.body.id as string;

    // 2) contract
    const c = await request(server)
      .post('/contracts')
      .send({ employeeId, contractType: 'EMPLOYEE', baseSalary: 2_500_000 })
      .expect(201);

    const contractId = c.body.id as string;

    // 3) payroll run
    const res = await request(server)
      .post('/payroll/runs')
      .send({ employeeId, contractId, period: '2026-01', bonuses: 200_000 })
      .expect(201);

    const body = res.body as PayrollRunResponse;
    expect(body).toHaveProperty('id');
    expect(body.employeeId).toBe(employeeId);
    expect(body.contractId).toBe(contractId);
    expect(body.period).toBe('2026-01');
    expect(typeof body.gross).toBe('number');
    expect(typeof body.net).toBe('number');
  });

  it('/payroll/runs (GET) returns array', async () => {
    const res = await request(server).get('/payroll/runs').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
