import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Payroll API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => app.close());

  it('/payroll/health (GET)', () => request(app.getHttpServer()).get('/payroll/health').expect(200));

  it('/payroll/rules (GET)', () => request(app.getHttpServer()).get('/payroll/rules').expect(200));

  it('/payroll/calculate (POST)', () =>
    request(app.getHttpServer())
      .post('/payroll/calculate')
      .send({ contractType: 'EMPLOYEE', baseSalary: 2500000, bonuses: 200000, otherDeductions: 0 })
      .expect(201)
      .expect(r => {
        expect(r.body.net).toBeDefined();
        expect(r.body.gross).toBe(2700000);
      }),
  );
});
