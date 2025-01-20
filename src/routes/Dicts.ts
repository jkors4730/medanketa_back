import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { dictsController } from '../controllers/Dicts';

const dictsRoutes = Router();

// (C) CREATE
dictsRoutes.post('/',
    body('title').isString().notEmpty(),
    body('common').isBoolean(),
    body('status').isBoolean(),
    body('userId').isNumeric(),
    dictsController.create
);

// (R) GET_ALL
dictsRoutes.get('/',
    dictsController.getAll
);

// (R) GET_ONE
dictsRoutes.get('/:id',
    param('id').isNumeric(),
    query('q').isString(),
    dictsController.getById
);

// (R) GET_BY_USER
dictsRoutes.get('/user/:id',
    param('id').isNumeric(),
    query('common').isBoolean().optional(),
    dictsController.getByUser
);

export default dictsRoutes
