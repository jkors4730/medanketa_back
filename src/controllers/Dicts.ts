/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../utils/error';
import sequelize from '../db/config';
import { Op, QueryTypes } from 'sequelize';
import { User } from '../db/models/User';
import { Role } from '../db/models/Role';
import { Dict } from '../db/models/Dict';
import { DictValue } from '../db/models/DictValue';
import { ROLE_ADMIN } from '../utils/common';

class DictsController {
    /**
     * Создать справочник
     * 
     * @body {string} title
     * @body {boolean} common
     * @body {boolean} status
     * @body {number} userId
     * 
     * @throws {Error} e
    */
    async create(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { title, common, status, userId } = req.body;
        
                const dict = await Dict.create<any>({
                    title, common, status, userId
                });

                res.status(201).json(dict.toJSON());
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Получить список справочников
     * 
     * @route {path} /dicts
     * 
     * @throws {Error} e
    */
    async getAll(req: Request, res: Response) {
        try {
            const errors = validationResult(req);

            if ( errors.isEmpty() ) {
                const dicts = await Dict.findAll();

                res.status(200).json( dicts.map( d => d.toJSON() ) );
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }
    
    /**
     * Получить значения из справочника по id и query
     * 
     * @route {path} /dicts/:id
     * 
     * @param {number} id
     * @query {string} q
     * 
     * @throws {Error} e
    */
    async getById(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                try {
                    const { id } = req.params;
                    const { q } = req.query;

                    const data = await sequelize.query<any>(`--sql
                        SELECT DISTINCT value
                        FROM dict_values
                        WHERE value ILIKE :query
                        AND "dictId" = :dict_id LIMIT 500`,
                    {
                        replacements: {
                            dict_id: id,
                            query: `%${q}%`
                        },
                        type: QueryTypes.SELECT,
                        model: DictValue,
                        mapToModel: true,
                    });
                    
                    res.status(200).json( data.map( d => d.value ) );
                }
                catch (e: any) { returnError(e, res); }
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Получить справочник по id пользователя
     * 
     * @route {path} /dicts/user/:id
     * 
     * @param {number} id userId
     * @query {boolean} common
     * @throws {Error} e
    */
    async getByUser(req: Request, res: Response) {
        try {
            const errors = validationResult(req);

            if ( errors.isEmpty() ) {
                const { id } = req.params;

                const user = await User.findByPk<any>(id);

                if (user) {
                    const role = await Role.findByPk<any>(user.roleId);

                    if (role) {
                        if (role.guardName === ROLE_ADMIN) {
                            const dicts = await Dict.findAll({
                                where: {
                                    common: true
                                }
                            });

                            res.status(200).json( dicts.map( d => d.toJSON() ) );
                        }
                        else {
                            const dicts = await Dict.findAll({
                                where: {
                                  [Op.or]: {
                                    userId:  user.id,
                                    common: true,
                                  },
                                },
                            });

                            res.status(200).json( dicts.map( d => d.toJSON() ) );
                        }
                    }
                    else {
                        returnError(null, res, [`Role with id = ${user.roleId} not found`] );
                    }
                }
                else {
                    returnError(null, res, [`User with id = ${id} not found`] );
                }
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

}

export const dictsController = new DictsController();
