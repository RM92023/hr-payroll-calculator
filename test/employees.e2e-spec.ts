import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Employees API (e2e)', () => {
  let app: INestApplication;
  let server: any;

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
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /employees -> 201', async () => {
    const res = await request(server)
      .post('/employees')
      .send({ name: 'Ada Lovelace', email: `ada.${Date.now()}@mail.com` })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email');
  });

  it('GET /employees -> 200', async () => {
    const res = await request(server).get('/employees').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /employees invalid email -> 400', async () => {
    await request(server)
      .post('/employees')
      .send({ name: 'X', email: 'no-email' })
      .expect(400);
  });
});
