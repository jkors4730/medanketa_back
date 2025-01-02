/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config';
import { Role } from "./models/Role";
import { User } from "./models/User";
import { passwordHash } from '../utils/hash';

export const adminRoleMigration = async () => {
    const exists = await Role.findOne<any>({
    where: {
        guardName: 'admin'
    } });

    if (!exists) {
        await Role.create({
            name: 'Админ',
            guardName: 'admin'
        });
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
        const password = passwordHash(
            process.env.ADMIN_PASS
            ? process.env.ADMIN_PASS
            : 'admin'
        );

        await User.create({
            name: 'Admin',
            lastname: 'Admin',
            email: process.env.ADMIN_LOGIN,
            password: password,
            roleId: adminRole.id,
        });
    }
};
