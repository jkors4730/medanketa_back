import { Router } from 'express';
import { StatsController } from '../controllers/Stats.js';
import { Container } from 'typedi';
export class StatsRoutes {
  router = Router();
  controller = Container.get(StatsController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.get('/survey/:id', this.controller.getBySurvey);
    this.router.get(
      '/survey/missed-questions/:id',
      this.controller.getMissedQuestionsBySurvey,
    );
    this.router.get(
      '/survey/questions/:id',
      this.controller.getQuestionsBySurvey,
    );
    this.router.get('/survey/csv/:id', this.controller.getCsvBySurvey);
  }
}
export default new StatsRoutes().router;
