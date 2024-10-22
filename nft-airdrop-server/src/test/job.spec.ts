import request from 'supertest';
import { app } from '../app';
import { connect, clearDatabase, closeDatabase } from '../config/db'; // 导入 connect 函数

describe('JobController', () => {
  beforeAll(async () => {
    await connect();
  });
  afterAll(async () => {
    await clearDatabase();
  });

  // 删除所有的 airdrop
  it('should clear airdrop', async () => {
    const response = await request(app)
      .delete('/api/v1/job/airdrop')
      .expect(200);
    expect(response.body.code).toBe(0);
    expect(response.body.data).toBeDefined();
  });

  it('should mock airdrop', async () => {
    const response = await request(app)
      .get('/api/v1/job/airdrop/mock')
      .expect(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.pending).toBeGreaterThan(0);
    expect(response.body.data.failed).toBeGreaterThan(0);
    expect(response.body.data.pending + response.body.data.failed).toBe(100);
  });

  it('get airdrop failed list', async () => {
    const response = await request(app)
      .get('/api/v1/job/airdrop/failed/list')
      .expect(200);
    console.log('response.body.data', response.body.data.length);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBeLessThan(100);
  });

  it('check airdrop receipt', async () => {
    const response = await request(app)
      .get('/api/v1/job/airdrop/check')
      .expect(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveProperty('success');
    expect(response.body.data).toHaveProperty('failed');
    expect(response.body.data.success).toBeGreaterThan(0);
  });

  it('retry airdrop', async () => {
    const response = await request(app)
      .get('/api/v1/job/airdrop/retry')
      .expect(200);
    expect(response.body.data).toHaveProperty('pending');
    expect(response.body.data).toHaveProperty('failed');
    expect(response.body.data.pending).toBeGreaterThan(0);
    expect(response.body.data.pending + response.body.data.failed).toBeLessThan(
      100
    );
  });
});
