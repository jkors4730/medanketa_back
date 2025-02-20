import { Router } from 'express';
import { DictsController } from '../controllers/Dict.js';
import { Container } from 'typedi';
import { validateDto } from '../middleware/dto.validate.js';
import { CreateDictDto } from '../dto/dict/create.dict.dto.js';
class DictRoutes {
  router = Router();
  controller = Container.get(DictsController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post('/', validateDto(CreateDictDto, 'body'), (req, res) =>
      this.controller.create(req, res),
    );
    this.router.get('/:id', (req, res) => this.controller.getOne(req, res));
    this.router.get('/values/:id', (req, res) =>
      this.controller.getValuesById(req, res),
    );
    this.router.get('/user/:id', (req, res) =>
      this.controller.getByUser(req, res),
    );
    this.router.put('/user/:id', (req, res) =>
      this.controller.update(req, res),
    );
    this.router.delete('/:id', (req, res) => this.controller.delete(req, res));
  }
}
export default new DictRoutes().router;
