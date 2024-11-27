import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fileUpload from 'express-fileupload';
import dbRoutes from './routes/db';
import userRoutes from './routes/User';
import roleRoutes from './routes/Role';
import surveyRoutes from './routes/Survey';
import surveyQuestionRoutes from './routes/SurveyQuestion';
import surveyListRoutes from './routes/SurveyList';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, '/assets')))

app.use('/db', dbRoutes);
app.use('/user', userRoutes);
app.use('/role', roleRoutes);
app.use('/survey', surveyRoutes);
app.use('/survey-question/', surveyQuestionRoutes);
app.use('/survey-list/', surveyListRoutes);

app.get('/', (_req: Request, res: Response) => {
    res.json({
        error: 'Not allowed'
    });
});

app.listen(process.env.PORT);