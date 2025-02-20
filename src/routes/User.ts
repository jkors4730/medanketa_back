import { Router } from 'express';
import { UserController } from '../controllers/User.js';
import { CreateUserDto } from '../dto/users/create.user.dto.js';
import { validateDto } from '../middleware/dto.validate.js';
import { UpdateUserDto } from '../dto/users/update.user.dto.js';
import { Container } from 'typedi';

class UserRoutes {
  router = Router();
  controller = Container.get(UserController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post('/', validateDto(CreateUserDto, 'body'), (req, res) =>
      this.controller.create(req, res),
    );
    this.router.get('/', (req, res) => this.controller.getAll(req, res));
    this.router.get('/:id', (req, res) => this.controller.getOne(req, res));
    this.router.put('/:id', validateDto(UpdateUserDto, 'body'), (req, res) =>
      this.controller.update(req, res),
    );
    this.router.delete('/:id', (req, res) => this.controller.delete(req, res));
  }
}
export default new UserRoutes().router;
