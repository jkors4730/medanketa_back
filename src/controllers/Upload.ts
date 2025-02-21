/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../utils/error.js';
import path from 'path';
import fs from 'fs';
import { Service } from 'typedi';
@Service()
export class UploadController {
  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        if (req.files) {
          const file: any = req.files?.file;

          if (file) {
            const imgDir = path.join(__dirname, '../assets/img');
            const filePath = path.join(imgDir, file.name);

            fs.mkdirSync(imgDir, { recursive: true });

            if (!fs.existsSync(filePath)) {
              file.mv(filePath, (err: any) => {
                if (err) {
                  console.error(err);
                }

                res.json({
                  file: `/img/${file.name}`,
                });
              });
            } else {
              res.json({
                file: `/img/${file.name}`,
                exists: true,
              });
            }
          } else {
            returnError(null, res, ['You must provide required field "file"']);
          }
        } else {
          returnError(null, res, ['You must provide required field "file"']);
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  async base64(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { file, name } = req.body;

        if (typeof file == 'string' && typeof name == 'string') {
          const assetsDir = path.join(__dirname, '../assets');
          const imgDir = path.join(__dirname, '../assets/img');
          const filePath = path.join(__dirname, '../assets/img', name);

          if (!fs.existsSync(assetsDir)) {
            fs.mkdirSync(assetsDir);

            if (!fs.existsSync(imgDir)) {
              fs.mkdirSync(imgDir);
            }
          }

          if (!fs.existsSync(filePath)) {
            const fileContent = file
              .replace(/^.*base64,/, '')
              .replace(/ /g, '+');

            fs.writeFileSync(filePath, Buffer.from(fileContent, 'base64'));

            res.json({
              file: `/img/${name}`,
            });
          } else {
            returnError(null, res, ['File already exists!']);
          }
        } else {
          returnError(null, res, [
            'You must provide required field "file" and "name"',
          ]);
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { url } = req.params;

        const filePath = path.join(__dirname, '../assets/img', url);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          res.json({
            success: `File ${url} successfully removed!`,
          });
        } else {
          returnError(null, res, [`File ${url} not found!`]);
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }
}
