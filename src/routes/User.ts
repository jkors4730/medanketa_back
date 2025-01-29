import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { userController } from '../controllers/User';
import { body, param } from 'express-validator';

const userRoutes = Router();

// (C) CREATE
userRoutes.post('/',
    body('name').isString().notEmpty(),
    body('email').isEmail(),
    body('password').isString().notEmpty(),
    body('roleName').isString().notEmpty(),
    body('pdAgreement').isBoolean(),

    body('lastName').optional().isString(),
    body('surname').optional().isString(),
    body('birthDate').optional().isString(),
    body('phone').optional().isString(),
    body('region').optional().isString(),
    body('city').optional().isString(),
    body('workPlace').optional().isString(),
    body('specialization').optional().isString(),
    body('position').optional().isString(),
    body('workExperience').optional().isNumeric(),
    body('newsletterAgreement').optional().isBoolean(),
    userController.create
);
// (R) GET_ALL
userRoutes.get('/', userController.getAll);
// (R) GET_ONE
userRoutes.get('/:id',
    param('id').isNumeric(),
    userController.getOne
);
// (U) UPDATE
userRoutes.put('/:id',
    body('name').isString().optional(),
    body('email').isEmail().optional(),
    body('password').isString().optional(),
    body('roleName').isString().optional(),
    body('pdAgreement').isBoolean().optional(),

    body('lastName').isString().optional(),
    body('surname').isString().optional(),
    body('birthDate').isString().optional(),
    body('phone').isString().optional(),
    body('region').isString().optional(),
    body('city').isString().optional(),
    body('workPlace').isString().optional(),
    body('specialization').isString().optional(),
    body('position').isString().optional(),
    body('workExperience').isNumeric().optional(),
    body('newsletterAgreement').isBoolean().optional(),
    userController.update
);
// (D) DELETE 
userRoutes.delete('/:id',
    param('id').isNumeric(),
    userController.delete
);

userRoutes.post('/login',
    body('email').isEmail(),
    body('password').isString().notEmpty(),
    async (req: Request, res: Response) => {
        await userController.login(req, res, false);
    }
);

userRoutes.post('/admin',
    body('email').isEmail(),
    body('password').isString().notEmpty(),
    async (req: Request, res: Response) => {
        await userController.login(req, res, true);
    }
);

userRoutes.get('/protected', authMiddleware, async (req: Request, res: Response) => {
    
    const { tokenData } = req.body;
    console.log('tokenData', tokenData);

    if ( tokenData ) {
        res.send('Access GRANTED');
    } else {
        res.send('Access DENIED');
    }
} );

export default userRoutes;