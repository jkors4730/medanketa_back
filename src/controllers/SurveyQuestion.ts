import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../utils/error';
import { SurveyQuestion } from '../db/models/SurveyQuestion';

class SurveyQuestionController {

    async create(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {

                const { questions } = req.body;
                
                let questionsArr = [];

                if ( questions ) {

                    for ( let q of questions ) {

                        const { surveyId, question, type, status, description, data } = q;
                        
                        if ( typeof surveyId == 'number' 
                            && typeof question == 'string'
                            && typeof type == 'string'
                            && typeof status == 'boolean' ) {
                            
                            const surveyQuestion = SurveyQuestion.build({
                                surveyId, question, type, status, description, data
                            });
                            await surveyQuestion.save();

                            questionsArr.push(surveyQuestion.toJSON());
                        }
                        else {
                            returnError(null, res, ['You must provide required fields "surveyId", "question", "type", "status" to create SurveyQuestion'] );
                        }
                    }
                }

                res.status(201).json(questionsArr);
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    async getAll(req: Request, res: Response) {
        try {
            const { surveyId } = req.query;
            
            const surveyQuestions = await SurveyQuestion.findAll( 
            surveyId ? { where: { surveyId } } : {} );

            res.json(surveyQuestions);
        }
        catch (e: any) { returnError(e, res); }
    }

    async getOne(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;

                const surveyQuestion = await SurveyQuestion.findByPk( parseInt(id) );

                if (surveyQuestion === null) {
                    returnError(null, res, [`SurveyQuestion with id = ${id} not found`]);
                } else {
                    res.status(200).json(surveyQuestion.toJSON());
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
                const { surveyId, question, type, status, description, data } = req.body;

                const sQ = await SurveyQuestion.findByPk<any>( parseInt(id) );

                if (sQ === null) {
                    returnError(null, res, [`SurveyQuestion with id = ${id} not found`]);
                } else {
                    sQ.surveyId = surveyId || sQ.surveyId;
                    sQ.question = question || sQ.question;
                    sQ.type = type || sQ.type;
                    sQ.status = status || sQ.status;
                    sQ.description = description || sQ.description;
                    sQ.data = data || sQ.data;

                    await sQ.save();

                    res.status(200).json(sQ.toJSON());
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

                const surveyQuestion = await SurveyQuestion.findByPk( parseInt(id) );

                if (surveyQuestion === null) {
                    res.status(404).send();
                } else {
                    await surveyQuestion.destroy();
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

export const surveyQuestionController = new SurveyQuestionController();