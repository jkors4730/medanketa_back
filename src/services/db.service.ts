import { Service } from 'typedi';
import { dbDropAll } from '../db/init.js';

@Service()
export class DbService {
  async dropDB(): Promise<void> {
    await dbDropAll();
  }
}
///const dbRoutes = Router();
//
// dbRoutes.get('/', async (_req: Request, res: Response) => {
//     res.end('/db');
// });
//
// dbRoutes.get('/create', async (_req: Request, res: Response) => {
//     await dbSyncAll();
//     res.end('/create');
// });
//
// dbRoutes.get('/drop', async (req: Request, res: Response) => {
//     const { users } = req.query;
//     await dbDropAll(users === 'true');
//     res.end('/drop');
// });
//
// dbRoutes.get('/test', async (req: Request, res: Response) => {
//     const { users } = req.query;
//     await dbTestAll(users === 'true');
//     res.end('/test');
// });
//
// export default dbRoutes;
