import { Router } from 'express';
import { regController } from '../controllers/Reg';
import { query } from 'express-validator';

const regRoutes = Router();

// (R) GET_ALL (REGIONS)
regRoutes.get('/regions',
    query('q').isString(),
    regController.getRegions
);

// (R) GET_ALL (CITIES)
regRoutes.get('/cities',
    query('q').isString(),
    regController.getRegions
);

export default regRoutes
