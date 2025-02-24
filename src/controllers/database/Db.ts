import { Service } from 'typedi';
import { DbService } from '../../services/db.service.js';
import { Request, Response } from 'express';

@Service()
export class DbController {
  constructor(private readonly dbService: DbService) {}
  dropDb(_req: Request, res: Response) {
    try {
      return this.dbService.dropDB();
    } catch (e) {
      res.status(500).json(`failed to drop db: ${e}`);
    }
  }
}
