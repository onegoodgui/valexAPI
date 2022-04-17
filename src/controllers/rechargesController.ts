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
    const company = await companyServices.getCompanyFromAPIKey(companyAPIKeyHeaders);
    if(!company){
        res.status(404);
        return
    }

    // Somente cartões cadastrados devem ser recarregados
    if(!await cardServices.findCardById(cardId)){
        res.sendStatus(409);
        return
    }

    // Somente cartões não expirados devem ser recarregados
    if(await cardServices.cardIsExpired(cardId)){
        res.send('card is expired');
        return
    }

    await rechargeServices.rechargeCard({cardId, amount})
    res.sendStatus(200);
}