import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { Request, Response, NextFunction } from 'express';

export function validateDto(
  dtoClass: any,
  source: 'body' | 'query' | 'params' = 'body',
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const data = plainToInstance(dtoClass, req[source]);
    const errors = await validate(data);

    if (errors.length > 0) {
      res.status(400).json({
        message: 'Validation failed',
        errors: errors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
      return;
    }

    req[source] = data;
    next();
  };
}
