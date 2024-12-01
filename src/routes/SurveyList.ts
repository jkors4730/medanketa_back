import { Router } from 'express';
import { body, query } from 'express-validator';
import { surveyListController } from '../controllers/SurveyList';

const surveyListRoutes = Router();

// (C) CREATE
surveyListRoutes.post('/',
    body('userId').isNumeric(),
    body('surveyId').isNumeric(),
    surveyListController.create
);
// (R) GET_ALL
surveyListRoutes.get('/',
    query('userId').optional().isNumeric(),
    surveyListController.getAll
);

export default surveyListRoutes;