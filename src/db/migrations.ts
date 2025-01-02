/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config';
import { Role } from "./models/Role";
import { User } from "./models/User";

export const adminRoleMigration = async () => {
    const exists = await Role.findOne<any>({
    where: {
        guardName: 'admin'
    } });

    if (!exists) {
        const adminRole = Role.build({
            name: 'Админ',
            guardName: 'admin'
        });
        
        await adminRole.save();
    }
};

export const adminEntryMigration = async () => {
    const adminRole = await Role.findOne<any>({
    where: {
        guardName: 'admin'
    } });

    const exists = await User.findOne<any>({
    where: {
        name: 'Admin'
    } });

    if ( adminRole && !exists ) {
        await User.create({
            name: 'Admin',
            lastname: 'Admin',
            email: process.env.ADMIN_LOGIN,
            password: process.env.ADMIN_PASS,
            roleId: adminRole.id,
        });
    }
};
