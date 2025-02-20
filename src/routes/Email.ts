import { Router } from 'express';
import { EmailController } from '../controllers/Email.js';
import { Container } from 'typedi';
class EmailRoutes {
  router = Router();
  controller = Container.get(EmailController);
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post('/support', (req, res) =>
      this.controller.support(req, res),
    );
    this.router.post('/password-recovery', (req, res) =>
      this.controller.passwordRecovery(req, res),
    );
  }
}
export default new EmailRoutes().router;
