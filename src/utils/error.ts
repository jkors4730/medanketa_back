import { Response } from 'express';

export const returnError = (
    err: Error | null,
    res: Response,
    messages: any[] = [],
    status: number = 404
) => {
    return res.status( status ).json({
        error: messages.length ? messages : err?.message
    });
};