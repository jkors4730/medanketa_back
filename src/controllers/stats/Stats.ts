import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../../utils/error.js';
import fs from 'fs';
import path from 'path';
import iconv from 'iconv-lite';
import { Survey } from '../../db/models/survey/Survey.js';
import { StatsService } from '../../services/stats.service.js';
import { Service } from 'typedi';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

@Service()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
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
          chart1: await this.statsService.getChart1(id),
          chart2: await this.statsService.getChart2(id),
          chart3: await this.statsService.getChart3(id),
          chart4: await this.statsService.getChart4(id),
          chart5: await this.statsService.getChart5(id),

          finishTime: await this.statsService.getFinishTime(id),
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

        const arr = await this.statsService.getMissedQuestionsBySurvey(id);

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
            chart1: await this.statsService.getChart1(id),
            chart2: await this.statsService.getChart2(id),
            chart3: await this.statsService.getChart3(id),
            chart4: await this.statsService.getChart4(id),
            chart5: await this.statsService.getChart5(id),

            finishTime: await this.statsService.getFinishTime(id),
          };

          const fileContent =
            `Статистика анкеты ${survey.title}
/questionary/${survey.id}
Средний процент завершения анкеты;${stats.chart1}%
Средний процент откликов;${stats.chart2}%
Средний процент отказов;${stats.chart3}%
Средний процент успешного завершения анкет;${stats.chart4}%
Среднее время прохождения анкет;${this.statsService.getTime(stats.finishTime)}
Средний процент пропущенных вопросов;${stats.chart5}%\n` +
            `Статистика вопросов:\n ${await this.statsService.formatToCsvData(questions)}`;
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
