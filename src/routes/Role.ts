import { Router } from 'express';
import type { Request, Response } from 'express';
import { RoleController } from '../controllers/Role.js';
import { Container } from 'typedi';
import { requirePermission } from '../middleware/role.middleware.js';

class RoleRoutes {
  router = Router();
  controller = Container.get(RoleController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      '/',
      requirePermission('role:create'),
      (req: Request, res: Response) => this.controller.create(req, res),
    );
    this.router.get(
      '/',
      requirePermission('roles:get'),
      (req: Request, res: Response) => this.controller.getAll(req, res),
    );
    this.router.get(
      '/:id',
      requirePermission('roles:get'),
      (req: Request, res: Response) => this.controller.getOne(req, res),
    );
    this.router.put(
      '/:id',
      requirePermission('role:update'),
      (req: Request, res: Response) => this.controller.update(req, res),
    );
    this.router.delete(
      '/',
      requirePermission('role:delete'),
      (req: Request, res: Response) => this.controller.delete(req, res),
    );
    this.router.patch(
      '/change',
      requirePermission('user:update'),
      (req: Request, res: Response) =>
        this.controller.changeRoleOnUser(req, res),
    );
  }
}
export default new RoleRoutes().router;
