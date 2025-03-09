import { Router } from 'express';
import type { Request, Response } from 'express';
import { SurveyController } from '../controllers/Survey.js';
import { CreateSurveyDto } from '../dto/survey/create.survey.dto.js';
import { validateDto } from '../middleware/dto.validate.js';
import { UpdateSurveyDto } from '../dto/survey/update.survey.dto.js';

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
      (req: Request, res: Response) => this.controller.create(req, res),
    );
    this.router.get('/', (req: Request, res: Response) =>
      this.controller.getAll(req, res),
    );
    this.router.get('/getOne/:id', (req: Request, res: Response) =>
      this.controller.getOne(req, res),
    );
    this.router.get('/completed/user/:id', (req: Request, res: Response) =>
      this.controller.getSurveyByUserId(req, res),
    );
    this.router.get('/answered-users/:id', (req: Request, res: Response) =>
      this.controller.getUsersBySurveyId(req, res),
    );

    this.router.put(
      '/:id',
      validateDto(UpdateSurveyDto, 'body'),
      (req: Request, res: Response) => this.controller.update(req, res),
    );
    this.router.delete('/:id', (req: Request, res: Response) =>
      this.controller.delete(req, res),
    );
    // сохранение (копирование) param id
    this.router.post('/:id/draft', (req: Request, res: Response) =>
      this.controller.generateDraftAnket(req, res),
    );
    // создание из копии body id
    this.router.post('/draft', (req: Request, res: Response) =>
      this.controller.generateFromDraft(req, res),
    );
    // получение всех геттер
    this.router.get('/draft', (req: Request, res: Response) =>
      this.controller.getAllDrafts(req, res),
    );
  }
}
export default new SurveyRoutes().router;
