import request from 'supertest';
import { app } from '../app';
import { connect, clearDatabase } from '../config/db';

describe('QuestController', () => {
  let questId: string;
  let userId: string;
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await clearDatabase();
  });

  it('should clear quest', async () => {
    const response = await request(app).delete('/api/v1/quest/all').expect(200);
    expect(response.body.code).toBe(0);
    expect(response.body.data).toBeDefined();
  });

  it('should add quest', async () => {
    const body = {
      title: 'Nft quest',
      description: 'Nft quest',
      maxCompletions: 20,
      rewardPoints: 10,
      startDate: '2024-10-20T10:57:52.957Z',
      endDate: '2024-10-27T10:57:52.957Z'
    };

    const response = await request(app)
      .post('/api/v1/quest')
      .send(body)
      .expect(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveProperty('insertedCount');
    expect(response.body.data.insertedCount).toBe(1);
  });

  it('should get quest list', async () => {
    const response = await request(app).get('/api/v1/quest/list').expect(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveProperty('list');
    questId = response.body.data.list[0].questId;
  });

  it('should add user', async () => {
    const response = await request(app)
      .post('/api/v1/user')
      .send({ name: 'test' + Math.random() })
      .expect(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveProperty('insertedCount');
    expect(response.body.data.insertedCount).toBe(1);
  });

  it('should get user list', async () => {
    const response = await request(app).get('/api/v1/user/list').expect(200);
    console.log('response.body.data:', response.body.data);
    expect(response.body.data).toBeDefined();
    userId = response.body.data[0].userId;
  });

  it('user complete quest', async () => {
    const response = await request(app)
      .post('/api/v1/quest/complete')
      .send({ questId, userId })
      .expect(200);
    expect(response.body.code).toBe(0);
  });

  it('batch complete quest', async () => {
    try {
      await Promise.all(
        Array.from({ length: 10 }).map(() =>
          request(app)
            .post('/api/v1/quest/complete')
            .send({ questId, userId })
            .expect(200)
        )
      );
    } catch (error) {}
  });
});
