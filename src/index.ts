import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import dbRoutes from './routes/db';
import emailRoutes from './routes/Email';
import userRoutes from './routes/User';
import roleRoutes from './routes/Role';
import surveyRoutes from './routes/Survey';
import surveyQuestionRoutes from './routes/SurveyQuestion';
import surveyListRoutes from './routes/SurveyList';
import uploadRoutes from './routes/Upload';
import statsRoutes from './routes/Stats';
import dictRoutes from './routes/Dict';
import regRoutes from './routes/Reg';
import dictValueRoutes from './routes/DictValue';

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '/assets')));
app.use(fileUpload());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

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

app.get('/', (_req: Request, res: Response) => {
    res.json({
        error: 'Not allowed'
    });
});

app.listen(process.env.PORT);
