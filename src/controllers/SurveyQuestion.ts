/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../utils/error';
import { SurveyQuestion } from '../db/models/SurveyQuestion';
import { saveSurveyData } from '../utils/common';

class SurveyQuestionController {

    async create(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {

                const { questions } = req.body;
                
                const questionsArr = [];

                if ( questions ) {

                    for ( const q of questions ) {

                        const { surveyId, question, type, status, description, data, sortId } = q;
                        
                        if ( typeof surveyId == 'number' 
                            && typeof question == 'string'
                            && typeof type == 'string'
                            && typeof status == 'boolean' ) {
                            
                            const surveyQuestion = await SurveyQuestion.create<any>({
                                surveyId, question, type, status, description, data, sortId
                            });

                            await saveSurveyData( data, surveyQuestion.id );

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
            
            const surveyQuestions = await SurveyQuestion.findAll<any>( 
            surveyId
                ? { where: { surveyId }, order: [["id", "ASC"]] }
                : { order: [["id", "ASC"]] }
            );

            const result: any[] = [];

            surveyQuestions.forEach((item, i) => {
                item.sortId = i + 1;
                result.push(item);
            });

            res.json(result);
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
                
                const sQ = await SurveyQuestion.findByPk<any>( parseInt(id) );

                if (sQ === null) {
                    returnError(null, res, [`SurveyQuestion with id = ${id} not found`]);
                } else {
                    const { surveyId, question, type, status, description, data, sortId } = req.body;
                    
                    sQ.surveyId = typeof surveyId == 'number' ? surveyId : sQ.surveyId;
                    sQ.question = typeof question == 'string' ? question : sQ.question;
                    sQ.type = typeof type == 'string' ? type : sQ.type;
                    sQ.status = typeof status == 'boolean' ? status : sQ.status;

                    sQ.description = typeof description == 'string' ? description : sQ.description;
                    sQ.data = typeof data == 'string' ? data : sQ.data;
                    sQ.sortId = typeof sortId == 'string' ? sortId : sQ.sortId;

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