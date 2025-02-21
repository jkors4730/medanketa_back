import { Router } from 'express';
import { StatsController } from '../../controllers/stats/Stats.js';
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

// const statsRoutes = Router();
//
// // (R) GET_CHARTS_STATS
// statsRoutes.get('/survey/:id',
//     param('id').isNumeric(),
//     statsController.getBySurvey
// );
//
// // (R) GET_MISSED_QUESTIONS
// statsRoutes.get('/survey/missed-questions/:id',
//     param('id').isNumeric(),
//     statsController.getMissedQuestionsBySurvey
// );
//
// // (R) GET_QUESTIONS_ANSWERS
// statsRoutes.get('/survey/questions/:id',
//     param('id').isNumeric(),
//     statsController.getQuestionsBySurvey
// );
//
// // (R) GET_STATS_CSV
// statsRoutes.get('/survey/csv/:id',
//     param('id').isNumeric(),
//     query('win').optional().isBoolean(),
//     statsController.getCsvBySurvey
// );
//
// export default statsRoutes
