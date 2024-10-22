import request from 'supertest';
import { app } from '../app';

describe('checkHealth', () => {
  it('should return a success response with Hello World', async () => {
    const response = await request(app).get('/api/v1/health').expect(200);
    expect(response.body.data).toBe('Hello World!');
  });
});
