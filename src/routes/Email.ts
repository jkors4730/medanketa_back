import { Router } from 'express';
import { emailController } from '../controllers/Email';
import { body } from 'express-validator';

const emailRoutes = Router();

emailRoutes.post('/support',
    body('message').isString(),
    body('email').isString(),
    emailController.support
);

emailRoutes.post('/password-recovery',
    body('email').isString(),
    emailController.passwordRecovery
);

export default emailRoutes;
