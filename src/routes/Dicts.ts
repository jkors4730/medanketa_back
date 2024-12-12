import { Router } from 'express';
import { param, query } from 'express-validator';
import { dictsController } from '../controllers/Dicts';

const dictsRoutes = Router();

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

export default dictsRoutes
