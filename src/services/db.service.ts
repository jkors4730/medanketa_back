import { Service } from 'typedi';
import { dbDropAll } from '../db/init.js';

@Service()
export class DbService {
  async dropDB(): Promise<void> {
    await dbDropAll();
  }
}
