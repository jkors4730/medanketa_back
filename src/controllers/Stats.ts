// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Request, Response } from 'express';
// import { validationResult } from 'express-validator';
// import { returnError } from '../utils/error';

// class StatsController {

//     async getBySurvey(req: Request, res: Response) {
//         try {
//             const errors = validationResult(req);
            
//             if ( errors.isEmpty() ) {
//                 const { id } = req.params;

//                 // questions.length = [{"count":"3"}]
//                 // `SELECT COUNT(*) as count FROM survey_questions WHERE "surveyId" = 32;`;

//                 // answers.length = [{"json_array_length":10}]
//                 // SELECT json_array_length(answers) FROM survey_lists WHERE "surveyId" = 60;

//                 // questions.length - answers.length

//                 // Users with timestamp_start = [{"count":"1"}]
//                 // SELECT COUNT("userId") FROM survey_lists WHERE "surveyId" = 73 AND "tsStart" IS NOT null;

//                 // res.status(201).json(survey.toJSON());
//             }
//             else {
//                 returnError(null, res, errors.array() );
//             }
//         }
//         catch (e: any) { returnError(e, res); }
//     }

// }

// export const statsController = new StatsController();
