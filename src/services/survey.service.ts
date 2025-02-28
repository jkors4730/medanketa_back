import { Survey } from '../db/models/Survey.js';
import { SurveyQuestion } from '../db/models/SurveyQuestion.js';
import type { CreateSurveyDto } from '../dto/survey/create.survey.dto.js';
import type { Model } from 'sequelize';
import { QueryTypes } from 'sequelize';
import { saveSurveyData } from '../utils/common.js';
import { returnError } from '../utils/error.js';
import surveyQuestion from '../routes/SurveyQuestion.js';
import sequelize from '../db/config.js';
import { User } from '../db/models/User.js';

export class SurveyService {
  static async createSurvey(createSurveyDto: CreateSurveyDto) {
    const survey = await Survey.create({ ...createSurveyDto });
    return survey;
  }
  static async validateAndGenerateQuestionsData(
    survey: Model<any, any>,
    questions: any[],
  ) {
    const questionsArr = [];
    for (const q of questions) {
      const { question, type, status, description, data } = q;
      if (
        typeof question == 'string' &&
        typeof type == 'string' &&
        typeof status == 'boolean'
      ) {
        const surveyQuestion = await SurveyQuestion.create({
          surveyId: survey.dataValues.id,
          question,
          type,
          status,
          description,
          data,
        });
        questionsArr.push(surveyQuestion.toJSON());
        // сохраняем data (json)
        await saveSurveyData(data, surveyQuestion.dataValues.id);
      } else {
        return null;
      }
    }
    return questionsArr;
  }
  static async cloneSurvey(id: number) {
    const targetSurvey = await Survey.findOne({
      where: { id: id },
      include: {
        model: SurveyQuestion,
        as: 'survey_questions',
      },
    });
    if (!targetSurvey) {
      return null;
    }
    const newDraft = await this.createSurvey({
      ...targetSurvey.dataValues,
      isDraft: true,
      id: undefined,
    });
    await this.bindQuestionsFromSurvey(newDraft, targetSurvey);
    return newDraft;
  }
  static async bindQuestionsFromSurvey(
    newDraft: Model<any, any>,
    targetSurvey: Model<any, any>,
  ) {
    if (!Array.isArray(targetSurvey.dataValues.survey_questions)) {
      throw new Error('survey_questions is not an array');
    }
    const newQuestions = await Promise.all(
      targetSurvey.dataValues.survey_questions.map(async (question: any) => {
        return await SurveyQuestion.create({
          ...question.dataValues,
          id: undefined,
          surveyId: newDraft.dataValues.id,
        });
      }),
    );
    const questions = await this.validateAndGenerateQuestionsData(
      newDraft,
      newQuestions,
    );
    newDraft.setDataValue('questions', questions);
    await newDraft.save();
    return { newDraft: newDraft };
  }
  static async createFromDraft(surveyId: number) {
    const clone = await this.cloneSurvey(surveyId);
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
