import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Contracts API (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let employeeId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
