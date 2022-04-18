import {Request, Response} from 'express'
import * as companyServices from '../services/companyServices.js'
import * as cardServices from '../services/cardServices.js'
import * as rechargeServices from '../services/rechargeServices.js'

export async function rechargeCard(req:Request, res:Response){

    const {'x-api-key': companyAPIKeyHeaders} = req.headers;
    const {amount}  =req.body;
    const {id} = req.params;
    const cardId = parseInt(id);

    // A chave de API deve ser possuida por alguma empresa
    await companyServices.getCompanyFromAPIKey(companyAPIKeyHeaders);


    // Somente cartões cadastrados devem ser recarregados
    await cardServices.findCardById(cardId)

    // Somente cartões não expirados devem ser recarregados
    await cardServices.cardIsExpired(cardId)
    
    await rechargeServices.rechargeCard({cardId, amount})
    res.sendStatus(200);
}