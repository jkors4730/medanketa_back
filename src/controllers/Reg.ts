import type { Request, Response } from 'express';
import { returnError } from '../utils/error.js';
import { validationResult } from 'express-validator';
import { Region } from '../db/models/Region.js';
import { City } from '../db/models/City.js';
import { Service } from 'typedi';
@Service()
export class RegController {
  /**
   * Получить список регионов
   *
   * @route {path} /reg/regions
   *
   * @throws {Error} e
   */
  async getRegions(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const regions = await Region.findAll();

        res.json(
          regions.map(
            (i: { toJSON: () => { (): any; new (): any; title: any } }) =>
              i.toJSON()?.title,
          ),
        );
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }
  /**
   * Получить список городов
   *
   * @route {path} /reg/cities
   *
   * @throws {Error} e
   */
  async getCities(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const cities = await City.findAll();

        res.json(
          cities.map(
            (i: { toJSON: () => { (): any; new (): any; title: any } }) =>
              i.toJSON()?.title,
          ),
        );
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }
  /**
   * Получить список специальностей
   *
   * @route {path} /reg/spec
   *
   * @throws {Error} e
   */
  async getSpec(req: Request, res: Response) {
    try {
      try {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
          res.json(200);
        } else {
          returnError(null, res, errors.array());
        }
      } catch (e: any) {
        returnError(e, res);
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }
}
