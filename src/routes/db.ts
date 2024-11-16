import { Router, Request, Response } from 'express';
import { dbDropAll, dbSyncAll } from '../db/init';

const dbRoutes = Router();

dbRoutes.get('/', async (req: Request, res: Response) => {
    res.end('/db');
});

dbRoutes.get('/create', async (req: Request, res: Response) => {
    await dbSyncAll();
    res.end('/create');
});

dbRoutes.get('/drop', async (req: Request, res: Response) => {
    await dbDropAll();
    res.end('/drop');
});

export default dbRoutes;