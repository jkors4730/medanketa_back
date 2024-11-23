import { Router } from 'express';
import { surveyController } from '../controllers/Survey';
import { body, param } from 'express-validator';

const surveyRoutes = Router();

// (C) CREATE
surveyRoutes.post('/',
    body('userId').isNumeric(),
    body('image').isString().isLength({ min: 1 }),
    body('title').isString().isLength({ min: 1 }),
    body('slug').isString().isLength({ min: 1 }),
    body('status').isBoolean(),
    body('description').optional().isString(),
    body('expireDate').optional().isDate(),
    body('questions').optional().isArray(),
    surveyController.create
);
// (R) GET_ALL
surveyRoutes.get('/', surveyController.getAll);
// (R) GET_ONE
surveyRoutes.get('/:id',
    param('id').isNumeric(),
    surveyController.getOne
);
// (U) UPDATE
surveyRoutes.put('/:id',
    param('id').isNumeric(),

    body('userId').optional().isNumeric(),
    body('image').optional().isString(),
    body('title').optional().isString(),
    body('slug').optional().isString(),
    body('status').optional().isBoolean(),
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