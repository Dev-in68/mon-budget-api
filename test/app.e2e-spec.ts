import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/budgets (GET) should be protected', () => {
    return request(app.getHttpServer())
      .get('/budgets?year=2025&month=10')
      .expect(401);
  });

  it('registers and logins a user, then lists budgets (protected)', async () => {
    const email = `test${Date.now()}@demo.dev`;
    const password = 'Password123!';
    // Register
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, name: 'Test', password })
      .expect(201);

    // Login
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(201);

    expect(loginRes.body.access).toBeDefined();
    const token = loginRes.body.access;

    // List budgets (should be empty)
    await request(app.getHttpServer())
      .get('/budgets?year=2025&month=10')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
