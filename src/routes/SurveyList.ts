/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import type { Request, Response } from 'express';
import { SurveyListController } from '../controllers/SurveyList.js';
import { CreateSurveysListDto } from '../dto/survey-list/create.survey-list.dto.js';
import { validateDto } from '../middleware/dto.validate.js';
import { Container } from 'typedi';
class SurveyListRoutes {
  router = Router();
  controller = Container.get(SurveyListController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      '/',
      validateDto(CreateSurveysListDto, 'body'),
      (req: Request, res: Response) => this.controller.create(req, res),
    );
    this.router.get('/', (req: Request, res: Response) =>
      this.controller.getAll(req, res),
    );
    this.router.get('/user/:id', (req: Request, res: Response): any =>
      this.controller.getOne(req, res),
    );
  }
}
export default new SurveyListRoutes().router;
