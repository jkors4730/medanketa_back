import 'dotenv/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.SEQUELIZE_DB_STR as string, {
  logging:
    process.env.NODE_ENV === 'development'
      ? (str: string) => {
          console.log(`[${new Date().toLocaleString()}] ${str}`);
        }
      : false,
});
export default sequelize;
