/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import 'dotenv/config';

interface JWTData {
    id: string;
    email: string;
}

const jwtKey = process.env.JWT_TOKEN as string;

export const generateAuthToken = (user: any): string => {
    const token = jwt.sign({
        id: user.id,
        email: user.email
    }, jwtKey, {
        expiresIn: '2h',
    });

    return token;
};

export const verifyToken = (token: string): JWTData | undefined => {
  try {
    const tokenData = jwt.verify(token, jwtKey);

    return tokenData as JWTData;
  }
  catch (err) { throw new Error(err as string); }
};