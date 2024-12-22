/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../utils/error';
import { QueryTypes } from 'sequelize';
import sequelize from '../db/config';
import { returnFromArr, returnNumFromArr } from '../utils/common';

class StatsController {

    /**
     * Получить статистику для чартов
     * 
     * @param {number} id surveyId
     * @throws {Error} e
    */
    async getBySurvey(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;

                //#region Get Charts Data
                async function getChart1(id: any) {
                    return returnNumFromArr(
                        await sequelize.query<any>(`--sql
                            SELECT DISTINCT
                                ROUND( AVG( (
                                    ( SELECT COUNT(sl_id)::float
                                    FROM survey_answers
                                    WHERE answer != ''
                                        AND "userId" = sl."userId"
                                        AND "surveyId" = :id ) /
                                    (
                                        ( SELECT COUNT(*)::float FROM survey_questions WHERE "surveyId" = :id) *
                                        ( SELECT COUNT(DISTINCT sl_id)::float FROM survey_answers WHERE answer != ''
                                            AND "userId" = sl."userId"
                                            AND "surveyId" = :id)
                                        )::float) * 100)::numeric, 2) as complete
                            FROM survey_answers sa
                                    JOIN survey_lists sl
                                        ON sa.sl_id = sl.id
                                    LEFT JOIN users u
                                            ON sl."userId" = u.id
                            WHERE sl."surveyId" = :id`,
                            {
                                replacements: { id: id },
                                type: QueryTypes.SELECT
                            }),
                            'complete'
                        );
                }

                async function getChart2(id: any) {
                    return returnNumFromArr(
                        await sequelize.query<any>(`--sql
                            -- кол-во уникальных юзеров, которые ответили на вопросы
                            SELECT ROUND( ( ( SELECT COUNT(DISTINCT "userId")
                            FROM survey_answers
                            WHERE answer != ''
                                AND "surveyId" = :id )::float
                            /
                            -- кол-во уникальных юзеров, которые открыли анкету
                            ( SELECT COUNT(DISTINCT "userId")
                            FROM survey_lists
                            WHERE "tsStart" IS NOT NULL
                            AND "surveyId" = :id )::float * 100)::numeric, 2) as response_rate`,
                            {
                                replacements: { id: id },
                                type: QueryTypes.SELECT
                            }),
                            'response_rate'
                        );
                }

                async function getChart3(id: any) {
                    return returnNumFromArr(
                        await sequelize.query<any>(`--sql
                            -- кол-во уникальных юзеров, которые открыли анкету,
                            -- но не ответили ни на один вопрос
                            SELECT ROUND( ( ( SELECT COUNT(DISTINCT "userId")
                            FROM survey_lists
                            WHERE "tsStart" IS NOT NULL
                            AND "tsEnd" IS NULL
                            AND json_array_length(answers) = 0
                            AND "surveyId" = :id )::float
                            /
                            -- кол-во уникальных юзеров, которые открыли анкету
                            ( SELECT COUNT(DISTINCT "userId")
                            FROM survey_lists
                            WHERE "tsStart" IS NOT NULL
                                AND "surveyId" = :id )::float * 100)::numeric, 2) as cancel_rate`,
                            {
                                replacements: { id: id },
                                type: QueryTypes.SELECT
                            }),
                            'cancel_rate'
                        );
                }

                async function getChart4(id: any) {
                    return returnNumFromArr(
                        await sequelize.query<any>(`--sql
                            -- кол-во уникальных юзеров, которые ответили на все вопросы
                            SELECT ROUND( ( ( SELECT COUNT(DISTINCT "userId")
                            FROM survey_answers
                            WHERE answer != ''
                            AND "surveyId" = :id
                            GROUP BY "userId"
                            HAVING COUNT(*) = (SELECT COUNT(*) FROM survey_questions WHERE "surveyId" = :id) LIMIT 1 )::float
                            /
                            -- кол-во уникальных юзеров, которые открыли анкету
                            ( SELECT COUNT(DISTINCT "userId")
                            FROM survey_lists
                            WHERE "tsStart" IS NOT NULL
                            AND "surveyId" = :id )::float * 100)::numeric, 2) as all_answers`,
                            {
                                replacements: { id: id },
                                type: QueryTypes.SELECT
                            }),
                            'all_answers'
                        );
                }

                async function getChart5(id: any) {
                    return returnNumFromArr(
                        await sequelize.query<any>(`--sql
                            SELECT
                            AVG( ROUND(((
                                -- (кол-во вопросов всего) - (кол-во пропущенных вопросов)
                            ((SELECT COUNT(*) FROM survey_questions WHERE "surveyId" = :id) -
                                (SELECT COUNT(*) FROM survey_answers WHERE answer = '' AND "userId" = sa."userId"))::float /
                                -- (кол-во вопросов всего) * (кол-во ответивших юзеров)
                            ((SELECT COUNT(*) FROM survey_questions WHERE "surveyId" = :id) *
                                (SELECT COUNT(DISTINCT "userId") FROM survey_answers WHERE "surveyId" = :id))::float
                            ) * 100)::numeric, 2) ) as missed_rate
                        FROM survey_answers as sa
                        WHERE "surveyId" = :id;`,
                            {
                                replacements: { id: id },
                                type: QueryTypes.SELECT
                            }),
                            'missed_rate'
                        );
                }

                async function getFinishTime(id: any) {
                    return returnFromArr( await sequelize.query<any>(`--sql
                        SELECT AVG("tsEnd" - "tsStart") as finish_time
                        FROM survey_lists
                        WHERE "surveyId" = :id`,
                        {
                            replacements: { id: id },
                            type: QueryTypes.SELECT
                        }),
                        'finish_time'
                    );
                }
                //#endregion

                res.status(200).json({
                    chart1: await getChart1(id),
                    chart2: await getChart2(id),
                    chart3: await getChart3(id),
                    chart4: await getChart4(id),
                    chart5: await getChart5(id),

                    finishTime: await getFinishTime(id)
                });
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Получить статистику по пропущенным вопросам 
     * 
     * @param {number} id surveyId
     * @throws {Error} e
    */
    async getMissedQuestionsBySurvey(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;

                const arr = await sequelize.query<any>(`--sql
                    SELECT DISTINCT sq.id,
                    sq.question,
                    ROUND( ( ( (SELECT COUNT(DISTINCT "userId") FROM survey_answers WHERE answer = '' AND "surveyId" = :id) /
                               (SELECT COUNT(*) FROM survey_questions WHERE "surveyId" = :id)::float ) * 100)::numeric, 2 )::float as missed_rate
                FROM survey_answers sa
                        JOIN survey_questions sq
                            ON sa.sq_id = sq.id
                WHERE
                    answer = ''
                AND sa."surveyId" = :id
                GROUP BY sq.id
                ORDER BY missed_rate DESC;`,
                {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });

                res.status(200).json(arr);
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Получить статистику ответов на вопросы 
     * 
     * @param {number} id surveyId
     * @throws {Error} e
    */
    async getQuestionsBySurvey(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;

                const arr = await sequelize.query<any>(`--sql
                SELECT sq.question,
                    sa.answer,
                    COUNT(*)::int as count
                    FROM survey_answers sa
                    JOIN survey_questions sq
                    ON sa.sq_id = sq.id
                    WHERE answer != ''
                        AND sa."surveyId" = :id
                    GROUP BY question, answer
                    ORDER BY count DESC`,
                {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });

                res.status(200).json( arr );
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

}

export const statsController = new StatsController();
