/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../utils/error.js';
import { QueryTypes } from 'sequelize';
import sequelize from '../db/config.js';
import { returnFromArr, returnNumFromArr } from '../utils/common.js';
import fs from 'fs';
import path from 'path';
import iconv from 'iconv-lite';
import { Survey } from '../db/models/survey/Survey.js';
import { StatsService } from '../services/stats.service.js';
import { Service } from 'typedi';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//#region Interfaces
export interface StatsQuestion {
  id?: number;
  question?: string;
  type?: string;
  surveyId?: number;
  data?: string;
}

export interface StatsAnswer {
  id?: number;
  sq_id?: number;
  user_id?: string;
  answer?: string;
  count?: number;
}

export interface StatsDMapped {
  id?: number;
  value?: string;
  sortId?: number;
}

export interface StatsAMapped {
  id?: number;
  answer?: string;
  count?: number;
}

export interface StatsQAMapped {
  answers: StatsAMapped[];
  id?: number;
  question?: string;
  type?: string;
  data: StatsDMapped[];
}

export interface Time {
  seconds?: number;
  minutes?: number;
  hours?: number;
}
//#endregion

//#region Functions
async function getChart1(id: any) {
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

async function getChart2(id: any) {
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

async function getChart3(id: any) {
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

async function getChart4(id: any) {
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

async function getChart5(id: any) {
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

export async function getFinishTime(id: any) {
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

function getTime(time: Time): string {
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
@Service()
export class StatsController {
  /**
   * Получить статистику для чартов
   *
   * @param {number} id surveyId
   * @throws {Error} e
   */
  async getBySurvey(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { id } = req.params;

        res.status(200).json({
          chart1: await getChart1(id),
          chart2: await getChart2(id),
          chart3: await getChart3(id),
          chart4: await getChart4(id),
          chart5: await getChart5(id),
          finishTime: await getFinishTime(id),
        });
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  /**
   * Получить статистику по пропущенным вопросам
   *
   * @param {number} id surveyId
   * @throws {Error} e
   */
  async getMissedQuestionsBySurvey(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { id } = req.params;

        const arr = await sequelize.query<any>(
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

        res.status(200).json(arr);
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  /**
   * Получить статистику ответов на вопросы
   *
   * @param {number} id surveyId
   * @throws {Error} e
   */
  async getQuestionsBySurvey(req: Request, res: Response) {
    const statsService = new StatsService();
    try {
      const errors = validationResult(req);
      const { id } = req.params;
      if (errors.isEmpty()) {
        const resArr = await statsService.getQuestions(id);
        res.status(200).json(resArr);
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  /**
   * Получить статистику в CSV
   *
   * @param {number} id surveyId
   * @throws {Error} e
   */
  async getCsvBySurvey(req: Request, res: Response) {
    const statsService = new StatsService();
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { id } = req.params;
        const { win } = req.query;

        const survey = await Survey.findByPk<any>(id);
        const questions = await statsService.getQuestions(id);

        if (survey) {
          const filesDir = path.join(__dirname, '../assets/files');
          const filePath = `${filesDir}/${Date.now()}.csv`;
          fs.mkdirSync(filesDir, { recursive: true });

          const stats = {
            chart1: await getChart1(id),
            chart2: await getChart2(id),
            chart3: await getChart3(id),
            chart4: await getChart4(id),
            chart5: await getChart5(id),

            finishTime: await getFinishTime(id),
          };

          const fileContent =
            `Статистика анкеты ${survey.title}
/questionary/${survey.id}
Средний процент завершения анкеты;${stats.chart1}%
Средний процент откликов;${stats.chart2}%
Средний процент отказов;${stats.chart3}%
Средний процент успешного завершения анкет;${stats.chart4}%
Среднее время прохождения анкет;${getTime(stats.finishTime)}
Средний процент пропущенных вопросов;${stats.chart5}%\n` +
            `Статистика вопросов:\n ${formatToCsvData(questions)}`;
          const isWin = win === 'true';
          fs.writeFileSync(
            filePath,
            iconv.encode(fileContent, isWin ? 'win1251' : 'utf8'),
          );

          res.download(filePath);
        } else {
          returnError(null, res, [`Survey with id = ${id} not found`]);
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }
}
function formatToCsvData(questions: StatsQAMapped[]) {
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
            return `ответ: ${questionAnswer.value} (${questionAnswer.sortId} ${declOfNum(questionAnswer.sortId, ['ответ', 'ответа', 'ответов'])}) ${percente}%`;
          })
          .join('\n')
      );
    })
    .join('\n\n');
}
function declOfNum(number: number | undefined, titles: any) {
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

export const statsController = new StatsController();
