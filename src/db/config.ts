import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(process.env.SEQUELIZE_DB_STR as string);

export default sequelize;