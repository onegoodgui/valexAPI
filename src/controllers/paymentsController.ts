import {Request, Response} from 'express'
import * as cardServices from '../services/cardServices.js'
import * as paymentServices from '../services/paymentServices.js'


export async function makePayment(req:Request, res:Response){

    const {id} = req.params;
    const cardId = parseInt(id);

    const {password, amount, businessId} = req.body;

    // Somente cartões cadastrados devem ser recarregados
    const card = await cardServices.findCardById(cardId);
    if(!card){
        res.sendStatus(409);
        return
    }
    
    // Somente cartões não expirados devem ser recarregados
    if(await cardServices.cardIsExpired(cardId)){
        res.send('card is expired');
        return
    }
    // A senha do cartão deverá ser recebida e verificada para garantir a segurança da requisição
    if(! await paymentServices.passwordVerification(cardId,password)){
        res.send('invalid password');
        return
    }

    // Somente estabelecimentos cadastrados devem poder transacionar
    const business = await paymentServices.businessExists(businessId);
    if(! business){
        res.send('business ID not registered');
        return
    }

    // Somente estabelecimentos do mesmo tipo do cartão devem poder transacionar com ele
    if(business.type !== card.type){
        res.send('business type does not match card type');
        return
    }
    
    const availableAmonut = await paymentServices.cardAvailableAmount(cardId);

    res.send('chegou aqui');
}