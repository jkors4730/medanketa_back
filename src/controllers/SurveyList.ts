/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';
import { returnError } from '../utils/error.js';
import { validationResult } from 'express-validator';
import { SurveyList } from '../db/models/SurveyList.js';
import md5 from 'md5';
import { saveSurveyAnswers } from '../utils/common.js';
import { Service } from 'typedi';
import { SurveyListService } from '../services/survey-list.service.js';
import { SurveyQuestion } from '../db/models/SurveyQuestion.js';
@Service()
export class SurveyListController {
  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { userId, surveyId, answers, privacy, tsStart, tsEnd } = req.body;

        const exists = await SurveyList.findOne<any>({
          where: {
            uIndex: md5(String(surveyId) + String(userId)),
          },
        });
        console.log('exists', exists);

        if (!exists) {
          const surveyList = await SurveyList.create<any>({
            uIndex: md5(String(surveyId) + String(userId)),
            userId,
            surveyId,
            answers,
            privacy,
            tsStart,
            tsEnd,
          });

          await saveSurveyAnswers(surveyId, userId, surveyList.id, answers);

          res.status(201).json(surveyList.toJSON());
        } else {
          let count = 0;

          if (answers) {
            count++;
            exists.answers = answers;

            await saveSurveyAnswers(surveyId, userId, exists.id, answers);
          }
          if (typeof privacy == 'boolean') {
            count++;
            exists.privacy = privacy;
          }
          if (tsStart && exists.tsStart == null) {
            count++;
            exists.tsStart = tsStart;
          }
          if (tsEnd && exists.tsEnd == null) {
            count++;
            exists.tsEnd = tsEnd;
          }

          if (count) {
            await exists.save();
            res.status(200).json(exists.toJSON());
          }
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { surveyId } = req.query;
      const surveyList = await SurveyListService.getAll(surveyId);
      res.json(surveyList);
    } catch (e: any) {
      returnError(e, res);
    }
  }
  //TODO переделать логику на метод getAll with userId кто прошел анкету и подгружать их инфу
  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { surveyId } = req.query;

      const surveyList = await SurveyListService.getOne(id, surveyId);
      res.json({
        surveyListByUserCreater: surveyList,
      });
    } catch (e: any) {
      returnError(e, res);
    }
  }
}

export const surveyListController = new SurveyListController();
