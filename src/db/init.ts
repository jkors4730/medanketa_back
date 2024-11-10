import { Role } from "./models/Role";
import { User } from "./models/User";

const isDev = process.env.NODE_ENV === 'dev';

export const dbSyncAll = async () => {
    await User.sync({ alter: isDev });
    await Role.sync({ alter: isDev });
}

export const dbDropAll = async () => {
    await User.drop();
    await Role.drop();
};