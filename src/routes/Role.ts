import { Router } from 'express';
import { roleController } from '../controllers/Role';
import { body, param } from 'express-validator';

const roleRoutes = Router();

// (C) CREATE
roleRoutes.post('/',
    body('name').isString().isLength({ min: 1 }),
    body('guardName').isString().isLength({ min: 1 }),
    roleController.create
);
// (R) GET_ALL
roleRoutes.get('/', roleController.getAll);
// (R) GET_ONE
roleRoutes.get('/:id',
    param('id').isNumeric(),
    roleController.getOne
);
// (U) UPDATE
roleRoutes.put('/:id',
    param('id').isNumeric(),

    body('name').optional().isString().isLength({ min: 1 }),
    body('guardName').optional().isString().isLength({ min: 1 }),
    roleController.update
);
// DELETE
roleRoutes.delete('/:id', 
    param('id').isNumeric(),
    roleController.delete
);

export default roleRoutes