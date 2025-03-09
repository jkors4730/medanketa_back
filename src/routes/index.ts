import type { Application } from 'express';
import emailRoutes from './Email.js';
import userRoutes from './User.js';
import roleRoutes from './Role.js';
import surveyRoutes from './Survey.js';
import surveyQuestionRoutes from './SurveyQuestion.js';
import surveyListRoutes from './SurveyList.js';
import uploadRoutes from './Upload.js';
import statsRoutes from './Stats.js';
import dictRoutes from './Dict.js';
import dictValueRoutes from './DictValue.js';
import regRoutes from './Reg.js';

export default class Routes {
  constructor(app: Application) {
    app.use('/user', userRoutes);
    app.use('/role', roleRoutes);
    app.use('/survey', surveyRoutes);
    app.use('/survey-question', surveyQuestionRoutes);
    app.use('/survey-list', surveyListRoutes);
    app.use('/stats', statsRoutes);
    app.use('/dicts', dictRoutes);
    app.use('/dict-values', dictValueRoutes);
    app.use('/email', emailRoutes);
    app.use('/upload', uploadRoutes);
    app.use('/reg', regRoutes);
  }
}
