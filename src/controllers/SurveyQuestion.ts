/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../utils/error';
import { SurveyQuestion } from '../db/models/SurveyQuestion';
import { saveSurveyData } from '../utils/common';

class SurveyQuestionController {

     /**
     * Создать вопрос
     * 
     * * @route {path} /survey-question
     * 
     * @body {number} surveyId
     * @body {string} question
     * @body {string} type
     * @body {boolean} status
     * @body {string} description
     * @body {string} data
     * @body {string} sortId
     * 
     * @throws {Error} e
    */
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

    /**
     * Получить все вопросы
     * 
     * @route {path} /survey-question
     * 
     * @query {number} surveyId
     * 
     * @throws {Error} e
    */
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
                if (item.sortId) {
                    item.sortId = i + 1;
                }
                result.push(item);
            });

            res.json(result);
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Получить один вопрос
     * 
     * * @route {path} /survey-question/:id
     * 
     * @param {number} id
     * 
     * @throws {Error} e
    */
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

    /**
     * Обновить один вопрос
     * 
     * @route {path} /survey-question/:id
     * 
     * @param {number} id
     * 
     * @body {number} surveyId
     * @body {string} question
     * @body {string} type
     * @body {boolean} status
     * @body {string} description
     * @body {string} data
     * @body {string} sortId
     * 
     * @throws {Error} e
    */
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
                    sQ.sortId = typeof sortId == 'number' ? sortId : sQ.sortId;

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

    /**
     * Удалить один вопрос
     * 
     * @route {path} /survey-question/:id
     * 
     * @param {number} id
     * 
     * @throws {Error} e
    */
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
