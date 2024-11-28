import { Router } from 'express';
import { body, param } from 'express-validator';
import { uploadController } from '../controllers/Upload';

const uploadRoutes = Router();

// (C) CREATE
uploadRoutes.post('/',
    uploadController.create
);
// (C) CREATE BASE64
uploadRoutes.post('/base64',
    body('file').isString().notEmpty(),
    body('name').isString().notEmpty(),
    uploadController.base64
);
// DELETE
uploadRoutes.delete('/:url', 
    param('url').notEmpty(),
    uploadController.delete
);

export default uploadRoutes