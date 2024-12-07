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
                const { userId, surveyId, answers, privacy, tsStart, tsEnd } = req.body;

                const exists = await SurveyList.findOne<any>({
                    where: {
                        surveyId: surveyId,
                        userId: userId
                    } });
                console.log('exists', exists);

                if ( !exists ) {
                    const surveyList = SurveyList.build<any>({
                        userId, surveyId, answers, privacy, tsStart, tsEnd
                    });
    
                    console.log( 'SurveyList', surveyList.toJSON() );
    
                    await surveyList.save();
    
                    res.status(201).json(surveyList.toJSON());
                }
                else {
                    let count = 0;

                    if (answers) {
                        count++;
                        exists.answers = answers;
                        await exists.save();
                    }
                    if (typeof privacy == 'boolean') {
                        count++;
                        exists.privacy = privacy;
                        await exists.save();
                    }
                    if (tsStart && exists.tsStart == null) {
                        count++;
                        exists.tsStart = tsStart;
                        await exists.save();
                    }
                    if (tsEnd && exists.tsEnd == null) {
                        count++;
                        console.log('here', tsEnd)
                        exists.tsEnd = tsEnd;
                        await exists.save();
                    }

                    if (count) {
                        res.status(200).json(exists.toJSON());
                    }
                    else {
                        returnError(null, res, [`Survey id=${surveyId} already exists in SurveyList!`] );
                    }
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

    async getOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { surveyId } = req.query;
            
            const surveyList = await SurveyList.findAll( { where: { userId: id, surveyId } });

            res.json(surveyList.length ? surveyList[0] : {});
        }
        catch (e: any) { returnError(e, res); }
    }

}

export const surveyListController = new SurveyListController();