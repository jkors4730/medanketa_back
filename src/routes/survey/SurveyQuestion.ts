import { Router } from 'express';

import { Container } from 'typedi';
import { SurveyQuestionController } from '../../controllers/survey/SurveyQuestion.js';
import { validateDto } from '../../middleware/dto.validate.js';
import { CreateSurveysQuestionsDto } from '../../dto/survey-questions/create.survey-questions.dto.js';
import { UpdateSurveyDto } from '../../dto/survey/update.survey.dto.js';

class SurveyQuestionRoutes {
  router = Router();
  controller = Container.get(SurveyQuestionController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      '/',
      validateDto(CreateSurveysQuestionsDto, 'body'),
      (req, res) => this.controller.create(req, res),
    );
    this.router.get('/', (req, res) => this.controller.getAll(req, res));
    this.router.get('/:id', (req, res) => this.controller.getOne(req, res));
    this.router.put('/:id', validateDto(UpdateSurveyDto, 'body'), (req, res) =>
      this.controller.update(req, res),
    );
    this.router.delete('/:id', (req, res) => this.controller.delete(req, res));
  }
}
export default new SurveyQuestionRoutes().router;
