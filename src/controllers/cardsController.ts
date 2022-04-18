import {Request, Response, NextFunction} from 'express'
import * as cardServices from '../services/cardServices.js'
import * as companyServices from '../services/companyServices.js'
import * as employeeServices from '../services/employeeServices.js'
import { TransactionTypesList } from '../../utils/cardsUtils.js';
import { Card } from '../repositories/cardRepository.js';
import { errorTypes } from '../middlewares/handleErrorsMiddleware.js';


export async function createCard(req:Request, res:Response){
    

    const {'x-api-key': companyAPIKeyHeaders} = req.headers;

    const {companyId, employeeId, cardType} = req.body;

    //Verificação da existência dos dados fornecidos na requisição
    if(!companyAPIKeyHeaders || !companyId || !employeeId || !cardType){

        throw errorTypes.unprocessableEntityError()
    } 
    else if(!TransactionTypesList.includes(cardType)){

        throw errorTypes.unprocessableEntityError()
    }

    // A chave de API deve ser possuida por alguma empresa
    await companyServices.getCompanyFromAPIKey(companyAPIKeyHeaders)

    // Somente empregados cadastrados devem possuir cartões
    const employee = await employeeServices.findEmployeeById(employeeId, companyId)

    // Empregados não podem possuir mais de um cartão do mesmo tipo
    await cardServices.checkUserCard(employeeId, cardType);

    const isVirtual = false;
    const isBlocked = false;
    const password = null;
    const originalCardId = null;
    const {expirationDate, cardHolderName: cardholderName, hashedSecurityCode: securityCode, cardNumber: number} = await cardServices.generateCardData(employee.fullName);
    const cardData = {isVirtual, isBlocked, employeeId ,password, originalCardId, expirationDate, cardholderName, securityCode, number, type:cardType};
    await cardServices.insertCard(cardData)

    res.sendStatus(200);
    return



}


export async function activateCard(req:Request, res:Response){
    const { securityCode, password} = req.body;
    const {id} = req.params;
    const cardId = parseInt(id);
    
    if(!cardId || !securityCode || !password){
        errorTypes.unprocessableEntityError()
    }
    
    // Somente cartões cadastrados devem ser ativados
    await cardServices.findCardById(cardId)

    // Cartão não pode estar ainda ativado;
    await cardServices.cardIsActivated(cardId);

    // Somente cartões não expirados devem ser ativados
    await cardServices.cardIsExpired(cardId)


    // O CVC deverá ser recebido e verificado para garantir a segurança da requisição
    await cardServices.securityCodeisValid(cardId, securityCode)

    const cardData = {password};
    await cardServices.updateCardPassword(cardId, cardData);
    res.send('chegou aqui').status(200);
}


export async function cardBalance(req:Request, res:Response){

    const {id} = req.params;
    const cardId = parseInt(id);

    // Somente cartões cadastrados devem ser visualizados
    await cardServices.findCardById(cardId);

    const balance = await cardServices.cardBalance(cardId);

    res.send(balance);
}