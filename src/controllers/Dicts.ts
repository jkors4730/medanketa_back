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
     * * @route {path} /dicts
     * 
     * @body {string} title
     * @body {string} description
     * @body {boolean} common
     * @body {boolean} status
     * @body {number} userId
     * @body {JSON} values
     * 
     * @throws {Error} e
    */
    async create(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { title, description, common, status, userId, values } = req.body;
        
                const dict = await Dict.create<any>({
                    title, description, common, status, userId
                });

                const valuesArr = [];

                if ( Array.isArray( values ) ) {

                    for ( const v of values ) {

                        const { value, sortId } = v;
                        
                        if ( typeof value == 'string'
                            && typeof sortId == 'number' ) {
                            
                            const dictValue = await DictValue.create<any>({
                                dictId: dict.id, value, sortId
                            });
                            valuesArr.push(dictValue.toJSON());
                        }
                        else {
                            returnError(null, res, ['You must provide required fields "value", "sortId" to create DictValue'] );
                        }
                    }
                }

                dict.values = valuesArr;

                res.status(201).json(dict.toJSON());
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Получить справочник по id
     * 
     * @route {path} /dicts/:id
     * 
     * @throws {Error} e
    */
    async getOne(req: Request, res: Response) {
        const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;

                const dict = await Dict.findByPk( id );

                if (dict === null) {
                    returnError(null, res, [`Dict with id = ${id} not found`]);
                } else {
                    res.status(200).json(dict.toJSON());
                }
            }
            else {
                returnError(null, res, errors.array() );
            }
    }
    
    /**
     * Получить значения из справочника по id и query
     * 
     * @route {path} /dicts/values/:id
     * 
     * @param {number} id
     * @query {string} q
     * 
     * @throws {Error} e
    */
    async getValuesById(req: Request, res: Response) {
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

    /**
     * Обновить справочник
     * 
     * * @route {path} /dicts/:id
     * 
     * @param {number} id dictId
     * 
     * @body {string} title
     * @body {string} title
     * @body {boolean} common
     * @body {boolean} status
     * @body {number} userId
     * @throws {Error} e
    */
    async update(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;
                const { title, description, common, status, userId } = req.body;

                const dict = await Dict.findByPk<any>( id );

                if (dict === null) {
                    returnError(null, res, [`Dict with id = ${id} not found`]);
                } else {
                    dict.title = typeof title == 'string' ? title : dict.title;
                    dict.description = typeof description == 'string' ? description : dict.description;
                    dict.common = typeof common == 'boolean' ? common : dict.common;
                    dict.status = typeof status == 'boolean' ? status : dict.status;
                    dict.userId = typeof userId == 'number' ? userId : dict.userId;

                    await dict.save();

                    res.status(200).json(dict.toJSON());
                }
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Удалить справочник
     * 
     * @param {number} id surveyId
     * 
     * @throws {Error} e
    */
    async delete(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;

                const dict = await Dict.findByPk( id );

                if (dict === null) {
                    returnError(null, res, [`Dict with id = ${id} not found`]);
                } else {
                    // удалить связанные значения
                    await sequelize.query<any>(`--sql
                    DELETE FROM dict_values WHERE "dictId" = :id`,
                    {
                        replacements: { id: id },
                        type: QueryTypes.SELECT
                    });

                    await dict.destroy();

                    res.status(204).send();
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
