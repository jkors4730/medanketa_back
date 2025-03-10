import { Router } from 'express';
import type { Request, Response } from 'express';
import { UserController } from '../controllers/User.js';
import { CreateUserDto } from '../dto/users/create.user.dto.js';
import { validateDto } from '../middleware/dto.validate.js';
import { UpdateUserDto } from '../dto/users/update.user.dto.js';
import { Container } from 'typedi';
import { requirePermission } from '../middleware/role.middleware.js';

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
      requirePermission('user:create'),
      (req: Request, res: Response) => this.controller.create(req, res),
    );
    this.router.get(
      '/',
      requirePermission('users:get'),
      (req: Request, res: Response) => this.controller.getAll(req, res),
    );
    this.router.get(
      '/:id',
      requirePermission('users:get'),
      (req: Request, res: Response) => this.controller.getOne(req, res),
    );
    this.router.put(
      '/:id',
      validateDto(UpdateUserDto, 'body'),
      requirePermission('user:update'),
      (req: Request, res: Response) => this.controller.update(req, res),
    );
    this.router.delete(
      '/:id',
      requirePermission('user:delete'),
      (req: Request, res: Response) => this.controller.delete(req, res),
    );
  }
}
export default new UserRoutes().router;
