import { Router } from 'express';
import type { Request, Response } from 'express';
import { Container } from 'typedi';
import { UserController } from '../../controllers/User.js';
import { validateDto } from '../../middleware/dto.validate.js';
import { CreateUserDto } from '../../dto/users/create.user.dto.js';
import { UpdateUserDto } from '../../dto/users/update.user.dto.js';
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
  }
}
export default new UserRoutes().router;
