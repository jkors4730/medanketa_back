import { Router } from 'express';
import type { Request, Response } from 'express';
import { RegController } from '../controllers/Reg.js';
import { Container } from 'typedi';

class RegRoutes {
  router = Router();
  controller = Container.get(RegController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.get('/regions', (req: Request, res: Response) =>
      this.controller.getRegions(req, res),
    );
    this.router.get('/cities', (req: Request, res: Response) =>
      this.controller.getCities(req, res),
    );
    this.router.get('/spec', (req: Request, res: Response) =>
      this.controller.getSpec(req, res),
    );
  }
}
export default new RegRoutes().router;
