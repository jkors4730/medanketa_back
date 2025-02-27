import type { TUserDevices } from '../db/models/AuthUserDevices.js';
import { AuthUserDevices } from '../db/models/AuthUserDevices.js';

export class AuthService {
  async checkDevice(userId: string, device: TUserDevices) {
    const user = await AuthUserDevices.findOne({ where: { userId: userId } });
    if (!user) {
      return null;
    }
    const devices = user.dataValues.devices;
    let check;
    for (const value of devices) {
      if (
        value.deviceName === device.deviceName &&
        value.deviceModel === device.deviceModel
      ) {
        return (check = true);
      } else {
        return (check = false);
      }
    }
    if (check && devices.length < 4) {
    }
  }
}
