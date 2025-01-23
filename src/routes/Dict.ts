import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { dictsController } from '../controllers/Dict';

const dictRoutes = Router();

// (C) CREATE
dictRoutes.post('/',
    body('title').isString().notEmpty(),
    body('description').optional().isString(),
    body('common').isBoolean(),
    body('status').isBoolean(),
    body('userId').isNumeric(),
    body('values').optional().isArray(),
    dictsController.create
);
// (R) GET_VALUES_FILTER
dictRoutes.get('/:id',
    param('id').isNumeric(),
    dictsController.getOne
);
// (R) GET_VALUES_FILTER
dictRoutes.get('/values/:id',
    param('id').isNumeric(),
    query('q').isString(),
    dictsController.getValuesById
);
// (R) GET_BY_USER
dictRoutes.get('/user/:id',
    param('id').isNumeric(),
    query('common').isBoolean().optional(),
    query('page').optional().isNumeric(),
    query('size').optional().isNumeric(),
    dictsController.getByUser
);
// (U) UPDATE
dictRoutes.put('/:id',
    param('id').isNumeric(),

    body('title').optional().isString(),
    body('common').optional().isBoolean(),
    body('status').optional().isBoolean(),
    body('userId').optional().isNumeric(),
    dictsController.update
);
// (D) DELETE
dictRoutes.delete('/:id',
    param('id').isNumeric(),
    dictsController.delete
);

export default dictRoutes
