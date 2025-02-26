import { type Request, type Response, Router } from 'express';
import { AuthController } from '../controllers/Auth.js';
import { Container } from 'typedi';
import { validateDto } from '../middleware/dto.validate.js';
import { LoginUserDto } from '../dto/users/login.user.dto.js';

export class AuthRoutes {
  router = Router();
  controller = new AuthController();
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
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
    this.router.post('/ban', (req: Request, res: Response) =>
      this.controller.setBlockStatusUser(req, res),
    );
  }
}
export default new AuthRoutes().router;
