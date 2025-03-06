import request from 'supertest';
import bootstrap from '../../index.js';
import { User } from '../../db/models/User.js';
import { describe, it } from '@jest/globals';
let app: any;

beforeAll(async () => {
  app = await bootstrap;
});

describe('User Controller', () => {
  it('POST /user - should create a new user', async () => {
    const userData = {
      name: 'Test',
      lastName: 'Test',
      email: 'test@example.com',
      password: 'password123',
      roleName: 'interviewer',
    };

    const res = await request(app).post('/user').send(userData);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      name: 'Test',
      lastName: 'Test',
      email: 'test@example.com',
    });
  });

  it('GET /user - should return all users', async () => {
    const res = await request(app).get('/user');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /user/:id - should return a single user', async () => {
    const userId = 1;
    const res = await request(app).get(`/user/${userId}`);

    expect(res.status).toBe(204);
    expect(res.body).toMatchObject(User);
  });

  it('PUT /user/:id - should update a user', async () => {
    const userId = 1;
    const updatedData = { name: 'Updated Name' };

    const res = await request(app).put(`/user/${userId}`).send(updatedData);

    expect(res.status).toBe(204);
    expect(res.body).toMatchObject(User);
  });

  it('DELETE /user/:id - should delete a user', async () => {
    const userId = 1;
    const res = await request(app).delete(`/user/${userId}`);

    expect(res.status).toBe(204);
  });
});
