import { User } from '../db/models/User.js';

export class AuthService {
  static async blockUser(id: any, typeBlock: any) {
    const candidate = await User.findByPk(id);
    if (!candidate) {
      return null;
    }
    candidate.setDataValue('isBlocked', typeBlock);
    await candidate.save();
    return {
      message: `User: ${candidate.dataValues.name} set block status: ${typeBlock}`,
    };
  }
  static async generateTokens() {}
}
