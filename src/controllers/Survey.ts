/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Request, Response } from 'express';
import { returnError } from '../utils/error.js';
import { validationResult } from 'express-validator';
import { Survey } from '../db/models/Survey.js';
import sequelize from '../db/config.js';
import { SurveyQuestion } from '../db/models/SurveyQuestion.js';
import { QueryTypes } from 'sequelize';
import { pagination, saveSurveyData } from '../utils/common.js';

import { SurveyService } from '../services/survey.service.js';
import { autoInjectable, container, injectable, registry } from 'tsyringe';
import { Inject } from 'typedi';

export class SurveyController {
  /**
   * Создать анкету
   *
   * @body {number} userId
   * @body {string} image
   * @body {string} title
   * @body {string} slug
   * @body {boolean} status
   * @body {boolean} access
   * @body {string} description
   * @body {string} expireDate
   * @body {JSON} questions
   *
   * @throws {Error} e
   */
  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const {
          userId,
          image,
          title,
          slug,
          status,
          access,
          description,
          expireDat,
          questions,
        } = req.body;

        const survey = await SurveyService.createSurvey(req.body);

        if (Array.isArray(questions)) {
          const bindSurveyQ =
            await SurveyService.validateAndGenerateQuestionsData(
              survey,
              questions,
            );
          if (!bindSurveyQ) {
            returnError(null, res, [
              'You must provide required fields `question`, `type`, `status` to create SurveyQuestion',
            ]);
          }
          survey.dataValues.questions = bindSurveyQ;
        }
        res.status(201).json(survey.toJSON());
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  /**
   * Получить список анкет
   *
   * /survey?userId=:id
   *
   * @query {number} userId
   *
   * @throws {Error} e
   */
  async getAll(req: Request, res: Response) {
    try {
      const { userId } = req.query;
      const { page, size } = req.query;

      const mPage = page ? Number(page) : 1;
      const mSize = size ? Number(size) : 20;

      const surveys = userId
        ? await sequelize.query(
            `--sql
            SELECT
                surveys.*,
                CONCAT(users.name, ' ', users."lastName") as "userName",
                users.email as "userEmail"
            FROM surveys
                    LEFT JOIN users ON surveys."userId" = users.id
            WHERE surveys."userId" = :userId AND surveys."isDraft" = false
            ORDER BY surveys.id DESC
            OFFSET :offset
            LIMIT :limit`,
            {
              replacements: {
                userId: userId,
                offset: mPage > 1 ? mSize * (Number(page) - 1) : 0,
                limit: mSize,
              },
              type: QueryTypes.SELECT,
              model: Survey,
              mapToModel: true,
            },
          )
        : await sequelize.query(
            `--sql
            SELECT
                surveys.*,
                CONCAT(users.name, ' ', users."lastName") as "userName",
                users.email as "userEmail"
            FROM surveys
                    LEFT JOIN users ON surveys."userId" = users.id
            WHERE surveys."isDraft" = false
            ORDER BY surveys.id DESC
            OFFSET :offset
            LIMIT :limit`,
            {
              replacements: {
                offset: mPage > 1 ? mSize * (Number(page) - 1) : 0,
                limit: mSize,
              },
              type: QueryTypes.SELECT,
              model: Survey,
              mapToModel: true,
            },
          );

      const dataCount = userId
        ? await sequelize.query<any>(
            `--sql
            SELECT COUNT(*) as count
            FROM surveys
                LEFT JOIN users ON surveys."userId" = users.id
            WHERE surveys."userId" = :userId AND surveys."isDraft" = false`,
            {
              replacements: { userId: userId },
              type: QueryTypes.SELECT,
            },
          )
        : await sequelize.query<any>(
            `--sql
            SELECT COUNT(*) as count
            FROM surveys
            WHERE surveys."isDraft" = false`,
            { type: QueryTypes.SELECT },
          );

      res.status(200).json(pagination(surveys, mPage, dataCount[0].count));
    } catch (e: any) {
      returnError(e, res);
    }
  }

