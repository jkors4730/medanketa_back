import { Sequelize } from 'sequelize-typescript';
import 'dotenv/config';

const sequelize = new Sequelize(process.env.SEQUELIZE_DB_STR as string, {
  dialect: 'postgres',
  database: process.env.DB_NAME as string,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  models: [__dirname + '/models/**/*.{*.js,*.ts}'],
  logging:
    process.env.NODE_ENV === 'development'
      ? (str: string) => {
          console.log(`[${new Date().toLocaleString()}] ${str}`);
        }
      : false,
});

export default sequelize;
