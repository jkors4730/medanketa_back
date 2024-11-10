import { Router, Request, Response } from 'express';
import { dbDropAll, dbSyncAll } from '../db/init';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    res.end('/db');
});

router.get('/create', async (req: Request, res: Response) => {
    await dbSyncAll();
    res.end('/create');
});

router.get('/drop', async (req: Request, res: Response) => {
    await dbDropAll();
    res.end('/drop');
});

export default router;