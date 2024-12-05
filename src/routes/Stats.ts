import { Router } from 'express';
import { param } from 'express-validator';
import { statsController } from '../controllers/Stats';

const statsRoutes = Router();

// (R) GET_ONE
statsRoutes.get('/survey/:id',
    param('id').isNumeric(),
    statsController.getBySurvey
);

export default statsRoutes
