import { Router } from 'express';
import { surveyQuestionController } from '../controllers/SurveyQuestion';
import { body, param, query } from 'express-validator';

const surveyQuestionRoutes = Router();

// (C) CREATE
surveyQuestionRoutes.post('/',
    body('questions').isArray(),
    surveyQuestionController.create
);
// (R) GET_ALL
surveyQuestionRoutes.get('/',
    query('surveyId').optional().isNumeric(),
    surveyQuestionController.getAll
);
// (R) GET_ONE
surveyQuestionRoutes.get('/:id',
    param('id').isNumeric(),
    surveyQuestionController.getOne
);
// (U) UPDATE
surveyQuestionRoutes.put('/:id', 
    body('surveyId').optional().isNumeric(),
    body('question').optional().isString(),
    body('type').optional().isString(),
    body('status').optional().isBoolean(),

    body('description').optional().isString(),
    body('data').optional().isString(),
    surveyQuestionController.update
);
// (D) DELETE
surveyQuestionRoutes.delete('/:id',
    param('id').isNumeric(),
    surveyQuestionController.delete
);

export default surveyQuestionRoutes;