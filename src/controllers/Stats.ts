/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../utils/error';
import { QueryTypes } from 'sequelize';
import sequelize from '../db/config';

class StatsController {

    async getBySurvey(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;

                // questions - Общее количество вопросов в анкете
                const qCount = await sequelize.query<any>(`SELECT COUNT(*) as count FROM survey_questions WHERE "surveyId" = :id`, {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });
                const questions = qCount.length ? +qCount[0].count : 0;

                // answers - Количество вопросов, на которые был дан ответ
                const aCount = await sequelize.query<any>(`SELECT json_array_length(answers) as count FROM survey_lists WHERE "surveyId" = :id`, {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });
                const answers = aCount.length ? +aCount[0].count : 0;

                // openCount - Количество пользователей, которые открыли анкету
                const oCount = await sequelize.query<any>(`SELECT COUNT("userId") as count FROM survey_lists WHERE "surveyId" = :id AND "tsStart" IS NOT null`, {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });
                const open = oCount.length ? +oCount[0].count : 0;

                // openAndAnswerCount - Количество пользователей, которые открыли анкету и ответили хотя бы на один вопрос анкеты
                const oaCount = await sequelize.query<any>(`SELECT COUNT("userId") as count FROM survey_lists WHERE "surveyId" = :id AND "tsStart" IS NOT null AND json_array_length(answers) > 0`, {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });
                const openAndAnswer = oaCount.length ? +oaCount[0].count : 0;

                // openAndUnanswer - Количество пользователей, которые открыли анкету и не ответили ни на один вопрос
                const ouaCount = await sequelize.query<any>(`SELECT COUNT("userId") as count FROM survey_lists WHERE "surveyId" = :id AND "tsStart" IS NOT null AND json_array_length(answers) = 0`, {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });
                const openAndUnanswer = ouaCount.length ? +ouaCount[0].count : 0;

                // openAndAllAnswersCount - Количество пользователей, которые открыли анкету и ответили на все вопросы анкеты
                const oAllACount = await sequelize.query<any>(`SELECT COUNT("userId") as count FROM survey_lists WHERE "surveyId" = :id AND "tsStart" IS NOT null AND json_array_length(answers) = :questions`, {
                    replacements: { id: id, questions: questions },
                    type: QueryTypes.SELECT
                });
                const openAndAllAnswers = oAllACount.length ? +oAllACount[0].count : 0;

                // finishCount - Количество пользователей, которые завершили анкету
                const fCount = await sequelize.query<any>(`SELECT COUNT("userId") as count FROM survey_lists WHERE "surveyId" = :id AND "tsEnd" IS NOT null`, {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });
                const finish = fCount.length ? +fCount[0].count : 0;

                const time = await sequelize.query<any>(`SELECT ("tsEnd" - "tsStart") as time FROM survey_lists WHERE "surveyId" = :id`, {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });

                const finishTime = time.length ? time[0].time : {};

                res.status(200).json({
                    questions, // Общее количество вопросов в анкете
                    answers,   // Количество вопросов, на которые был дан ответ
                    unanswered: questions - answers, // Количество вопросов, на которые не был дан ответ
                    openCount: open, // Количество пользователей, которые открыли анкету
                    openAndAnswerCount: openAndAnswer, // Количество пользователей, которые открыли анкету и ответили хотя бы на один вопрос анкеты
                    openAndUnanswerCount: openAndUnanswer, // Количество пользователей, которые открыли анкету и не ответили ни на один вопрос
                    openAndAllAnswersCount: openAndAllAnswers,
                    finishCount: finish,
                    finishTime: finishTime,
                });
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

}

export const statsController = new StatsController();
