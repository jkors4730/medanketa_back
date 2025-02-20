/* eslint-disable @typescript-eslint/no-explicit-any */
import sequelize from '../db/config.js';
import { QueryTypes } from 'sequelize';
import type {
  StatsAMapped,
  StatsAnswer,
  StatsDMapped,
  StatsQuestion,
} from '../controllers/Stats.js';

export class StatsService {
  async getQuestions(id: string) {
    // получаем вопросы
    const questions = await sequelize.query<StatsQuestion>(
      `--sql
                SELECT id,
                    question,
                    type,
                    "surveyId",
                    data
                FROM survey_questions
                WHERE "surveyId" = :id`,
      {
        replacements: { id: id },
        type: QueryTypes.SELECT,
      },
    );
    // получаем ответы
    const answers = await sequelize.query<StatsAnswer>(
      `--sql
                SELECT id,
                    sq_id,
                    "userId",
                    answer,
                    (SELECT COUNT(*) as count
                    FROM survey_answers
                    WHERE sq_id = sa.sq_id
                        AND answer = sa.answer
                        AND "userId" = sa."userId"
                        AND "surveyId" = :id)::numeric
                FROM survey_answers sa
                WHERE "surveyId" = :id`,
      {
        replacements: { id: id },
        type: QueryTypes.SELECT,
      },
    );

    const mappedQS = new Map<number, any>();

    for (const q of questions) {
      const qData = [] as StatsDMapped[];
      // парсим варианты ответов из вопроса
      if (q.data) {
        const data = JSON.parse(q.data);

        if (data.answers && Array.isArray(data.answers)) {
          for (const item of data.answers) {
            qData.push({ ...item, id: q.id } as any);
          }
        }
      }
      // мапим вопросы по id (для дальнейшей работы с ответами)
      mappedQS.set(Number(q.id), {
        id: q.id,
        question: q.question,
        type: q.type,
        data: qData,
        answers: new Map<string, any>(),
      } as any);
    }

    for (const a of answers) {
      const base = mappedQS.get(Number(a.sq_id));

      // проверяем наличие вопрос в мапе
      if (base) {
        const key = a.answer || '';
        // проверяем наличие ответа в мапе
        const baseA = base.answers.has(key) ? base.answers.get(key) : null;

        base.answers.set(key, {
          id: a.sq_id,
          answer: a.answer,
          // счётчик либо суммируется, либо ставится в первый раз
          count: baseA
            ? Number(baseA.count) + Number(a.count)
            : Number(a.count),
        } as StatsAMapped);

        mappedQS.set(Number(a.sq_id), base);
      }
    }

    // перегоняем мапы в сериализуемый массив для отправки через res.json()
    const resArr = [];
    const arr = Array.from(mappedQS.values());

    for (const item of arr) {
      resArr.push({
        ...item,
        answers: Array.from(item.answers.values()),
      });
    }
    return resArr;
  }
}
