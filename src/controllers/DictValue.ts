/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../utils/error';
import { DictValue } from '../db/models/DictValue';
import sequelize from '../db/config';
import { QueryTypes } from 'sequelize';

class DictValuesController {
    /**
     * Создать значение справочника
     * 
     * * @route {path} /dict-values
     * 
     * @body {string} value
     * @body {number} dictId
     * @body {number} sortId
     * 
     * @throws {Error} e
    */
    async create(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { value, dictId, sortId } = req.body;
                        
                const dictValue = await DictValue.create<any>({
                    value, dictId, sortId: sortId ?? 0
                });

                res.status(201).json(dictValue.toJSON());
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Получить значение справочника по id
     * 
     * * @param {number} valueId
     * 
     * @route {path} /dict-values/:id
     * 
     * @throws {Error} e
    */
    async getOne(req: Request, res: Response) {
        const errors = validationResult(req);
            
        if ( errors.isEmpty() ) {
            const { id } = req.params;

            const dictValue = await DictValue.findOne({
                where: { id },
                attributes: ['value', 'dictId', 'sortId']
            });

            if (dictValue === null) {
                returnError(null, res, [`DictValue with id = ${id} not found`]);
            } else {
                res.status(200).json(dictValue.toJSON());
            }
        }
        else {
            returnError(null, res, errors.array() );
        }
    }
    
    /**
     * Получить значения справочника по id справочника и query
     * 
     * @route {path} /dict-values/dict/:id
     * 
     * @param {number} dictId
     * @query {string} q
     * @query {number} page
     * @query {number} size
     * 
     * @throws {Error} e
    */
    async getByDictId(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                try {
                    const { id } = req.params;
                    const { q, page, size } = req.query;

                    const mPage = page ? Number(page) : 1;
                    const mSize = size ? Number(size) : 20;

                    const data = await sequelize.query<any>(`--sql
                        SELECT DISTINCT id, value, "sortId"
                        FROM dict_values
                        WHERE value ILIKE :query
                        AND "dictId" = :dict_id
                        OFFSET :offset
                        LIMIT :limit`,
                    {
                        replacements: {
                            dict_id: id,
                            query: q ? `%${q}%` : '%%',
                            offset: mPage > 1 ? (mSize * (Number(page) - 1)) : 0,
                            limit: mSize
                        },
                        type: QueryTypes.SELECT,
                        model: DictValue,
                        mapToModel: true,
                    });

                    const dataCount = await sequelize.query<any>(`--sql
                        SELECT COUNT(DISTINCT value)
                        FROM dict_values
                        WHERE value ILIKE :query
                        AND "dictId" = :dict_id`,
                    {
                        replacements: {
                            dict_id: id,
                            query: q ? `%${q}%` : '%%'
                        },
                        type: QueryTypes.SELECT
                    });
                    
                    res.status(200).json( {
                        items: data,
                        page: page,
                        total: dataCount[0].count
                    } );
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
     * Обновить значение справочника
     * 
     * @route {path} /dict-values/:id
     * 
     * @param {number} id valueId
     * 
     * @body {string} value
     * @body {number} dictId
     * @body {number} sortId
     * @throws {Error} e
    */
    async update(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;
                const { value, dictId, sortId } = req.body;

                const dictValue = await DictValue.findByPk<any>( id );

                if (dictValue === null) {
                    returnError(null, res, [`DictValue with id = ${id} not found`]);
                } else {
                    dictValue.value = typeof value == 'string' ? value : dictValue.value;
                    dictValue.dictId = typeof dictId == 'number' ? dictId : dictValue.dictId;
                    dictValue.sortId = typeof sortId == 'number' ? sortId : dictValue.sortId;

                    await dictValue.save();

                    res.status(200).json(dictValue.toJSON());
                }
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Удалить значение
     * 
     * @route {path} /dict-values/:id
     * 
     * @param {number} id valueId
     * 
     * @throws {Error} e
    */
    async delete(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;

                const dictValue = await DictValue.findByPk( id );

                if (dictValue === null) {
                    returnError(null, res, [`DictValue with id = ${id} not found`]);
                } else {
                    // удалить связанные значения
                    await sequelize.query<any>(`--sql
                    DELETE FROM dict_values WHERE id = :id`,
                    {
                        replacements: { id: id },
                        type: QueryTypes.SELECT
                    });

                    await dictValue.destroy();

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

export const dictValuesController = new DictValuesController();
