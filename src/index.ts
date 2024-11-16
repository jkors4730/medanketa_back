import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import dbRoutes from './routes/db';
import userRoutes from './routes/User';
import roleRoutes from './routes/Role';
import surveyRoutes from './routes/Survey';
import surveyQuestionRoutes from './routes/SurveyQuestion';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/db', dbRoutes);
app.use('/user', userRoutes);
app.use('/role', roleRoutes);
app.use('/survey', surveyRoutes);
app.use('/survey-question/', surveyQuestionRoutes);

app.get('/', (_req: Request, res: Response) => {
    res.send('Not allowed');
});

app.listen(process.env.PORT);