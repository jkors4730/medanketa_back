import type { Application } from 'express';
import dbRoutes from './database/db.js';
import emailRoutes from './email/Email.js';
import userRoutes from './users/User.js';
import roleRoutes from './roles/Role.js';
import surveyRoutes from './survey/Survey.js';
import surveyQuestionRoutes from './survey/SurveyQuestion.js';
import surveyListRoutes from './survey/SurveyList.js';
import uploadRoutes from './files/Upload.js';
import statsRoutes from './statistics/Stats.js';
import dictRoutes from './dictionary/Dict.js';
import dictValueRoutes from './dictionary/DictValue.js';
import regRoutes from './regions/Reg.js';

export default class Routes {
  constructor(app: Application) {
    app.use('/db', dbRoutes);
    app.use('/email', emailRoutes);
    app.use('/user', userRoutes);
    app.use('/role', roleRoutes);
    app.use('/survey', surveyRoutes);
    app.use('/survey-question', surveyQuestionRoutes);
    app.use('/survey-list', surveyListRoutes);
    app.use('/upload', uploadRoutes);
    app.use('/stats', statsRoutes);
    app.use('/dicts', dictRoutes);
    app.use('/dict-values', dictValueRoutes);
    app.use('/reg', regRoutes);
  }
}
