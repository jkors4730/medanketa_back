import { Router } from 'express';
import { surveyController } from '../controllers/Survey';
import { body, param } from 'express-validator';

const surveyRoutes = Router();

// CREATE (C)
surveyRoutes.post('/',
    body('userId').isNumeric(),
    body('image').isString().isLength({ min: 1 }),
    body('title').isString().isLength({ min: 1 }),
    body('slug').isString().isLength({ min: 1 }),
    body('status').isBoolean(),
    body('description').optional().isString().isLength({ min: 1 }),
    body('expireDate').optional().isDate(),
    surveyController.create
);
// GET_ALL (R)
surveyRoutes.get('/', surveyController.getAll);
// GET_ONE (R)
surveyRoutes.get('/:id',
    param('id').isNumeric(),
    surveyController.getOne
);
// UPDATE (U)
surveyRoutes.put('/:id',
    param('id').isNumeric(),

    body('userId').optional().isNumeric(),
    body('image').optional().isString().isLength({ min: 1 }),
    body('title').optional().isString().isLength({ min: 1 }),
    body('slug').optional().isString().isLength({ min: 1 }),
    body('status').optional().isBoolean(),
    body('description').optional().isString().isLength({ min: 1 }),
    body('expireDate').optional().isDate(),
    surveyController.update
);
// DELETE (D)
surveyRoutes.delete('/:id',
    param('id').isNumeric(),
    surveyController.delete
);

export default surveyRoutes;