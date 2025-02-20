import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { UserController, userController } from '../controllers/User.js';
import { CreateUserDto } from '../dto/users/create.user.dto.js';
import { validateDto } from '../middleware/dto.validate.js';
import { UpdateUserDto } from '../dto/users/update.user.dto.js';
import { Container } from 'typedi';

class UserRoutes {
  router = Router();
  controller = Container.get(UserController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post('/', validateDto(CreateUserDto, 'body'), (req, res) =>
      this.controller.create(req, res),
    );
    this.router.get('/', (req, res) => this.controller.getAll(req, res));
    this.router.get('/:id', (req, res) => this.controller.getOne(req, res));
    this.router.put('/:id', validateDto(UpdateUserDto, 'body'), (req, res) =>
      this.controller.update(req, res),
    );
    this.router.delete('/:id', (req, res) => this.controller.delete(req, res));
  }
}
export default new UserRoutes().router;
// const userRoutes = Router();
//
// // (C) CREATE
// userRoutes.post('/',
//
// );
// // (R) GET_ALL
// userRoutes.get('/', userController.getAll);
// // (R) GET_ONE
// userRoutes.get('/:id',
//     param('id').isNumeric(),
//     userController.getOne
// );
// // (U) UPDATE
// userRoutes.put('/:id',
//     body('name').isString().optional(),
//     body('email').isEmail().optional(),
//     body('password').isString().optional(),
//     body('roleName').isString().optional(),
//     body('pdAgreement').isBoolean().optional(),
//
//     body('lastName').isString().optional(),
//     body('surname').isString().optional(),
//     body('birthDate').isString().optional(),
//     body('phone').isString().optional(),
//     body('region').isString().optional(),
//     body('city').isString().optional(),
//     body('workPlace').isString().optional(),
//     body('specialization').isString().optional(),
//     body('position').isString().optional(),
//     body('workExperience').isNumeric().optional(),
//     body('newsletterAgreement').isBoolean().optional(),
//     userController.update
// );
// // (D) DELETE
// userRoutes.delete('/:id',
//     param('id').isNumeric(),
//     userController.delete
// );
//TODO админку, авторизацию и аутентификацию вынести в отдельный authService

// userRoutes.post('/login',
//     body('email').isEmail(),
//     body('password').isString().notEmpty(),
//     async (req: Request, res: Response) => {
//         await userController.login(req, res, false);
//     }
// );
//
// userRoutes.post('/admin',
//     body('email').isEmail(),
//     body('password').isString().notEmpty(),
//     async (req: Request, res: Response) => {
//         await userController.login(req, res, true);
//     }
// );
//
// userRoutes.get('/protected', authMiddleware, async (req: Request, res: Response) => {
//
//     const { tokenData } = req.body;
//     console.log('tokenData', tokenData);
//
//     if ( tokenData ) {
//         res.send('Access GRANTED');
//     } else {
//         res.send('Access DENIED');
//     }
// } );
//
// export default userRoutes;
