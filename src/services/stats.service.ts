import sequelize from '../db/config.js';
import { QueryTypes } from 'sequelize';
import {
  StatsAMapped,
  StatsAnswer,
  StatsDMapped,
  StatsQAMapped,
  StatsQBMapped,
  StatsQuestion,
} from '../controllers/stats/interface.js';
import { Service } from 'typedi';
import { returnFromArr, returnNumFromArr } from '../utils/common.js';
import { Time } from '../controllers/stats/interface.js';
@Service()
export class StatsService {
  //#region Functions
  async getChart1(id: string) {
    return returnNumFromArr(
      await sequelize.query<any>(
        `--sql
            SELECT DISTINCT
                ROUND( AVG( (
                    ( SELECT COUNT(sl_id)::float
                    FROM survey_answers
                    WHERE "isSkip" = false
                        AND "userId" = sl."userId"
                        AND "surveyId" = :id ) /
                    (
                        ( SELECT COUNT(*)::float FROM survey_questions WHERE "surveyId" = :id) *
                        ( SELECT COUNT(DISTINCT sl_id)::float FROM survey_answers WHERE "isSkip" = false
                            AND "userId" = sl."userId"
                            AND "surveyId" = :id)
                        )::float) * 100)::numeric, 2) as complete
            FROM survey_answers sa
                    JOIN survey_lists sl
                        ON sa.sl_id = sl.id
                    LEFT JOIN users u
                            ON sl."userId" = u.id
            WHERE sl."surveyId" = :id`,
        {
          replacements: { id: id },
          type: QueryTypes.SELECT,
        },
      ),
      'complete',
    );
  }

  async getChart2(id: string) {
    return returnNumFromArr(
      await sequelize.query<any>(
        `--sql
            -- кол-во уникальных юзеров, которые ответили на вопросы
            SELECT ROUND( ( ( SELECT COUNT(DISTINCT "userId")
            FROM survey_answers
            WHERE "isSkip" = false
                AND "surveyId" = :id )::float
            /
            -- кол-во уникальных юзеров, которые открыли анкету
            ( SELECT COUNT(DISTINCT "userId")
            FROM survey_lists
            WHERE "tsStart" IS NOT NULL
            AND "surveyId" = :id )::float * 100)::numeric, 2) as response_rate`,
        {
          replacements: { id: id },
          type: QueryTypes.SELECT,
        },
      ),
      'response_rate',
    );
  }

  async getChart3(id: string) {
    return returnNumFromArr(
      await sequelize.query<any>(
        `--sql
            -- кол-во уникальных юзеров, которые открыли анкету,
            -- но не ответили ни на один вопрос
            SELECT ROUND( ( ( SELECT COUNT(DISTINCT "userId")
            FROM survey_lists
            WHERE "tsStart" IS NOT NULL
            AND "tsEnd" IS NULL
            AND json_array_length(answers) = 0
            AND "surveyId" = :id )::float
            /
            -- кол-во уникальных юзеров, которые открыли анкету
            ( SELECT COUNT(DISTINCT "userId")
            FROM survey_lists
            WHERE "tsStart" IS NOT NULL
                AND "surveyId" = :id )::float * 100)::numeric, 2) as cancel_rate`,
        {
          replacements: { id: id },
          type: QueryTypes.SELECT,
        },
      ),
      'cancel_rate',
    );
  }

  async getChart4(id: string) {
    return returnNumFromArr(
      await sequelize.query<any>(
        `--sql
            -- кол-во уникальных юзеров, которые ответили на все вопросы
            SELECT ROUND( ( ( SELECT COUNT(DISTINCT "userId")
            FROM survey_answers
            WHERE "isSkip" = false
                AND "surveyId" = :id
            GROUP BY "userId"
            HAVING COUNT(*) = (SELECT COUNT(*) FROM survey_questions WHERE "surveyId" = :id) LIMIT 1 )::float
                /
            -- кол-во уникальных юзеров, которые завершили анкету
            ( SELECT COUNT(DISTINCT "userId")
            FROM survey_lists
            WHERE "tsEnd" IS NOT NULL
                AND "surveyId" = :id )::float * 100)::numeric, 2) as all_answers`,
        {
          replacements: { id: id },
          type: QueryTypes.SELECT,
        },
      ),
      'all_answers',
    );
  }

