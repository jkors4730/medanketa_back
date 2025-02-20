import type { Response } from 'express';

export const returnError = (
  err: Error | null,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any[] = [],
  status: number = 404,
) => {
  const error = messages.length ? messages : err?.message;
  console.error(`[${new Date().toLocaleString()}] ${error}`);

  return res.status(status).json({ error });
};
