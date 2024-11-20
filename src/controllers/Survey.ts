import { Request, Response } from 'express';
import { returnError } from '../utils/error';
import { validationResult } from 'express-validator';
import { Survey } from '../db/models/Survey';
import sequelize from '../db/config';
import { SurveyQuestion } from '../db/models/SurveyQuestion';

class SurveyController {

    async create(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { userId, image, title, slug, status, description, expireDate, questions } = req.body;
     
                const survey = Survey.build<any>({
                    userId, image, title, slug, status, description, expireDate
                });

                console.log( 'Survey', survey.toJSON() );

                await survey.save();

                let questionsArr = [];

                if ( questions ) {

                    for ( let q of questions ) {

                        const { question, type, status, description, data } = q;
                        
                        if ( question && type && status ) {
                            
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

    async getAll(_req: Request, res: Response) {
        try {
            const surveys = await sequelize.query(`
                SELECT
                surveys.*,
                users.name as "userName",
                users.email as "userEmail"
                FROM surveys
                JOIN users ON surveys."userId" = users.id`, {
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

                const survey = await Survey.findByPk( parseInt(id) );

                if (survey === null) {
                    returnError(null, res, [`Survey with id = ${id} not found`]);
                } else {
                    res.status(200).json(survey.toJSON());
                }
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    async update(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;
                const { userId, image, title, slug, status, description, expireDate } = req.body;

                const survey = await Survey.findByPk<any>( parseInt(id) );

                if (survey === null) {
                    returnError(null, res, [`Survey with id = ${id} not found`]);
                } else {
                    survey.userId = userId || survey.userId;
                    survey.image = image || survey.image;
                    survey.title = title || survey.title;
                    survey.slug = slug || survey.slug;
                    survey.status = status || survey.status;
                    survey.description = description || survey.description;
                    survey.expireDate = expireDate || survey.expireDate;

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