import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import Routes from './routes/index.js';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import sequelize from './db/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function bootstrap() {
  const app = express();
  app.use(cors());
  app.use(express.static(path.join(__dirname, '/assets')));
  app.use(fileUpload());
  app.use(cookieParser());
  app.use(express.json());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
  new Routes(app);

  return app;
}
bootstrap().then((app) => {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`listen: ${port}`);
  });
});
export default bootstrap();
