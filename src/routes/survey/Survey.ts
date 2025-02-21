import { Router } from 'express';
import {
  SurveyController,
  surveyController,
} from '../../controllers/survey/Survey.js';
import { CreateSurveyDto } from '../../dto/survey/create.survey.dto.js';
import { validateDto } from '../../middleware/dto.validate.js';
import { UpdateSurveyDto } from '../../dto/survey/update.survey.dto.js';
import { Container } from 'typedi';

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
// const surveyRoutes = Router();
//
// // (C) CREATE
// surveyRoutes.post('/',
//
//     surveyController.create
// );
// // (R) GET_ALL
// surveyRoutes.get('/',
//     query('userId').optional().isNumeric(),
//     surveyController.getAll);
// // (R) GET_ONE
// surveyRoutes.get('/:id',
//     param('id').isNumeric(),
//     query('answers').optional().isBoolean(),
//     surveyController.getOne
// );
// // (R) GET_BY_USER_ID (completed)
// surveyRoutes.get('/completed/user/:id',
//     param('id').isNumeric(),
//     surveyController.getByUserId
// );
// surveyRoutes.get('/answers/:id',
//     surveyController.getUsersBySurveyId
// );
// // (U) UPDATE
// surveyRoutes.put('/:id',
//     param('id').isNumeric(),
//
//     body('userId').optional().isNumeric(),
//     body('image').optional().isString(),
//     body('title').optional().isString(),
//     body('slug').optional().isString(),
//     body('status').optional().isBoolean(),
//     body('access').optional().isBoolean(),
//     body('description').optional().isString(),
//     body('expireDate').optional().isDate(),
//     surveyController.update
// );
// // (D) DELETE
// surveyRoutes.delete('/:id',
//     param('id').isNumeric(),
//     surveyController.delete
// );
//
// export default surveyRoutes;
