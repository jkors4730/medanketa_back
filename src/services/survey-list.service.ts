import { SurveyList } from '../db/models/SurveyList.js';
import { User } from '../db/models/User.js';
import { getFinishTime } from '../controllers/Stats.js';
import { SurveyQuestion } from '../db/models/SurveyQuestion.js';
import { log } from 'node:util';
import md5 from 'md5';

type ResultDataItem = {
  fullNameResp: string;
  timeCompleted: Date;
  percentComplete: string;
  access_type: string;
};
type ResultDataAnswersResponse = Array<ResultDataItem | undefined>;

export class SurveyListService {
  static async getAll(surveyId?: any) {
    const surveyList = await SurveyList.findAll(
      surveyId ? { where: { surveyId: surveyId } } : {},
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
    const surveyQuestions = await SurveyQuestion.findAll<any>({
      where: { surveyId: surveyId },
    });
    const questionsMap = Object.fromEntries(
      surveyQuestions.map((q) => [q.id, q.question]),
    );
    surveyList.dataValues.answers = surveyList.dataValues.answers.map(
      (answer: typeof surveyList.dataValues.answers) => ({
        ...answer,
        question: questionsMap[answer.id] || 'Неизвестный вопрос',
      }),
    );
    return surveyList;
  }
  static async getOneStatisticBySurvey(userId: any) {
    const resultDataResponse: ResultDataAnswersResponse = [];
    const surveyList = await SurveyList.findOne({ where: { userId: userId } });
    const userInfo = await User.findOne({ where: { id: userId } });
    const timeCompleted = await getFinishTime(surveyList.dataValues.id);
    const survey_questions = await SurveyQuestion.findAll({
      where: { surveyId: surveyList.dataValues.surveyId },
    });
    const percentComplete =
      (survey_questions.length / surveyList.dataValues.answers.length) * 100;
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
