/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { returnError } from '../utils/error';
import { validationResult } from 'express-validator';
import { Region } from '../db/models/Region';
import { City } from '../db/models/City';
import { Spec } from '../db/models/Spec';

class RegController {

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
            
            if ( errors.isEmpty() ) {
                const regions = await Region.findAll();

                res.json( regions.map( i => i.toJSON()?.title ) );
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
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
            
            if ( errors.isEmpty() ) {
                const cities = await City.findAll();

                res.json( cities.map( i => i.toJSON()?.title ) );
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
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
                
                if ( errors.isEmpty() ) {
                    const specs = await Spec.findAll();
    
                    res.json( specs.map( i => i.toJSON()?.title ) );
                }
                else {
                    returnError(null, res, errors.array() );
                }
            }
            catch (e: any) { returnError(e, res); }
        }
        catch (e: any) { returnError(e, res); }
    }

}

export const regController = new RegController();
