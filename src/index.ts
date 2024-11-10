import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import dbRoutes from './routes/db';
import userRoutes from './routes/User';
import roleRoutes from './routes/Role';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/db', dbRoutes);
app.use('/user', userRoutes);
app.use('/role', roleRoutes);

app.get('/', (_req: Request, res: Response) => {
    res.send('Not allowed');
});

app.listen(process.env.PORT);