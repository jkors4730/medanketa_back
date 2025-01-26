/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';

export const returnError = (
    err: Error | null,
    res: Response,
    messages: any[] = [],
    status: number = 404
) => {
    const error = messages.length ? messages : err?.message;
    console.error(`[${new Date().toLocaleString()}] ${error}`);

    return res.status( status ).json({ error });
};