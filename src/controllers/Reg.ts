/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { returnError } from '../utils/error';
import fs from 'fs';
import readline from 'readline';
import path from 'path';

class RegController {

    async getRegions(req: Request, res: Response) {
        try {
            const { q } = req.query;

            const arr: string[] = [];

            const find = (str: string, query: string) => {
                return str.toLowerCase().includes( String(query)?.toLowerCase() );
            }

            const rd = readline.createInterface(
                fs.createReadStream(path.join(__dirname, `../../reg/regions.txt`)), process.stdout
            );

            rd.on('line', (line) => {
                if ( find(line, String(q)) ) {
                    arr.push(line);
                }
            });

            rd.on('close', () => {
                res.status(200).json(
                    arr.length > 100
                    ? arr.slice(0, 100)
                    : arr
                );
            });
        }
        catch (e: any) { returnError(e, res); }
    }

    async getCities(req: Request, res: Response) {
        try {
            const { q } = req.query;

            const arr: string[] = [];

            const find = (str: string, query: string) => {
                return str.toLowerCase().includes( String(query)?.toLowerCase() );
            }

            const rd = readline.createInterface(
                fs.createReadStream(path.join(__dirname, `../../reg/cities.txt`)), process.stdout
            );

            rd.on('line', (line) => {
                if ( find(line, String(q)) ) {
                    arr.push(line);
                }
            });

            rd.on('close', () => {
                res.status(200).json(
                    arr.length > 100
                    ? arr.slice(0, 100)
                    : arr
                );
            });
        }
        catch (e: any) { returnError(e, res); }
    }

}

export const regController = new RegController();
