import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    
    const auth = req.headers.authorization;

    if (auth && auth.startsWith('Bearer')) {
        const token = auth.slice(7);

        try {
            const tokenData = verifyToken(token);
            req.body.tokenData = tokenData;
            next();
        } catch (err) {
            console.error(err);
            res.json({
                error: 'jwt malformed'
            });
        }
    } else {
        res.json({
            error: 'no token provided'
        });
    }
};