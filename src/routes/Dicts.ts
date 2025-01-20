import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { dictsController } from '../controllers/Dicts';

const dictsRoutes = Router();

// (C) CREATE
dictsRoutes.post('/',
    body('title').isString().notEmpty(),
    body('description').optional().isString(),
    body('common').isBoolean(),
    body('status').isBoolean(),
    body('userId').isNumeric(),
    body('values').optional().isArray(),
    dictsController.create
);
// (R) GET_VALUES_FILTER
dictsRoutes.get('/:id',
    param('id').isNumeric(),
    dictsController.getOne
);
// (R) GET_VALUES_FILTER
dictsRoutes.get('/values/:id',
    param('id').isNumeric(),
    query('q').isString(),
    dictsController.getValuesById
);
// (R) GET_BY_USER
dictsRoutes.get('/user/:id',
    param('id').isNumeric(),
    query('common').isBoolean().optional(),
    dictsController.getByUser
);
// (U) UPDATE
dictsRoutes.put('/:id',
    param('id').isNumeric(),

    body('title').optional().isString(),
    body('common').optional().isBoolean(),
    body('status').optional().isBoolean(),
    body('userId').optional().isNumeric(),
    dictsController.update
);
// (D) DELETE
dictsRoutes.delete('/:id',
    param('id').isNumeric(),
    dictsController.delete
);

export default dictsRoutes
