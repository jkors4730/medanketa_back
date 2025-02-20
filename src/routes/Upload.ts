import { Router } from 'express';
import { UploadController } from '../controllers/Upload.js';
import { Container } from 'typedi';
import { CreateUploadFile64Dto } from '../dto/create.uploadFile64.dto.js';
import { validateDto } from '../middleware/dto.validate.js';

class UploadRoutes {
  router = Router();
  controller = Container.get(UploadController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post('/', (req, res) => this.controller.create(req, res));
    this.router.post(
      '/base64',
      validateDto(CreateUploadFile64Dto, 'body'),
      (req, res) => this.controller.base64(req, res),
    );
    this.router.delete('/:url', (req, res) => this.controller.delete(req, res));
  }
}
export default new UploadRoutes().router;
