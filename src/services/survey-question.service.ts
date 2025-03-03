import { SurveyQuestion } from '../db/models/SurveyQuestion.js';
import { saveSurveyData } from '../utils/common.js';

//param: (typeof SurveyQuestion)[]
export class SurveyQuestionService {
  static async create(questions: any[]) {
    const questionsArr = [];
    console.log(questions);
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
        });
        // set sortId as entity_id
        surveyQuestion.setDataValue(
          'sortId',
          sortId ? surveyQuestion.dataValues.id : sortId,
        );
        await surveyQuestion.save();

        await saveSurveyData(data, surveyQuestion.dataValues.id);

        questionsArr.push(surveyQuestion.toJSON());
      } else {
        return Error(
          `You must provide required fields "surveyId", "question", "type", "status" to create SurveyQuestion`,
        );
      }
    }
    return questionsArr;
  }
}
