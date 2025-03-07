import { SurveyQuestion } from '../db/models/SurveyQuestion.js';
import { saveSurveyData } from '../utils/common.js';
import type { Model } from 'sequelize';

//param: (typeof SurveyQuestion)[]
export class SurveyQuestionService {
  static async create(questions: any[]) {
    const questionsArr: Model<any, any>[] = [];

    for (const q of questions) {
      const { surveyId, question, type, status, description, data, sortId } = q;

      if (
        typeof surveyId == 'number' &&
        typeof question == 'string' &&
        typeof type == 'string' &&
        typeof status == 'boolean'
      ) {
        const surveyQuestion = await SurveyQuestion.create({
          surveyId,
          question,
          type,
          status,
          description,
          data,
          sortId,
        });

        await saveSurveyData(data, surveyQuestion.dataValues.id);

        questionsArr.push(surveyQuestion);
      } else {
        throw Error(
          `You must provide required fields "surveyId", "question", "type", "status" to create SurveyQuestion`,
        );
      }
    }
    return questionsArr;
  }
}
