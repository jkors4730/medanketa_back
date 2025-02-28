import { Router } from 'express';
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
    this.router.post('/', validateDto(CreateSurveyDto, 'body'), (req, res) =>
      this.controller.create(req, res),
    );
    this.router.get('/', (req, res) => this.controller.getAll(req, res));
    this.router.get('/getOne/:id', (req, res) =>
      this.controller.getOne(req, res),
    );
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
    // сохранение (копирование) query id
    this.router.post('/:id/draft', (req, res) =>
      this.controller.generateDraftAnket(req, res),
    );
    // создание из копии body id
    this.router.post('/draft', (req, res) =>
      this.controller.generateFromDraft(req, res),
    );
    // получение всех геттер
    this.router.get('/draft', (req, res) =>
      this.controller.getAllDrafts(req, res),
    );
  }
}
export default new SurveyRoutes().router;
