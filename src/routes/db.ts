import { Router, Request, Response } from 'express';
import { dbDropAll, dbSyncAll, dbTestAll } from '../db/init';
import path from 'path';
import { mkdirSync, rmSync } from 'fs';

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

dbRoutes.get('/files', async (_req: Request, res: Response) => {
    const imgDir = path.join(__dirname, '../assets/files/test');
    mkdirSync(imgDir, { recursive: true });
    res.end('/test');
});

dbRoutes.get('/rmfiles', async (_req: Request, res: Response) => {
    const imgDir = path.join(__dirname, '../assets/files');
    rmSync(imgDir, { recursive: true, force: true });
    res.end('/test');
});

export default dbRoutes;
