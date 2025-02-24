import { Router } from 'express';

import { Container } from 'typedi';
import { SurveyController } from '../../controllers/survey/Survey.js';
import { validateDto } from '../../middleware/dto.validate.js';
import { CreateSurveyDto } from '../../dto/survey/create.survey.dto.js';
import { UpdateSurveyDto } from '../../dto/survey/update.survey.dto.js';

//TODO обновить валидацию параметров и query
class SurveyRoutes {
  router = Router();
  controller = Container.get(SurveyController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post('/', validateDto(CreateSurveyDto, 'body'), (req, res) =>
      this.controller.create(req, res),
    );
    this.router.get('/', (req, res) => this.controller.getAll(req, res));
    this.router.get('/:id', (req, res) => this.controller.getOne(req, res));
    this.router.get('/completed/user/:id', (req, res) =>
      this.controller.getByUserId(req, res),
    );
    this.router.get('/answers/:id', (req, res) =>
      this.controller.getUsersBySurveyId(req, res),
    );
    this.router.put('/:id', validateDto(UpdateSurveyDto, 'body'), (req, res) =>
      this.controller.update(req, res),
    );
    this.router.delete('/:id', (req, res) => this.controller.delete(req, res));
  }
}
export default new SurveyRoutes().router;
