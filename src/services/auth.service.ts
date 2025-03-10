import type { TUserDevices } from '../db/models/AuthUserDevices.js';
import { AuthUserDevices } from '../db/models/AuthUserDevices.js';

export class AuthService {
  static async checkAndAddOrRemoveDevice(userId: string, device: TUserDevices) {
    const user = await AuthUserDevices.findOne({ where: { userId } });
    if (!user) {
      await AuthUserDevices.create({
        userId,
        devices: [
          {
            ...device,
            loginTime: new Date(),
          },
        ],
      });
      return true;
    }

    const devices = user.dataValues.devices;
    if (devices.length > 0) {
      const deviceExists = devices.some(
        (existingDevice: TUserDevices) =>
          existingDevice.deviceName === device.deviceName &&
          existingDevice.deviceModel === device.deviceModel,
      );

      if (deviceExists) {
        const updatedDevices = devices.map((d: TUserDevices) =>
          d.deviceName === device.deviceName &&
          d.deviceModel === device.deviceModel
            ? { ...d, loginTime: new Date() }
            : d,
        );
        await user.update({ devices: updatedDevices });
        return { status: 'updated', devices: updatedDevices };
      }
      if (devices.length >= 4) {
        const oldestDevice = devices.reduce((prev: any, current: any) =>
          new Date(prev.loginTime) < new Date(current.loginTime)
            ? prev
            : current,
        );
        const filteredDevices = devices.filter((d: any) => d !== oldestDevice);
        const updatedDevices = [
          ...filteredDevices,
          { ...device, loginTime: new Date() },
        ];

        await user.update({ devices: updatedDevices });
        return { status: 'replaced', devices: updatedDevices };
      }
    }
    const updatedDevices = [
      ...devices,
      { devices: [{ ...device, loginTime: new Date() }] },
    ];
    await user.update({ devices: updatedDevices });
    return true;
  }
}
