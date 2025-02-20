import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { dbSyncAll } from './db/init.js';
import Routes from './routes/index.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function bootstrap() {
  const app = express();
  const port = process.env.PORT || 5000;
  new Routes(app);

  app.use(cors());
  app.use(express.static(path.join(__dirname, '/assets')));
  app.use(fileUpload());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

  dbSyncAll().then(() => {
    console.log(`db success connected`);
  });
  app.listen(port, () => {
    console.log(`listen: ${port}`);
  });
}
bootstrap();
