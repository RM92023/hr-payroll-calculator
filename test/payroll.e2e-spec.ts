import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request, { type App } from 'supertest';
import { AppModule } from '../src/app.module';

type PayrollResponse = {
  gross: number;
  net: number;
};

describe('Payroll API (e2e)', () => {
  let app: INestApplication;
  let server: App;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    // Igual que en main.ts (buena práctica para que e2e sea real)
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    await app.init();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    server = app.getHttpServer() as unknown as App;
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

  it('/payroll/calculate (POST)', async () => {
    const res = await request(server)
      .post('/payroll/calculate')
      .send({
        contractType: 'EMPLOYEE',
        baseSalary: 2_500_000,
        bonuses: 200_000,
        otherDeductions: 0,
      })
      .expect(201);

    const body = res.body as PayrollResponse;
    expect(body.gross).toBe(2_700_000);
    expect(typeof body.net).toBe('number');
  });
});
