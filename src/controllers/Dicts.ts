/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../utils/error';
import fs from 'fs';
import readline from 'readline';
import path from 'path';

class DictsController {

    async getAll(_req: Request, res: Response) {
        try {
            const dicts = fs.readFileSync(path.join(__dirname, '../../dicts/index.json'), { encoding: "utf-8" });

            res.status(200).json( JSON.parse(dicts) );
        }
        catch (e: any) { returnError(e, res); }
    }

    async getById(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;
                const { q } = req.query;

                const find = (str: string, query: string) => {
                    return str.toLowerCase().includes( String(query)?.toLowerCase() );
                }

                const arr: string[] = [];

                const rd = readline.createInterface(
                    fs.createReadStream(path.join(__dirname, `../../dicts/${id}.txt`)), process.stdout
                );

                rd.on('line', (line) => {
                    if ( q ) {
                        if ( find(line, String(q)) ) {
                            arr.push(line);
                        } else {
                            arr.push(line);
                        }
                    }
                    else {
                        arr.push(line);
                    }
                });

                rd.on('close', () => {
                    res.status(200).json( 
                        arr.length > 500 ?
                        arr.slice(0, 500) : arr
                    );
                });
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

}

export const dictsController = new DictsController();
