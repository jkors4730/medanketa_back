import { Router } from 'express';
import { DictValuesController } from '../controllers/DictValue.js';
import { Container } from 'typedi';
class DictValueRoutes {
  router = Router();
  controller = Container.get(DictValuesController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post('/', (req, res) => this.controller.create(req, res));
    this.router.get('/:id', (req, res) => this.controller.getOne(req, res));
    this.router.get('/dict/:id', (req, res) =>
      this.controller.getByDictId(req, res),
    );
    this.router.put('/bulk', (req, res) =>
      this.controller.updateBulk(req, res),
    );
    this.router.put('/:id', (req, res) => this.controller.update(req, res));
    this.router.delete('/:id', (req, res) => this.controller.delete(req, res));
  }
}
export default new DictValueRoutes().router;
