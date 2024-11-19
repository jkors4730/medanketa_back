import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { userController } from '../controllers/User';
import { body, param } from 'express-validator';

const userRoutes = Router();

// (C) CREATE
userRoutes.post('/',
    body('email').isEmail(),
    body('password').isString().isLength({ min: 1 }),
    body('name').isString().isLength({ min: 1 }),
    body('roleName').isString().isLength({ min: 1 }),
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
    param('id').isNumeric(),
    body('title').isString().isLength({ min: 1 }),
    body('email').isEmail(),
    body('password').isString().isLength({ min: 1 }),
    userController.update
);
// (D) DELETE 
userRoutes.delete('/:id',
    param('id').isNumeric(),
    userController.delete
);

userRoutes.post('/login',
    body('email').isEmail(),
    body('password').isString().isLength({ min: 1 }),
    userController.login
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