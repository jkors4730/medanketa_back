import { Survey } from '../db/models/Survey.js';
import { SurveyQuestion } from '../db/models/SurveyQuestion.js';
import type { CreateSurveyDto } from '../dto/survey/create.survey.dto.js';
import type { Model } from 'sequelize';
import { QueryTypes } from 'sequelize';
import sequelize from '../db/config.js';
import { SurveyQuestionService } from './survey-question.service.js';
import { SurveyListService } from './survey-list.service.js';

export class SurveyService {
  static async getUsersBySurveyId(surveyId: string, page?: any, size?: any) {
    const mPage = page ? Number(page) : 1;
    const mSize = size ? Number(size) : 20;
    const surveys = await sequelize.query<any>(
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
                        WHERE sa."isSkip" = false
                        AND sa."userId" = sl."userId"
                        AND sa."surveyId" = :id)
                )::float) * 100)::numeric, 2) as complete
            FROM survey_answers sa
                               JOIN survey_lists sl
                                    ON sa.sl_id = sl.id
                               LEFT JOIN users u
                                         ON sl."userId" = u.id
            WHERE sl."surveyId" = :id
            ORDER BY sl."tsEnd" DESC
            OFFSET :offset
            LIMIT :limit`,
      {
        replacements: {
          id: surveyId,
          offset: mPage > 1 ? mSize * (Number(page) - 1) : 0,
          limit: mSize,
        },
        type: QueryTypes.SELECT,
      },
    );
    return surveys
    // const usersData = await Promise.all(
    //   surveys.map(async (userData) => {
    //     return await SurveyListService.getOne(userData.id, surveyId);
    //   }),
    // );
    // const combinedData = surveys.map((survey) => {
    //   const matchingUser = usersData.find(
    //     (user) => user.dataValues.userId === survey.userId,
    //   );
    //   return {
    //     ...survey,
    //     ...(matchingUser || {}),
    //   };
    // });
    // return combinedData;
  }
  static async createSurvey(createSurveyDto: CreateSurveyDto) {
    const survey = await Survey.create({ ...createSurveyDto });
    return survey;
  }

  static async cloneSurvey(id: number) {
    const targetSurvey = await Survey.findOne({
      where: { id: id },
    });
    const targetQuestion = await SurveyQuestion.findAll({
      where: { surveyId: id },
    });
    if (!targetSurvey || !targetQuestion) {
      return null;
    }
    const newDraft = await this.createSurvey({
      ...targetSurvey.dataValues,
      id: undefined,
      isDraft: true,
    });
    await this.bindQuestionsFromSurvey(newDraft.dataValues.id, targetQuestion);
    return newDraft;
  }
  static async bindQuestionsFromSurvey(
    draftId: number,
    questions: Model<any, any>[],
  ) {
    if (!Array.isArray(questions)) {
      throw new Error('survey_questions is not an array');
    }
    const newQuestions = await Promise.all(
      questions.map(async (question: any) => ({
        ...question.dataValues,
        id: undefined,
        surveyId: draftId,
      })),
    );
    await SurveyQuestionService.create(newQuestions);
  }
  static async createFromDraft(surveyId: number) {
    const clone = await this.cloneSurvey(surveyId);
    if (!clone) {
      return Error('failed to create');
    }
    clone.setDataValue('isDraft', false);
    await clone.save();
    return clone;
  }
  // TODO заменить на универсальные типы под query
  static async getAllDrafts(page: any, size: any, userId?: any) {
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
            WHERE surveys."userId" = :userId AND surveys."isDraft" = true
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
            WHERE surveys."isDraft" = true
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
        LEFT JOIN users ON surveys."userId"= users.id
      WHERE surveys."userId" = :userId AND surveys."isDraft" = true
    `,
          {
            replacements: { userId: userId },
            type: QueryTypes.SELECT,
          },
        )
      : await sequelize.query(
          `--sql
    SELECT COUNT(*) as count
    FROM surveys
    WHERE surveys."isDraft" = true`,
          { type: QueryTypes.SELECT },
        );
    return { surveys: surveys, mPage: mPage, dataCount: dataCount[0].count };
  }
}
