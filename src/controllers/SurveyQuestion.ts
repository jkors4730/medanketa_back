/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../utils/error.js';
import { SurveyQuestion } from '../db/models/SurveyQuestion.js';
import { saveSurveyData } from '../utils/common.js';
import { Service } from 'typedi';
import { SurveyQuestionService } from '../services/survey-question.service.js';
@Service()
export class SurveyQuestionController {
  /**
   * Создать вопрос
   *
   * * @route {path} /survey-question
   *
   * @body {number} surveyId
   * @body {string} question
   * @body {string} type
   * @body {boolean} status
   * @body {string} description
   * @body {string} data
   * @body {string} sortId
   *
   * @throws {Error} e
   */
  //TODO убрать 2 блока catch, объеденив проверку на типы полей в другую ошибку
  async create(req: Request, res: Response) {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const { questions } = req.body;
      const questionsArr = await SurveyQuestionService.create(questions);
      for (const q of questionsArr) {
        q.setDataValue('sortId', q.dataValues.id);
      }
      await Promise.all(questionsArr.map((q) => q.save()));
      res.status(201).json(questionsArr);
    } else {
      returnError(null, res, errors.array());
    }
  }

  /**
   * Получить все вопросы
   *
   * @route {path} /survey-question
   *
   * @query {number} surveyId
   *
   * @throws {Error} e
   */
  async getAll(req: Request, res: Response) {
    try {
      const { surveyId } = req.query;

      const surveyQuestions = await SurveyQuestion.findAll<any>(
        surveyId
          ? { where: { surveyId }, order: [['id', 'ASC']] }
          : { order: [['id', 'ASC']] },
      );

      res.json(surveyQuestions);
    } catch (e: any) {
      returnError(e, res);
    }
  }

  /**
   * Получить один вопрос
   *
   * * @route {path} /survey-question/:id
   *
   * @param {number} id
   *
   * @throws {Error} e
   */
  async getOne(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { id } = req.params;

        const surveyQuestion = await SurveyQuestion.findByPk(parseInt(id));

        if (surveyQuestion === null) {
          returnError(null, res, [`SurveyQuestion with id = ${id} not found`]);
        } else {
          res.status(200).json(surveyQuestion.toJSON());
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  /**
   * Обновить один вопрос
   *
   * @route {path} /survey-question/:id
   *
   * @param {number} id
   *
   * @body {number} surveyId
   * @body {string} question
   * @body {string} type
   * @body {boolean} status
   * @body {string} description
   * @body {string} data
   * @body {string} sortId
   *
   * @throws {Error} e
   */
  async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { id } = req.params;

        const sQ = await SurveyQuestion.findByPk<any>(parseInt(id));

        if (sQ === null) {
          returnError(null, res, [`SurveyQuestion with id = ${id} not found`]);
        } else {
          const {
            surveyId,
            question,
            type,
            status,
            description,
            data,
            sortId,
          } = req.body;

          sQ.surveyId = typeof surveyId == 'number' ? surveyId : sQ.surveyId;
          sQ.question = typeof question == 'string' ? question : sQ.question;
          sQ.type = typeof type == 'string' ? type : sQ.type;
          sQ.status = typeof status == 'boolean' ? status : sQ.status;

          sQ.description =
            typeof description == 'string' ? description : sQ.description;
          sQ.data = typeof data == 'string' ? data : sQ.data;
          sQ.sortId = typeof sortId == 'number' ? sortId : sQ.sortId;

          await sQ.save();

          res.status(200).json(sQ.toJSON());
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  /**
   * Свапнуть sortId вопросов местами
   *
   * @route {path} /survey-question/swap/:id1/:id2
   *
   * @param {number} id1
   * @param {number} id2
   *
   * @throws {Error} e
   */
  async swap(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { id1, id2 } = req.params;

        const sQ1 = await SurveyQuestion.findByPk<any>(id1);
        const sQ2 = await SurveyQuestion.findByPk<any>(id2);

        if (sQ1 === null) {
          returnError(null, res, [`SurveyQuestion with id = ${id1} not found`]);
        } else if (sQ2 === null) {
          returnError(null, res, [`SurveyQuestion with id = ${id2} not found`]);
        } else {
          const sId1 = sQ1.sortId;
          const sId2 = sQ2.sortId;

          sQ1.sortId = sId2;
          sQ2.sortId = sId1;

          await sQ1.save();
          await sQ2.save();

          res.status(200).json([sQ1.toJSON(), sQ2.toJSON()]);
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  /**
   * Удалить один вопрос
   *
   * @route {path} /survey-question/:id
   *
   * @param {number} id
   *
   * @throws {Error} e
   */
  async delete(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { id } = req.params;

        const surveyQuestion = await SurveyQuestion.findByPk(parseInt(id));

        if (surveyQuestion === null) {
          res.status(404).send();
        } else {
          await surveyQuestion.destroy();
          res.status(204).send();
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }
}

export const surveyQuestionController = new SurveyQuestionController();
