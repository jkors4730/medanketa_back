import { Router } from 'express';
import { DictsController } from '../controllers/Dict.js';
import { Container } from 'typedi';
import { validateDto } from '../middleware/dto.validate.js';
import { CreateDictDto } from '../dto/dict/create.dict.dto.js';
import { requirePermission } from '../middleware/role.middleware.js';
class DictRoutes {
  router = Router();
  controller = Container.get(DictsController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      '/',
      validateDto(CreateDictDto, 'body'),
      requirePermission('dict:create'),
      (req, res) => this.controller.create(req, res),
    );
    this.router.get('/', (req, res) => this.controller.getAll(req, res));
    this.router.get('/:id', requirePermission('dicts:get'), (req, res) =>
      this.controller.getOne(req, res),
    );
    this.router.get(
      '/values/:id',
      requirePermission('dict-values:get'),
      (req, res) => this.controller.getValuesById(req, res),
    );
    this.router.get('/user/:id', requirePermission('dicts:get'), (req, res) =>
      this.controller.getByUser(req, res),
    );
    this.router.put('/user/:id', requirePermission('dict:update'), (req, res) =>
      this.controller.update(req, res),
    );
    this.router.delete('/:id', requirePermission('dict:delete'), (req, res) =>
      this.controller.delete(req, res),
    );
  }
}
export default new DictRoutes().router;
