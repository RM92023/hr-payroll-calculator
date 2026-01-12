/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
import { Test } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import MockPrismaService from '../src/prisma/mock-prisma.service';

describe('Contracts API (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let employeeId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useClass(MockPrismaService)
      .overrideProvider(APP_GUARD)
      .useValue({ canActivate: () => true })
      .overrideProvider(ThrottlerGuard)
      .useValue({ canActivate: () => true, onModuleInit: () => {} })
      .compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    const mock = moduleRef.get(PrismaService);
    if (mock && typeof mock.reset === 'function') mock.reset();

    await app.init();

    server = app.getHttpServer() as unknown as any;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/contracts (GET) returns array', async () => {
    await request(server).get('/contracts').expect(200);
  });

  it('/contracts (POST) validation and creation', async () => {
    // Crear un employee real para respetar la FK
    const emp = await request(server)
      .post('/employees')
      .send({ name: 'Test Emp', email: `emp.${Date.now()}@mail.com` })
      .expect(201);

    employeeId = emp.body.id as string;

    const payload = {
      employeeId,
      contractType: 'EMPLOYEE',
      baseSalary: 1000000,
    };

    const res = await request(server)
      .post('/contracts')
      .send(payload)
      .expect(201);
    expect(res.body).toBeDefined();
    expect(res.body.employeeId).toBe(payload.employeeId);
  });
});
