import { Router } from 'express';
import { surveyController } from '../controllers/Survey';
import { body, param, query } from 'express-validator';

const surveyRoutes = Router();

// (C) CREATE
surveyRoutes.post('/',
    body('userId').isNumeric(),
    body('image').isString().notEmpty(),
    body('title').isString().notEmpty(),
    body('slug').isString().notEmpty(),
    body('status').isBoolean(),
    body('access').optional().isBoolean(),
    body('description').optional().isString(),
    body('expireDate').optional().isDate(),
    body('questions').optional().isArray(),
    body('file').optional().notEmpty(),
    surveyController.create
);
// (R) GET_ALL
surveyRoutes.get('/',
    query('userId').optional().isNumeric(),
    surveyController.getAll);
// (R) GET_ONE
surveyRoutes.get('/:id',
    param('id').isNumeric(),
    query('answers').optional().isBoolean(),
    surveyController.getOne
);
// (R) GET_BY_USER_ID (completed)
surveyRoutes.get('/completed/user/:id',
    param('id').isNumeric(),
    surveyController.getByUserId
);
surveyRoutes.get('/answers/:id',
    surveyController.getUsersBySurveyId
);
// (U) UPDATE
surveyRoutes.put('/:id',
    param('id').isNumeric(),

    body('userId').optional().isNumeric(),
    body('image').optional().isString(),
    body('title').optional().isString(),
    body('slug').optional().isString(),
    body('status').optional().isBoolean(),
    body('access').optional().isBoolean(),
    body('description').optional().isString(),
    body('expireDate').optional().isDate(),
    surveyController.update
);
// (D) DELETE
surveyRoutes.delete('/:id',
    param('id').isNumeric(),
    surveyController.delete
);

export default surveyRoutes;