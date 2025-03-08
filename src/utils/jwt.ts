/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { Role } from '../db/models/Role.js';

interface JWTData {
  id: string;
  email: string;
}

const jwtKey = process.env.JWT_TOKEN as string;

export const generateAuthToken = async (user: any): Promise<string> => {
  const role = await Role.findOne({ where: { id: user.roleId } });
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      permissions: role.dataValues.permissions,
    },
    jwtKey,
    {
      expiresIn: '2h',
    },
  );

  return token;
};

export const verifyToken = (token: string): JWTData | undefined => {
  try {
    const tokenData = jwt.verify(token, jwtKey);

    return tokenData as JWTData;
  } catch (err) {
    throw new Error(err as string);
  }
};
