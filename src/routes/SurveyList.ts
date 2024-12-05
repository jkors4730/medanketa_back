import { Router } from 'express';
import { body, query } from 'express-validator';
import { surveyListController } from '../controllers/SurveyList';

const surveyListRoutes = Router();

// (C) CREATE
surveyListRoutes.post('/',
    body('userId').optional().isNumeric(),
    body('surveyId').isNumeric(),
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

export default surveyListRoutes;