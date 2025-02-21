import { Router } from 'express';
import {
  SurveyQuestionController,
  surveyQuestionController,
} from '../../controllers/survey/SurveyQuestion.js';

import { Container } from 'typedi';
import { CreateSurveysQuestionsDto } from '../../dto/survey-questions/create.survey-questions.dto.js';
import { validateDto } from '../../middleware/dto.validate.js';
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
// const surveyQuestionRoutes = Router();
//
// // (C) CREATE
// surveyQuestionRoutes.post('/',
//     body('questions').isArray(),
//     surveyQuestionController.create
// );
// // (R) GET_ALL
// surveyQuestionRoutes.get('/',
//     query('surveyId').optional().isNumeric(),
//     surveyQuestionController.getAll
// );
// // (R) GET_ONE
// surveyQuestionRoutes.get('/:id',
//     param('id').isNumeric(),
//     surveyQuestionController.getOne
// );
// // (U) UPDATE
// surveyQuestionRoutes.put('/:id',
//     body('surveyId').optional().isNumeric(),
//     body('question').optional().isString(),
//     body('type').optional().isString(),
//     body('status').optional().isBoolean(),
//
//     body('description').optional().isString(),
//     body('data').optional().isString(),
//     surveyQuestionController.update
// );
// // (D) DELETE
// surveyQuestionRoutes.delete('/:id',
//     param('id').isNumeric(),
//     surveyQuestionController.delete
// );
//
// export default surveyQuestionRoutes;
