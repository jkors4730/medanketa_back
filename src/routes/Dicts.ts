import { Router } from 'express';
import { param } from 'express-validator';
import { dictsController } from '../controllers/Dicts';

const dictsRoutes = Router();

// (R) GET_ALL
dictsRoutes.get('/',
    dictsController.getAll
);

// (R) GET_ONE
dictsRoutes.get('/:id',
    param('id').isNumeric(),
    dictsController.getById
);

export default dictsRoutes
