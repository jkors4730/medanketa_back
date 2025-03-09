import { Router } from 'express';
import type { Request, Response } from 'express';
import { SurveyQuestionController } from '../controllers/SurveyQuestion.js';
import { Container } from 'typedi';
import { CreateSurveysQuestionsDto } from '../dto/survey-questions/create.survey-questions.dto.js';
import { validateDto } from '../middleware/dto.validate.js';
import { UpdateSurveyDto } from '../dto/survey/update.survey.dto.js';

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
    this.router.get('/', (req: Request, res: Response) =>
      this.controller.getAll(req, res),
    );
    this.router.get('/:id', (req: Request, res: Response) =>
      this.controller.getOne(req, res),
    );
    this.router.put(
      '/:id',
      validateDto(UpdateSurveyDto, 'body'),
      (req: Request, res: Response) => this.controller.update(req, res),
    );
    this.router.delete('/:id', (req: Request, res: Response) =>
      this.controller.delete(req, res),
    );
  }
}
export default new SurveyQuestionRoutes().router;
