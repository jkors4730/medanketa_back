import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { surveyListController } from '../controllers/SurveyList';

const surveyListRoutes = Router();

// (C) CREATE
surveyListRoutes.post('/',
    body('surveyId').isNumeric(),
    body('userId').optional().isNumeric(),
    body('privacy').optional().isBoolean(),
    body('answers').optional().isArray(),
    body('tsStart').optional().isISO8601(),
    body('tsEnd').optional().isISO8601(),
    surveyListController.create
);
// (R) GET_ALL
surveyListRoutes.get('/',
    query('userId').optional().isNumeric(),
    surveyListController.getAll
);
// (R) GET_ONE
surveyListRoutes.get('/user/:id',
    param('id').isNumeric(),
    query('surveyId').isNumeric(),
    surveyListController.getOne
);

export default surveyListRoutes;