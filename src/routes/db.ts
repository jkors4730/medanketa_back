import { Router, Request, Response } from 'express';
import { dbDropAll, dbSyncAll, dbTestAll } from '../db/init';

const dbRoutes = Router();

dbRoutes.get('/', async (_req: Request, res: Response) => {
    res.end('/db');
});

dbRoutes.get('/create', async (_req: Request, res: Response) => {
    await dbSyncAll();
    res.end('/create');
});

dbRoutes.get('/drop', async (_req: Request, res: Response) => {
    await dbDropAll();
    res.end('/drop');
});

dbRoutes.get('/test', async (_req: Request, res: Response) => {
    await dbTestAll();
    res.end('/test');
});

export default dbRoutes;
