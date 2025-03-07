import { SurveyList } from '../db/models/SurveyList.js';
import { User } from '../db/models/User.js';
import { getFinishTime } from '../controllers/Stats.js';
import { SurveyQuestion } from '../db/models/SurveyQuestion.js';
import { log } from 'node:util';
import md5 from 'md5';
import { QueryTypes, Sequelize } from 'sequelize';
import sequelize from '../db/config.js';
import { Survey } from '../db/models/Survey.js';

type ResultDataItem = {
  fullNameResp: string;
  timeCompleted: Date;
  percentComplete: string;
  access_type: string;
};
type ResultDataAnswersResponse = Array<ResultDataItem | undefined>;

export class SurveyListService {
  static async getAll(surveyId?: any, page?: any, size?: any) {
    const mPage = page ? Number(page) : 1;
    const mSize = size ? Number(size) : 20;
    const surveyList = await SurveyList.findAll(
      surveyId
        ? {
            where: { surveyId: surveyId },
            offset: mPage > 1 ? mSize * (Number(page) - 1) : 0,
            limit: mSize,
          }
        : {},
    );
    const user_ids: string[] = [
      ...new Set(surveyList.map((value) => String(value.dataValues.userId))),
    ];
    const result: Array<ResultDataAnswersResponse | undefined> = [];
    for (const userId of user_ids) {
      result.push(await this.getOneStatisticBySurvey(userId));
    }
    return surveyList.map((survey) => {
      const userData = result.find(
        (_, idx) => user_ids[idx] === survey.dataValues.userId,
      );
      return {
        userInfo: userData,
        ...survey.dataValues,
      };
    });
  }
  static async getOne(userId: any, surveyId?: any) {
    const surveyList = await SurveyList.findOne({
      where: { uIndex: md5(String(surveyId) + String(userId)) },
    });
    if (!surveyList) {
      return null;
    }
    const surveyQuestions = await SurveyQuestion.findAll<any>({
      where: { surveyId: surveyId },
    });
    const questionsMap = Object.fromEntries(
      surveyQuestions.map((q) => [q.id, q.question]),
    );
    const questionsMapType = Object.fromEntries(
      surveyQuestions.map((type) => [type.id, type.type]),
    );
    surveyList.dataValues.answers = surveyList.dataValues.answers.map(
      (answer: typeof surveyList.dataValues.answers) => ({
        ...answer,
        question: questionsMap[answer.id] || 'Неизвестный вопрос',
        type: questionsMapType[answer.id] || 'Неизвестный тип вопроса',
      }),
    );
    return surveyList;
  }
  static async getOneStatisticBySurvey(userId: any) {
    const resultDataResponse: ResultDataAnswersResponse = [];
    const surveyList = await SurveyList.findOne({ where: { userId: userId } });
    const userInfo = await User.findOne({ where: { id: userId } });
    if (!userInfo) {
      return null;
    }
    const timeCompleted = await getFinishTime(surveyList.dataValues.surveyId);
    const survey_questions = await SurveyQuestion.findAll({
      where: { surveyId: surveyList.dataValues.surveyId },
    });
    const filteredSurveyQuestion = survey_questions.filter(
      (q) => q.dataValues.type !== 'infoblock',
    );
    const percentComplete =
      (filteredSurveyQuestion.length / surveyList.dataValues.answers.length) *
      100;
    const accessType = 'по ссылке';
    if (timeCompleted != null && percentComplete !== Infinity) {
      resultDataResponse.push({
        fullNameResp:
          userInfo.dataValues.name +
          userInfo.dataValues.surname +
          userInfo.dataValues.lastName +
          '',
        timeCompleted: timeCompleted,
        percentComplete: `${percentComplete}%`,
        access_type: accessType,
      });
    }
    return resultDataResponse;
  }
}
