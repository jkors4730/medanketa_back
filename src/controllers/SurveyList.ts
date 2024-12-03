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
                const { userId, surveyId, answers, privacy } = req.body;

                const exists = await SurveyList.findOne<any>({ where: { surveyId: surveyId } });
                console.log('exists', exists);

                if ( !exists ) {
                    const surveyList = SurveyList.build<any>({
                        userId, surveyId, answers, privacy
                    });
    
                    console.log( 'SurveyList', surveyList.toJSON() );
    
                    await surveyList.save();
    
                    res.status(201).json(surveyList.toJSON());
                }
                else if (answers) {
                    console.log(typeof answers);
                    exists.answers = answers;
                    await exists.save();

                    res.status(200).json(exists.toJSON());
                }
                else if (privacy) {
                    exists.privacy = privacy;
                    await exists.save();

                    res.status(200).json(exists.toJSON());
                }
                else {
                    returnError(null, res, [`Survey id=${surveyId} already exists in SurveyList!`] );
                }
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