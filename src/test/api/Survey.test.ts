import request from 'supertest';
import bootstrap from '../../index.js';
import { describe, it } from '@jest/globals';
let app: any;

beforeAll(async () => {
  app = await bootstrap;
});

describe('Survey Controller', () => {
  let surveyId: any;
  const testSurvey = {
    userId: 1,
    image: 'test.jpg',
    title: 'Test Survey',
    slug: 'test-survey',
    status: true,
    access: true,
    description: 'Test description',
    questions: [{ question: 'Test Question?', type: 'text', status: true }],
  };

  it('POST /survey - should create a survey', async () => {
    const response = await request(app).post('/survey').send(testSurvey);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    surveyId = response.body.id;
  });

  it('GET /survey - should return all surveys', async () => {
    const response = await request(app).get('/survey');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('GET /survey/:id - should return one survey by id', async () => {
    const response = await request(app).get(`/survey/1`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(surveyId);
  });

  it('GET /survey/getOne/:id - should return surveys by userId', async () => {
    const response = await request(app).get(`/survey/getOne/1`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /survey/users/:id - should return users who answered the survey', async () => {
    const response = await request(app).get(`/survey/users/${surveyId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('PUT /survey/:id - should update survey', async () => {
    const updatedData = { title: 'Updated Survey' };
    const response = await request(app)
      .put(`/survey/1`)
      .send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedData.title);
  });

  it('DELETE /survey/:id - should delete survey', async () => {
    const response = await request(app).delete(`/survey/1`);
    expect(response.status).toBe(204);
  });

  it('POST /survey/draft/:id - should generate draft from survey', async () => {
    const response = await request(app).post(`/survey/${surveyId}/draft`);
    expect(response.status).toBe(200);
    expect(response.body.isDraft).toBe(true);
  });
  //TODO change draftResponse on get
  it('POST /survey/draft - should generate survey from draft', async () => {
    const draftResponse = await request(app).post(`/survey/${surveyId}`);
    const response = await request(app)
      .post(`/survey/draft`)
      .send({ surveyId: draftResponse.body.id });
    expect(response.status).toBe(200);
    expect(response.body.isDraft).toBe(false);
  });

  it('GET /survey/draft - should return all drafts', async () => {
    const response = await request(app).get('/survey/draft');
    expect(response.status).toBe(200);
    // expect(Array.isArray(response.body.data)).toBe(true);
  });
});
