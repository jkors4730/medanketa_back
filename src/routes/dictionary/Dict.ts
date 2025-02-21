import { Router } from 'express';
import {
  DictsController,
  dictsController,
} from '../../controllers/dictionary/Dict.js';
import { Container } from 'typedi';
import { validateDto } from '../../middleware/dto.validate.js';
import { CreateDictDto } from '../../dto/dict/create.dict.dto.js';
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
// // (R) GET_BY_USER
// dictRoutes.get('/user/:id',
//     param('id').isNumeric(),
//     query('common').isBoolean().optional(),
//     query('page').optional().isNumeric(),
//     query('size').optional().isNumeric(),
//     dictsController.getByUser
// );
// // (U) UPDATE
// dictRoutes.put('/:id',
//     param('id').isNumeric(),
//
//     body('title').optional().isString(),
//     body('common').optional().isBoolean(),
//     body('status').optional().isBoolean(),
//     body('userId').optional().isNumeric(),
//     dictsController.update
// );
// // (D) DELETE
// dictRoutes.delete('/:id',
//     param('id').isNumeric(),
//     dictsController.delete
// );
//
// export default dictRoutes
