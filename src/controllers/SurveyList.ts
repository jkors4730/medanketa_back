/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { returnError } from '../utils/error';
import { validationResult } from 'express-validator';
import { SurveyList } from '../db/models/SurveyList';

class SurveyListController {

    async create(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { userId, surveyId } = req.body;

                const surveyList = SurveyList.build<any>({
                    userId, surveyId
                });

                console.log( 'SurveyList', surveyList.toJSON() );

                await surveyList.save();

                res.status(201).json(surveyList.toJSON());
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
            
            const surveyList = await SurveyList.findAll( 
                userId ? { where: { userId } } : {} );

            res.json(surveyList);
        }
        catch (e: any) { returnError(e, res); }
    }

}

export const surveyListController = new SurveyListController();