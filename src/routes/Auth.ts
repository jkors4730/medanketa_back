import type { Response, Request } from 'express';
import { Router } from 'express';
import { Container } from 'typedi';
import { AuthController } from '../controllers/Auth.js';
import { validateDto } from '../middleware/dto.validate.js';
import { LoginUserDto } from '../dto/users/login.user.dto.js';
import { requirePermission } from '../middleware/role.middleware.js';

class AuthRoutes {
  router = Router();
  controller = Container.get(AuthController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post('/registration', (req: Request, res: Response) =>
      this.controller.registration(req, res),
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
    this.router.post('/block', (req: Request, res: Response) =>
      this.controller.block(req, res),
    );
  }
}
export default new AuthRoutes().router;
