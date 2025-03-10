import { Router } from 'express';
import { DictValuesController } from '../controllers/DictValue.js';
import { Container } from 'typedi';
import { requirePermission } from '../middleware/role.middleware.js';
class DictValueRoutes {
  router = Router();
  controller = Container.get(DictValuesController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post('/', requirePermission('dict-value:create'), (req, res) =>
      this.controller.create(req, res),
    );
    this.router.get('/:id', requirePermission('dict-values:get'), (req, res) =>
      this.controller.getOne(req, res),
    );
    this.router.get(
      '/dict/:id',
      requirePermission('dict-values:get'),
      (req, res) => this.controller.getByDictId(req, res),
    );
    this.router.put(
      '/bulk',
      requirePermission('dict-value:update'),
      (req, res) => this.controller.updateBulk(req, res),
    );
    this.router.put(
      '/:id',
      requirePermission('dict-value:update'),
      (req, res) => this.controller.update(req, res),
    );
    this.router.delete(
      '/:id',
      requirePermission('dict-value:delete'),
      (req, res) => this.controller.delete(req, res),
    );
  }
}
export default new DictValueRoutes().router;
