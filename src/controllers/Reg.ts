/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { returnError } from '../utils/error';
import fs from 'fs';
import readline from 'readline';
import path from 'path';

class RegController {

    async getRegions(_req: Request, res: Response) {
        try {
            const arr: string[] = [];

            const rd = readline.createInterface(
                fs.createReadStream(path.join(__dirname, `../../reg/regions.txt`)), process.stdout
            );

            rd.on('line', (line) => {
                arr.push(line);
            });

            rd.on('close', () => {
                res.status(200).json(arr);
            });
        }
        catch (e: any) { returnError(e, res); }
    }

    async getCities(_req: Request, res: Response) {
        try {
            const arr: string[] = [];

            const rd = readline.createInterface(
                fs.createReadStream(path.join(__dirname, `../../reg/cities.txt`)), process.stdout
            );

            rd.on('line', (line) => {
                arr.push(line);
            });

            rd.on('close', () => {
                res.status(200).json(arr);
            });
        }
        catch (e: any) { returnError(e, res); }
    }

    async getSpec(_req: Request, res: Response) {
        try {
            const arr: string[] = [];

            const rd = readline.createInterface(
                fs.createReadStream(path.join(__dirname, `../../reg/spec.txt`)), process.stdout
            );

            rd.on('line', (line) => {
                arr.push(line);
            });

            rd.on('close', () => {
                res.status(200).json(arr);
            });
        }
        catch (e: any) { returnError(e, res); }
    }

}

export const regController = new RegController();
