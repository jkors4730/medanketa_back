import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { dictValuesController } from '../controllers/DictValue';

const dictValueRoutes = Router();

// (C) CREATE
dictValueRoutes.post('/',
    body('value').isString().notEmpty(),
    body('dictId').isNumeric(),
    body('sortId').optional().isNumeric(),
    dictValuesController.create
);
// (R) GET_VALUES
dictValueRoutes.get('/:id',
    param('id').isNumeric(),
    dictValuesController.getOne
);
// (R) GET_BY_DICT
dictValueRoutes.get('/dict/:id',
    param('id').isNumeric(),
    query('q').optional().isString(),
    query('page').optional().isNumeric(),
    query('size').optional().isNumeric(),
    dictValuesController.getByDictId
);
// (U) UPDATE_BULK
dictValueRoutes.put('/bulk',
    body('values').isArray(),
    dictValuesController.updateBulk
);
// (U) UPDATE
dictValueRoutes.put('/:id',
    param('id').isNumeric(),

    body('value').optional().isString(),
    body('dictId').optional().isNumeric(),
    body('sortId').optional().isNumeric(),
    dictValuesController.update
);
// (D) DELETE
dictValueRoutes.delete('/:id',
    param('id').isNumeric(),
    dictValuesController.delete
);

export default dictValueRoutes
