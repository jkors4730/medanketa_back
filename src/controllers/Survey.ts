/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { returnError } from '../utils/error';
import { validationResult } from 'express-validator';
import { Survey } from '../db/models/Survey';
import sequelize from '../db/config';
import { SurveyQuestion } from '../db/models/SurveyQuestion';
import { QueryTypes } from 'sequelize';
import { saveSurveyData } from '../utils/common';

class SurveyController {

    /**
     * Создать анкету
     * 
     * @body {number} userId
     * @body {string} image
     * @body {string} title
     * @body {string} slug
     * @body {boolean} status
     * @body {boolean} access
     * @body {string} description
     * @body {string} expireDate
     * @body {JSON} questions
     * 
     * @throws {Error} e
    */
    async create(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { userId, image, title, slug, status, access, description, expireDate, questions } = req.body;
     
                const survey = await Survey.create<any>({
                    userId, image, title, slug, status, access, description, expireDate
                });

                const questionsArr = [];

                if ( Array.isArray( questions ) ) {

                    for ( const q of questions ) {

                        const { question, type, status, description, data } = q;
                        
                        if ( typeof question == 'string'
                            && typeof type == 'string'
                            && typeof status == 'boolean' ) {
                            
                            const surveyQuestion = await SurveyQuestion.create<any>({
                                surveyId: survey.id, question, type, status, description, data
                            });
                            questionsArr.push(surveyQuestion.toJSON());
                            // сохраняем data (json)
                            await saveSurveyData( data, surveyQuestion.id );
                        }
                        else {
                            returnError(null, res, ['You must provide required fields "question", "type", "status" to create SurveyQuestion'] );
                        }
                    }
                }

                survey.questions = questionsArr;

                res.status(201).json(survey.toJSON());
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Получить список анкет
     * 
     * @query {number} userId
     * 
     * @throws {Error} e
    */
    async getAll(req: Request, res: Response) {
        try {
            const { userId } = req.query;

            const surveys = userId ?
                await sequelize.query(`--sql
                SELECT
                    surveys.*,
                    CONCAT(users.name, ' ', users.lastname) as "userName",
                    users.email as "userEmail"
                FROM surveys
                        LEFT JOIN users ON surveys."userId" = users.id
                WHERE surveys."userId" = :userId
                ORDER BY surveys.id DESC`,
                {
                    replacements: { userId: userId },
                    type: QueryTypes.SELECT,
                    model: Survey,
                    mapToModel: true,
                })
                :
                await sequelize.query(`--sql
                SELECT
                    surveys.*,
                    CONCAT(users.name, ' ', users.lastname) as "userName",
                    users.email as "userEmail"
                FROM surveys
                        LEFT JOIN users ON surveys."userId" = users.id
                ORDER BY surveys.id DESC`,
                {
                    type: QueryTypes.SELECT,
                    model: Survey,
                    mapToModel: true,
                });
        
            res.status(200).json(surveys);
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Получить одну анкету
     * 
     * @query {number} id surveyId
     * @throws {Error} e
    */
    async getOne(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;

                const survey = await sequelize.query(`--sql
                SELECT
                    surveys.*,
                    users.id as "authorId",
                    CONCAT(users.name, ' ', users.lastname) as "authorName"
                FROM surveys
                        LEFT JOIN users ON surveys."userId" = users.id
                WHERE surveys.id = :id`,
                {
                    replacements: { id: id },
                    type: QueryTypes.SELECT,
                    model: Survey,
                    mapToModel: true,
                });

                if (survey === null || !Array.isArray(survey) || !survey.length) {
                    returnError(null, res, [`Survey with id = ${id} not found`]);
                }
                else {
                    res.status(200).json(survey[0]);
                }
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Получить список анкет пользователя (завершённых)
     * 
     * @param {number} id surveyId
     * @throws {Error} e
    */
    async getByUserId(req: Request, res: Response) {
        const errors = validationResult(req);
            
        if ( errors.isEmpty() ) {
            const { id } = req.params;

            const surveys = await sequelize.query(`--sql
            SELECT surveys.*,
                users.id as "authorId",
                CONCAT(users.name, ' ', users.lastname) as "authorName"
            FROM surveys
                    JOIN survey_lists ON surveys."id" = survey_lists."surveyId"
                    LEFT JOIN users ON surveys."userId" = users.id
            WHERE surveys.status = true
                AND survey_lists."userId" = :userId`, {
                replacements: { userId: id },
                type: QueryTypes.SELECT,
                model: Survey,
                mapToModel: true,
            });
        
            res.json(surveys);
        }
        else {
            returnError(null, res, errors.array() );
        }
    }

    /**
     * Получить список пользователей ответивших на анкету
     * 
     * @param {number} id surveyId
     * @throws {Error} e
    */
    async getUsersBySurveyId(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const data = await sequelize.query<any>(`--sql
            SELECT DISTINCT
            sl."userId" as "userId",
            u.name as "userName",
            u.lastname as "userLastname",
            TO_CHAR(sl."tsEnd", 'DD.MM.YYYY') as "dateEnd",
            (sl."tsEnd" - sl."tsStart") as time,
            sl."tsStart",
            sl."tsEnd",
            ROUND( ( (
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
            });

            res.status(200).json( data );
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Обновить анкету
     * 
     * @param {number} id surveyId
     * 
     * @body {number} userId
     * @body {string} image
     * @body {string} title
     * @body {string} slug
     * @body {boolean} status
     * @body {boolean} access
     * @body {string} description
     * @body {string} expireDate
     * @throws {Error} e
    */
    async update(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;
                const { userId, image, title, slug, status, access, description, expireDate } = req.body;

                const survey = await Survey.findByPk<any>( parseInt(id) );

                if (survey === null) {
                    returnError(null, res, [`Survey with id = ${id} not found`]);
                } else {
                    survey.userId = typeof userId == 'number' ? userId : survey.userId;
                    survey.image = typeof image == 'string' ? image : survey.image;
                    survey.title = typeof title == 'string' ? title : survey.title;
                    survey.slug = typeof slug == 'string' ? slug : survey.slug;
                    survey.status = typeof status == 'boolean' ? status : survey.status;
                    survey.access = typeof access == 'boolean' ? access : survey.access;
                    survey.description = typeof description == 'string' ? description : survey.description;
                    survey.expireDate = typeof expireDate == 'string' ? expireDate : survey.expireDate;

                    await survey.save();

                    res.status(200).json(survey.toJSON());
                }
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Удалить анкету
     * 
     * @param {number} id surveyId
     * 
     * @throws {Error} e
    */
    async delete(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;

                const survey = await Survey.findByPk( parseInt(id) );

                if (survey === null) {
                    returnError(null, res, [`Survey with id = ${id} not found`]);
                } else {
                    // удалить связанные вопросы
                    const sq_id_arr = await sequelize.query<any>(`--sql
                    DELETE FROM survey_questions WHERE "surveyId" = :id RETURNING id`,
                    {
                        replacements: { id: id },
                        type: QueryTypes.SELECT
                    });

                    // удалить данные связанные с вопросами
                    for ( const item of sq_id_arr ) {
                        await sequelize.query(`--sql
                        DELETE FROM survey_data WHERE sq_id = :id`,
                        {
                            replacements: { id: item.id },
                            type: QueryTypes.DELETE
                        });
                    }

                    // удалить ответы на вопросы
                    await sequelize.query(`--sql
                    DELETE FROM survey_lists WHERE "surveyId" = :id`,
                    {
                        replacements: { id: id },
                        type: QueryTypes.DELETE
                    });

                    await survey.destroy();

                    res.status(204).send();
                }
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

}

export const surveyController = new SurveyController();