  async getChart5(id: string) {
    return returnNumFromArr(
      await sequelize.query<any>(
        `--sql
            SELECT DISTINCT
            100 - ROUND( AVG( (
            ( SELECT COUNT(sl_id)::float
                FROM survey_answers
                WHERE "isSkip" = false
                AND "userId" = sl."userId"
                AND "surveyId" = :id ) /
            (
            ( SELECT COUNT(*)::float FROM survey_questions WHERE "surveyId" = :id) *
            ( SELECT COUNT(DISTINCT sl_id)::float FROM survey_answers WHERE "isSkip" = false
                AND "userId" = sl."userId"
                AND "surveyId" = :id)
            )::float) * 100)::numeric, 2) as missed_rate
            FROM survey_answers sa
                    JOIN survey_lists sl
                        ON sa.sl_id = sl.id
                    LEFT JOIN users u
                            ON sl."userId" = u.id
            WHERE sl."surveyId" = :id`,
        {
          replacements: { id: id },
          type: QueryTypes.SELECT,
        },
      ),
      'missed_rate',
    );
  }

  async getFinishTime(id: string) {
    return returnFromArr(
      await sequelize.query<any>(
        `--sql
        SELECT AVG("tsEnd" - "tsStart") as finish_time
        FROM survey_lists
        WHERE "surveyId" = :id`,
        {
          replacements: { id: id },
          type: QueryTypes.SELECT,
        },
      ),
      'finish_time',
    );
  }

  async getTime(time: Time): Promise<string> {
    let str = '';

    if (time.seconds) {
      if (time.seconds) {
        str = `${time.seconds} сек`;
      }
      if (time.minutes) {
        str = `${time.minutes} мин ${str}`;
      }
      if (time.hours) {
        str = `${time.hours} час ${str}`;
      }
    } else {
      str = 'мало данных';
    }

    return str;
  }
  //#endregion
  async getMissedQuestionsBySurvey(id: string) {
    return sequelize.query<any>(
      `--sql
                    SELECT DISTINCT sq.id,
                    sq.question,
                    ROUND( ( ( COUNT(sa."userId")::float /
                    (SELECT COUNT(*) FROM survey_questions WHERE "surveyId" = :id)::float ) * 100)::numeric, 2 )::float as missed_rate
                FROM survey_answers sa
                JOIN survey_questions sq
                ON sa.sq_id = sq.id
                WHERE
                    sa."isSkip" = true
                    AND sa."surveyId" = :id
                    GROUP BY sq.id
                    ORDER BY missed_rate DESC`,
      {
        replacements: { id: id },
        type: QueryTypes.SELECT,
      },
    );
  }
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

    const mappedQS = new Map<number, StatsQAMapped>();

    for (const q of questions) {
      const qData = [] as StatsDMapped[];
      // парсим варианты ответов из вопроса
      if (q.data) {
        const data = JSON.parse(q.data);

        if (data.answers && Array.isArray(data.answers)) {
          for (const item of data.answers) {
            qData.push({ ...item, id: q.id } as StatsDMapped);
          }
        }
      }
      // мапим вопросы по id (для дальнейшей работы с ответами)
      mappedQS.set(Number(q.id), {
        id: q.id,
        question: q.question,
        type: q.type,
        data: qData,
        answers: new Map<string, StatsAMapped>(),
      } as StatsQAMapped);
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
  async formatToCsvData(questions: StatsQBMapped[]) {
    return questions
      .map((question) => {
        const sumAnsw = question.data.reduce((sum, ans) => sum + ans.sortId, 0);
        return (
          `вопрос №${question.id}: ${question.question}\n` +
          question.data
            .map((questionAnswer) => {
              const percente =
                sumAnsw > 0
                  ? ((questionAnswer.sortId / sumAnsw) * 100).toFixed(0)
                  : 0;
              return `ответ: ${questionAnswer.value} (${questionAnswer.sortId} ${this.declOfNum(questionAnswer.sortId, ['ответ', 'ответа', 'ответов'])}) ${percente}%`;
            })
            .join('\n')
        );
      })
      .join('\n\n');
  }
  async declOfNum(number: number | undefined, titles: any) {
    if (number != undefined) {
      const cases = [2, 0, 1, 1, 1, 2];
      return titles[
        number % 100 > 4 && number % 100 < 20
          ? 2
          : cases[number % 10 < 5 ? number % 10 : 5]
      ];
    }
    return '';
  }
}
