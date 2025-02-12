import { Router } from 'express';
import { emailController } from '../controllers/Email';
import { body } from 'express-validator';

const emailRoutes = Router();

emailRoutes.post('/support',
    body('message').isString(),
    emailController.support
);

emailRoutes.post('/password-recovery',
    body('login').isString(),
    emailController.support
);

export default emailRoutes;
