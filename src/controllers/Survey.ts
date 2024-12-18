/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { returnError } from '../utils/error';
import { validationResult } from 'express-validator';
import { Survey } from '../db/models/Survey';
import sequelize from '../db/config';
import { SurveyQuestion } from '../db/models/SurveyQuestion';
import { QueryTypes } from 'sequelize';

class SurveyController {

    async create(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { userId, image, title, slug, status, access, description, expireDate, questions } = req.body;
     
                const survey = Survey.build<any>({
                    userId, image, title, slug, status, access, description, expireDate
                });

                console.log( 'Survey', survey.toJSON() );

                await survey.save();

                const questionsArr = [];

                if ( questions ) {

                    for ( const q of questions ) {

                        const { question, type, status, description, data } = q;
                        
                        if ( typeof question == 'string'
                            && typeof type == 'string'
                            && typeof status == 'boolean' ) {
                            
                            const surveyQuestion = SurveyQuestion.build({
                                surveyId: survey.id, question, type, status, description, data
                            });
                            await surveyQuestion.save();

                            questionsArr.push(surveyQuestion.toJSON());
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

    async getAll(req: Request, res: Response) {
        try {
            const { userId } = req.query;

            const surveys = userId ?
                await sequelize.query(`
                    SELECT
                    surveys.*,
                    CONCAT(users.name, ' ', users.lastname) as "userName",
                    users.email as "userEmail"
                    FROM surveys
                    LEFT JOIN users ON surveys."userId" = users.id
                    WHERE surveys."userId" = :userId
                    ORDER BY surveys.id DESC`, {
                    replacements: { userId: userId },
                    type: QueryTypes.SELECT,
                    model: Survey,
                    mapToModel: true,
                })
                :
                await sequelize.query(`
                    SELECT
                    surveys.*,
                    CONCAT(users.name, ' ', users.lastname) as "userName",
                    users.email as "userEmail"
                    FROM surveys
                    LEFT JOIN users ON surveys."userId" = users.id
                    ORDER BY surveys.id DESC`, {
                    type: QueryTypes.SELECT,
                    model: Survey,
                    mapToModel: true,
                });
        
            res.json(surveys);
        }
        catch (e: any) { returnError(e, res); }
    }

    async getOne(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;

                const survey = await sequelize.query(`
                    SELECT
                    surveys.*,
                    users.id as "authorId",
                    CONCAT(users.name, ' ', users.lastname) as "authorName"
                    FROM surveys
                    LEFT JOIN users ON surveys."userId" = users.id
                    WHERE surveys.id = :id`, {
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

    async getByUserId(req: Request, res: Response) {
        const errors = validationResult(req);
            
        if ( errors.isEmpty() ) {
            const { id } = req.params;

            const surveys = await sequelize.query(`
                SELECT surveys.*,
                users.id as "authorId",
                CONCAT(users.name, ' ', users.lastname) as "authorName"
                FROM surveys
                JOIN survey_lists ON surveys."id" = survey_lists."surveyId"
                LEFT JOIN users ON surveys."userId" = users.id
                WHERE survey_lists."userId" = :userId
                AND surveys.status = true`, {
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

    async getUsersBySurveyId(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const data = await sequelize.query<any>(`
            SELECT DISTINCT
            sl1."userId" as "userId",
            u.name as "userName",
            u.lastname as "userLastname",
            TO_CHAR(sl1."tsEnd", 'DD.MM.YYYY') as "dateEnd",
            (sl1."tsEnd" - sl1."tsStart") as time,
            sl1."tsStart" as "tsStart", 
            sl1."tsEnd" as "tsEnd"
            FROM survey_lists as sl1
            LEFT JOIN users as u
            ON sl1."userId" = u.id
            LEFT JOIN survey_questions as sq
            ON sl1."surveyId" = sq."surveyId"
            WHERE sl1."surveyId" = :id
            AND sl1."tsEnd" IS NOT NULL`, {
                replacements: { id: id },
                type: QueryTypes.SELECT
            });

            const answers = await sequelize.query<any>(`SELECT answers FROM survey_lists WHERE "surveyId" = :id`, {
                replacements: { id: id },
                type: QueryTypes.SELECT
            });

            const qCount = await sequelize.query<any>(`SELECT COUNT(*) as count FROM survey_questions WHERE "surveyId" = :id`, {
                replacements: { id: id },
                type: QueryTypes.SELECT
            });
            const questions = qCount.length ? +qCount[0].count : 0;

            let fillCount = 0;

            for ( const item of answers ) {
                for ( const a of item.answers ) {
                    if ( a.answer ) {
                        fillCount++;
                    }
                }
            }

            const complete = ( fillCount / questions ) * 100;

            res.status(200).json( [ { ...data[0], complete } ] );
        }
        catch (e: any) { returnError(e, res); }
    }

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

    async delete(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;

                const survey = await Survey.findByPk( parseInt(id) );

                if (survey === null) {
                    returnError(null, res, [`Survey with id = ${id} not found`]);
                } else {
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