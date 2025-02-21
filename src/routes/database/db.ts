import { Router, Request, Response } from 'express';
import { DbController } from '../../controllers/database/Db.js';
import { Container } from 'typedi';

class DbRoutes {
  router = Router();
  controller = Container.get(DbController);

  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post('dropDb', (req, res) => this.controller.dropDb(req, res));
  }
}
export default new DbRoutes().router;
