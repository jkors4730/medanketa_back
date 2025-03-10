import { Router } from 'express';
import type { Request, Response } from 'express';
import { SurveyController } from '../controllers/Survey.js';
import { CreateSurveyDto } from '../dto/survey/create.survey.dto.js';
import { validateDto } from '../middleware/dto.validate.js';
import { UpdateSurveyDto } from '../dto/survey/update.survey.dto.js';
import { requirePermission } from '../middleware/role.middleware.js';

//TODO обновить валидацию параметров и query
class SurveyRoutes {
  router = Router();
  controller = new SurveyController();
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      '/',
      validateDto(CreateSurveyDto, 'body'),
      // requirePermission('survey:create'),
      (req: Request, res: Response) => this.controller.create(req, res),
    );
    this.router.get(
      '/',
      // requirePermission('surveys:get'),
      (req: Request, res: Response) => this.controller.getAll(req, res),
    );
    this.router.get(
      '/getOne/:id',
      // requirePermission('surveys:get'),
      (req: Request, res: Response) => this.controller.getOne(req, res),
    );
    this.router.get(
      '/completed/user/:id',
      // requirePermission('surveys:get'),
      (req: Request, res: Response) =>
        this.controller.getSurveyByUserId(req, res),
    );
    this.router.get(
      '/answered-users/:id',
      // requirePermission('surveys:get'),
      (req: Request, res: Response) =>
        this.controller.getUsersBySurveyId(req, res),
    );

    this.router.put(
      '/:id',
      validateDto(UpdateSurveyDto, 'body'),
      // requirePermission('survey:update'),
      (req: Request, res: Response) => this.controller.update(req, res),
    );
    this.router.delete(
      '/:id',
      // requirePermission('survey:delete'),
      (req: Request, res: Response) => this.controller.delete(req, res),
    );
    // сохранение (копирование) param id
    this.router.post(
      '/:id/draft',
      // requirePermission('survey:create'),
      (req: Request, res: Response) =>
        this.controller.generateDraftAnket(req, res),
    );
    // создание из копии body id
    this.router.post(
      '/draft',
      // requirePermission('survey:create'),
      (req: Request, res: Response) =>
        this.controller.generateFromDraft(req, res),
    );
    // получение всех геттер
    this.router.get(
      '/draft',
      // requirePermission('surveys:get'),
      (req: Request, res: Response) => this.controller.getAllDrafts(req, res),
    );
  }
}
export default new SurveyRoutes().router;