  /**
   * Получить одну анкету
   *
   * @query {number} id surveyId
   * @throws {Error} e
   */
  async getOne(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const id = parseInt(req.params.id);

        const survey = await sequelize.query(
          `--sql
                SELECT
                    surveys.*,
                    users.id as "authorId",
                    CONCAT(users.name, ' ', users."lastName") as "authorName"
                FROM surveys
                        LEFT JOIN users ON surveys."userId" = users.id
                WHERE surveys.id = :id`,
          {
            replacements: { id: id },
            type: QueryTypes.SELECT,
            model: Survey,
            mapToModel: true,
          },
        );

        if (survey === null || !Array.isArray(survey) || !survey.length) {
          returnError(null, res, [`Survey with id = ${id} not found`]);
        } else {
          res.status(200).json(survey[0]);
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  /**
   * Получить список анкет пользователя (завершённых)
   *
   * @param {number} id surveyId
   * @throws {Error} e
   */
  async getByUserId(req: Request, res: Response) {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const { id } = req.params;

      const surveys = await sequelize.query(
        `--sql
            SELECT surveys.*,
                users.id as "authorId",
                CONCAT(users.name, ' ', users."lastName") as "authorName"
            FROM surveys
                    JOIN survey_lists ON surveys."id" = survey_lists."surveyId"
                    LEFT JOIN users ON surveys."userId" = users.id
            WHERE surveys.status = true
                AND survey_lists."userId" = :userId`,
        {
          replacements: { userId: id },
          type: QueryTypes.SELECT,
          model: Survey,
          mapToModel: true,
        },
      );

      res.json(surveys);
    } else {
      returnError(null, res, errors.array());
    }
  }

  /**
   * Получить список пользователей ответивших на анкету
   *
   * @param {number} id surveyId
   * @throws {Error} e
   */
  async getUsersBySurveyId(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const data = await sequelize.query<any>(
        `--sql
            SELECT DISTINCT
            sl."userId" as "userId",
            u.name as "userName",
            u."lastName" as "userLastName",
            TO_CHAR(sl."tsEnd", 'DD.MM.YYYY') as "dateEnd",
            (sl."tsEnd" - sl."tsStart") as time,
            sl."tsStart",
            sl."tsEnd",
            ROUND( ( (
                ( SELECT COUNT(sl_id)::float
                        FROM survey_answers
                        WHERE "isSkip" = false
                        AND "userId" = sl."userId"
                        AND "surveyId" = :id ) /
                (
                    ( SELECT COUNT(*)::float FROM survey_questions WHERE "surveyId" = :id) *
                    ( SELECT COUNT(DISTINCT sl_id)::float FROM survey_answers
                        WHERE "isSkip" = false
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
      );

      res.status(200).json(data);
    } catch (e: any) {
      returnError(e, res);
    }
  }

  /**
   * Обновить анкету
   *
   * @param {number} id surveyId
   *
   * @body {number} userId
   * @body {string} image
   * @body {string} title
   * @body {string} slug
   * @body {boolean} status
   * @body {boolean} access
   * @body {string} description
   * @body {string} expireDate
   * @throws {Error} e
   */
  async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { id } = req.params;
        const {
          userId,
          image,
          title,
          slug,
          status,
          access,
          description,
          expireDate,
        } = req.body;

        const survey = await Survey.findByPk<any>(parseInt(id));

        if (survey === null) {
          returnError(null, res, [`Survey with id = ${id} not found`]);
        } else {
          survey.userId = typeof userId == 'number' ? userId : survey.userId;
          survey.image = typeof image == 'string' ? image : survey.image;
          survey.title = typeof title == 'string' ? title : survey.title;
          survey.slug = typeof slug == 'string' ? slug : survey.slug;
          survey.status = typeof status == 'boolean' ? status : survey.status;
          survey.access = typeof access == 'boolean' ? access : survey.access;
          survey.description =
            typeof description == 'string' ? description : survey.description;
          survey.expireDate =
            typeof expireDate == 'string' ? expireDate : survey.expireDate;

          await survey.save();

          res.status(200).json(survey.toJSON());
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  /**
   * Удалить анкету
   *
   * @param {number} id surveyId
   *
   * @throws {Error} e
   */
  async delete(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { id } = req.params;

        const survey = await Survey.findByPk(parseInt(id));

        if (survey === null) {
          returnError(null, res, [`Survey with id = ${id} not found`]);
        } else {
          // удалить связанные вопросы
          const sq_id_arr = await sequelize.query<any>(
            `--sql
                    DELETE FROM survey_questions WHERE "surveyId" = :id RETURNING id`,
            {
              replacements: { id: id },
              type: QueryTypes.SELECT,
            },
          );

          // удалить данные связанные с вопросами
          for (const item of sq_id_arr) {
            await sequelize.query(
              `--sql
                        DELETE FROM survey_data WHERE sq_id = :id`,
              {
                replacements: { id: item.id },
                type: QueryTypes.DELETE,
              },
            );
          }

          // удалить ответы на вопросы
          await sequelize.query(
            `--sql
                    DELETE FROM survey_lists WHERE "surveyId" = :id`,
            {
              replacements: { id: id },
              type: QueryTypes.DELETE,
            },
          );

          await survey.destroy();

          res.status(204).send();
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  /** Генерация черновика анкеты
   *
   * @param {number} id: surveyID
   * @throws {Error} e
   */
  async generateDraftAnket(req: Request, res: Response) {
    const id = Number(req.params.id);
    const draft = await SurveyService.cloneSurvey(id);
    res.json(draft).status(200);
  }

  /** Получение "Чистовика" из черновика анкеты
   *
   * @param {number} id: surveyID
   * @throws {Error} e
   */
  async generateFromDraft(req: Request, res: Response) {
    const { userId } = req.body;
    const clone = await SurveyService.createFromDraft(Number(userId));
    res.json(clone).status(200);
  }

  /** Получение всех черновиков пользователся с пагинацией
   *
   * @body {number} id: surveyId
   * @throws {Error} e
   */
  async getAllDrafts(req: Request, res: Response) {
    const { userId, page, size } = req.query;
    const allDrafts = await SurveyService.getAllDrafts(page, size, userId);
    res
      .json(pagination(allDrafts.surveys, allDrafts.mPage, allDrafts.dataCount))
      .status(200);
  }
}
