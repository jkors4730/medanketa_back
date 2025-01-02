/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role } from "./models/Role";

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
