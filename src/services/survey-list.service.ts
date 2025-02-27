import { SurveyList } from '../db/models/survey/SurveyList.js';
import { User } from '../db/models/User.js';
import { getFinishTime } from '../controllers/Stats.js';
import { SurveyQuestion } from '../db/models/survey/SurveyQuestion.js';

type ResultDataItem = {
  fullNameResp: string;
  timeCompleted: Date;
  percentComplete: string;
  access_type: string;
};
type ResultDataAnswersResponse = Array<ResultDataItem | undefined>;

export class SurveyListService {
  static async getAll(userId?: any) {
    return SurveyList.findAll(userId ? { where: { userId: userId } } : {});
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
