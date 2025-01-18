import { Router } from 'express';
import { param, query } from 'express-validator';
import { statsController } from '../controllers/Stats';

const statsRoutes = Router();

// (R) GET_CHARTS_STATS
statsRoutes.get('/survey/:id',
    param('id').isNumeric(),
    statsController.getBySurvey
);

// (R) GET_MISSED_QUESTIONS
statsRoutes.get('/survey/missed-questions/:id',
    param('id').isNumeric(),
    statsController.getMissedQuestionsBySurvey
);

// (R) GET_QUESTIONS_ANSWERS
statsRoutes.get('/survey/questions/:id',
    param('id').isNumeric(),
    statsController.getQuestionsBySurvey
);

// (R) GET_STATS_CSV
statsRoutes.get('/survey/csv/:id',
    param('id').isNumeric(),
    query('win').optional().isBoolean(),
    statsController.getCsvBySurvey
);

export default statsRoutes
