import request from 'supertest';
import bootstrap from '../../index.js';
import { describe, it } from '@jest/globals';
let app: any;

beforeAll(async () => {
  app = await bootstrap;
});

describe('SurveyList Controller', () => {
  const surveyListPayload = {
    surveyId: 1,
    userId: 1734938118003,
    privacy: true,
    answers: [{ questionId: 1, answer: 'Yes' }],
    tsStart: new Date().toISOString(),
    tsEnd: new Date(Date.now() + 3600000).toISOString(),
  };
  let surveyId: number;
  it('POST /survey-list - should create a survey list', async () => {
    const res = await request(app).post('/survey-list').send(surveyListPayload);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      surveyId: surveyListPayload.surveyId,
      userId: surveyListPayload.userId,
      privacy: surveyListPayload.privacy,
      answers: surveyListPayload.answers,
      tsStart: expect.any(String),
      tsEnd: expect.any(String),
    });

    surveyId = res.body.id;
  });

  it('POST /survey-list - should fail when required fields are missing', async () => {
    const invalidPayload = { userId: 123 };

    const res = await request(app).post('/survey-list').send(invalidPayload);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty([]);
  });

  it('GET /survey-list - should return all survey lists', async () => {
    const res = await request(app).get('/survey-list');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toMatchObject({
        id: expect.any(Number),
        surveyId: expect.any(Number),
        userId: expect.any(Number),
        privacy: expect.any(Boolean),
        answers: expect.any(Array),
        tsStart: expect.any(String),
        tsEnd: expect.any(String),
      });
    }
  });

  it('GET /survey-list/user/:id?surveyId= - should return one list with user info', async () => {
    const res = await request(app).get(`/survey-list/user/1734938118003?surveyId=${surveyId}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: 1,
      surveyId: expect.any(Number),
      userId: expect.any(Number),
      privacy: expect.any(Boolean),
      answers: expect.any(Array),
      tsStart: expect.any(String),
      tsEnd: expect.any(String),
      userInfo: expect.any(Object),
    });
  });

  it('GET /survey-list/:id - should return 404 for non-existing survey list', async () => {
    const res = await request(app).get('/survey-list/10101010');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty([]);
  });
});
