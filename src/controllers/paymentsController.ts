import {Request, Response} from 'express'
import * as cardServices from '../services/cardServices.js'
import * as paymentServices from '../services/paymentServices.js'


export async function makePayment(req:Request, res:Response){

    const {id} = req.params;
    const cardId = parseInt(id);

    const {password, amount, businessId} = req.body;

    // Somente cartões cadastrados e ativados devem poder transacionar
    const card = await cardServices.findCardById(cardId);
    
    // Somente cartões não expirados devem poder transacionar
    await cardServices.cardIsExpired(cardId);

    // A senha do cartão deverá ser recebida e verificada para garantir a segurança da requisição
    await paymentServices.passwordVerification(cardId,password)

    // Somente estabelecimentos cadastrados devem poder transacionar
    await paymentServices.businessExists(businessId, card);
    
    await paymentServices.availableAmountIsSufficient(cardId, amount)

    await paymentServices.makePayment({cardId, businessId, amount})

    res.sendStatus(200)
}