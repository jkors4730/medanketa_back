import { Router } from 'express';
import type { Request, Response } from 'express';
import { RoleController } from '../controllers/Role.js';
import { Container } from 'typedi';

class RoleRoutes {
  router = Router();
  controller = Container.get(RoleController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post('/', (req: Request, res: Response) =>
      this.controller.create(req, res),
    );
    this.router.get('/', (req: Request, res: Response) =>
      this.controller.getAll(req, res),
    );
    this.router.get('/:id', (req: Request, res: Response) =>
      this.controller.getOne(req, res),
    );
    this.router.put('/:id', (req: Request, res: Response) =>
      this.controller.update(req, res),
    );
    this.router.delete('/:id', (req: Request, res: Response) =>
      this.controller.delete(req, res),
    );
  }
}
export default new RoleRoutes().router;
