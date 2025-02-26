import { Router } from 'express';
import type { Request, Response } from 'express';
import { UserController } from '../controllers/User.js';
import { CreateUserDto } from '../dto/users/create.user.dto.js';
import { validateDto } from '../middleware/dto.validate.js';
import { UpdateUserDto } from '../dto/users/update.user.dto.js';
import { Container } from 'typedi';
import { LoginUserDto } from '../dto/users/login.user.dto.js';

class UserRoutes {
  router = Router();
  controller = Container.get(UserController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      '/',
      validateDto(CreateUserDto, 'body'),
      (req: Request, res: Response) => this.controller.create(req, res),
    );
    this.router.get('/', (req: Request, res: Response) =>
      this.controller.getAll(req, res),
    );
    this.router.get('/:id', (req: Request, res: Response) =>
      this.controller.getOne(req, res),
    );
    this.router.put(
      '/:id',
      validateDto(UpdateUserDto, 'body'),
      (req: Request, res: Response) => this.controller.update(req, res),
    );
    this.router.delete('/:id', (req: Request, res: Response) =>
      this.controller.delete(req, res),
    );
    this.router.post(
      '/login',
      validateDto(LoginUserDto, 'body'),
      (req: Request, res: Response) => this.controller.login(req, res, false),
    );
    this.router.post(
      '/admin',
      validateDto(LoginUserDto, 'body'),
      (req: Request, res: Response) => this.controller.login(req, res, true),
    );
  }
}
export default new UserRoutes().router;
