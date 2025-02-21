import { Router } from 'express';
import { RoleController } from '../../controllers/Role.js';
import { Container } from 'typedi';

class RoleRoutes {
  router = Router();
  controller = Container.get(RoleController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post('/', (req, res) => this.controller.create(req, res));
    this.router.get('/', (req, res) => this.controller.getAll(req, res));
    this.router.get('/:id', (req, res) => this.controller.getOne(req, res));
    this.router.put('/:id', (req, res) => this.controller.update(req, res));
    this.router.delete('/:id', (req, res) => this.controller.delete(req, res));
  }
}
export default new RoleRoutes().router;
