import { Router } from 'express';
import {
  SurveyListController,
  surveyListController,
} from '../controllers/SurveyList.js';
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
      (req, res) => this.controller.create(req, res),
    );
    this.router.get('/', (req, res) => this.controller.getAll(req, res));
    this.router.get('user/:id', (req, res) => this.controller.getOne(req, res));
  }
}
export default new SurveyListRoutes().router;
// const surveyListRoutes = Router();
//
// // (C) CREATE
// surveyListRoutes.post('/',
//
//     surveyListController.create
// );
// // (R) GET_ALL
// surveyListRoutes.get('/',
//     query('userId').optional().isNumeric(),
//     surveyListController.getAll
// );
// // (R) GET_ONE
// surveyListRoutes.get('/user/:id',
//     param('id').isNumeric(),
//     query('surveyId').isNumeric(),
//     surveyListController.getOne
// );
//
// export default surveyListRoutes;
