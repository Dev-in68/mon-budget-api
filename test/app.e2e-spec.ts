import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/budgets (GET) should be protected', () => {
    // tests create the app without the global prefix from main.ts, so call '/budgets'
    return request(app.getHttpServer())
      .get('/budgets?year=2025&month=10')
      .expect(401);
  });
});
