import bootstrap from '../../index.js';
import request from 'supertest';
import { describe, it } from '@jest/globals';
let app: any;

beforeAll(async () => {
  app = await bootstrap;
});

describe(`SurveyQuestion Controller`, () => {
  const surveyQuestionPayload = {
    surveyId: 1,
    question: 'How satisfied are you with our service?',
    type: 'multiple-choice',
    status: true,
    description: 'Customer satisfaction survey',
    data: JSON.stringify({ extraInfo: 'some data' }),
    sortId: 1,
  };
  it(`POST should create survey_question[]`, async () => {
    const res = await request(app)
      .post('/survey-question')
      .send(surveyQuestionPayload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      surveyId: surveyQuestionPayload.surveyId,
      question: surveyQuestionPayload.question,
      type: surveyQuestionPayload.type,
      status: surveyQuestionPayload.status,
      description: surveyQuestionPayload.description,
      data: surveyQuestionPayload.data,
      sortId: surveyQuestionPayload.sortId,
    });
    it(`GET should return all surveyQuestion`, async () => {
      const res = await request(app).get('/survey-question');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        expect(res.body[0]).toMatchObject({
          id: expect.any(Number),
          surveyId: expect.any(Number),
          question: expect.any(String),
          type: expect.any(String),
          status: expect.any(Boolean),
          description: expect.any(String),
          data: expect.any(String),
          sortId: expect.any(Number),
        });
      }
    });
  });
});
