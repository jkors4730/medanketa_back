import { Router } from 'express';
import {
  DictValuesController,
  dictValuesController,
} from '../controllers/DictValue.js';
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
// const dictValueRoutes = Router();
//
// // (C) CREATE
// dictValueRoutes.post('/',
//     body('value').isString().notEmpty(),
//     body('dictId').isNumeric(),
//     body('sortId').optional().isNumeric(),
//     dictValuesController.create
// );
// // (R) GET_VALUES
// dictValueRoutes.get('/:id',
//     param('id').isNumeric(),
//     dictValuesController.getOne
// );
// // (R) GET_BY_DICT
// dictValueRoutes.get('/dict/:id',
//     param('id').isNumeric(),
//     query('q').optional().isString(),
//     query('page').optional().isNumeric(),
//     query('size').optional().isNumeric(),
//     dictValuesController.getByDictId
// );
// // (U) UPDATE_BULK
// dictValueRoutes.put('/bulk',
//     body('values').isArray(),
//     dictValuesController.updateBulk
// );
// // (U) UPDATE
// dictValueRoutes.put('/:id',
//     param('id').isNumeric(),
//
//     body('value').optional().isString(),
//     body('dictId').optional().isNumeric(),
//     body('sortId').optional().isNumeric(),
//     dictValuesController.update
// );
// // (D) DELETE
// dictValueRoutes.delete('/:id',
//     param('id').isNumeric(),
//     dictValuesController.delete
// );
//
// export default dictValueRoutes
