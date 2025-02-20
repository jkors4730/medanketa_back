import { Router } from 'express';
import { RoleController, roleController } from '../controllers/Role.js';
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
// const roleRoutes = Router();
//
// // (C) CREATE
// roleRoutes.post('/',
//     body('name').isString().notEmpty(),
//     body('guardName').isString().notEmpty(),
//     roleController.create
// );
// // (R) GET_ALL
// roleRoutes.get('/', roleController.getAll);
// // (R) GET_ONE
// roleRoutes.get('/:id',
//     param('id').isNumeric(),
//     roleController.getOne
// );
// // (U) UPDATE
// roleRoutes.put('/:id',
//     param('id').isNumeric(),
//
//     body('name').optional().isString(),
//     body('guardName').optional().isString(),
//     roleController.update
// );
// // DELETE
// roleRoutes.delete('/:id',
//     param('id').isNumeric(),
//     roleController.delete
// );
//
// export default roleRoutes
