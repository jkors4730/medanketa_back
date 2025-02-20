import { Router } from 'express';
import { RegController } from '../controllers/Reg.js';
import { Container } from 'typedi';

class RegRoutes {
  router = Router();
  controller = Container.get(RegController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.get('/regions', (req, res) =>
      this.controller.getRegions(req, res),
    );
    this.router.get('/cities', (req, res) =>
      this.controller.getCities(req, res),
    );
  }
}
export default new RegRoutes().router;
