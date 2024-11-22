import { Router } from 'express';
import { surveyQuestionController } from '../controllers/SurveyQuestion';
import { body, param } from 'express-validator';

const surveyQuestionRoutes = Router();

// (C) CREATE
surveyQuestionRoutes.post('/',
    body('questions').isArray(),
    surveyQuestionController.create
);
// (R) GET_ALL
surveyQuestionRoutes.get('/', surveyQuestionController.getAll);
// (R) GET_ONE
surveyQuestionRoutes.get('/:id',
    param('id').isNumeric(),
    surveyQuestionController.getOne
);
// (U) UPDATE
surveyQuestionRoutes.put('/:id', 
    body('surveyId').optional().isNumeric(),
    body('question').optional().isString().isLength({ min: 1 }),
    body('type').optional().isString().isLength({ min: 1 }),
    body('status').optional().isBoolean(),

    body('description').optional().isString().isLength({ min: 1 }),
    body('data').optional().isString().isLength({ min: 1 }),
    surveyQuestionController.update
);
// (D) DELETE
surveyQuestionRoutes.delete('/:id',
    param('id').isNumeric(),
    surveyQuestionController.delete
);

export default surveyQuestionRoutes;