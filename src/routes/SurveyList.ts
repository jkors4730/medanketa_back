import { Router } from 'express';
import { SurveyListController } from '../controllers/SurveyList.js';
import { CreateSurveysListDto } from '../dto/survey-list/create.survey-list.dto.js';
import { validateDto } from '../middleware/dto.validate.js';
import { Container } from 'typedi';
class SurveyListRoutes {
  router = Router();
  controller = new SurveyListController();
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      '/',
      validateDto(CreateSurveysListDto, 'body'),
      (req, res) => this.controller.create(req, res),
    );
    this.router.get('/', (req, res) => this.controller.getAll(req, res));
    this.router.get('/user/:id', (req, res) =>
      this.controller.getOne(req, res),
    );
  }
}
export default new SurveyListRoutes().router;
