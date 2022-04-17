import {Request, Response, NextFunction} from 'express'
import * as cardServices from '../services/cardServices.js'
import * as companyServices from '../services/companyServices.js'
import * as employeeServices from '../services/employeeServices.js'
import { TransactionTypesList } from '../../utils/cardsUtils.js';
import { Card } from '../repositories/cardRepository.js';


export async function createCard(req:Request, res:Response){
    

    const {'x-api-key': companyAPIKeyHeaders} = req.headers;

    const {companyId, employeeId, cardType} = req.body;

    //Verificação da existência dos dados fornecidos na requisição
    if(!companyAPIKeyHeaders || !companyId || !employeeId || !cardType){

        res.sendStatus(422);
        return
    } 
    else if(!TransactionTypesList.includes(cardType)){

        res.sendStatus(422);
        return
    }

    // A chave de API deve ser possuida por alguma empresa
    const company = await companyServices.getCompanyFromAPIKey(companyAPIKeyHeaders)
    if(!company){
        res.status(404)
        return
    }

    // Somente empregados cadastrados devem possuir cartões
    const employee = await employeeServices.findEmployeeById(employeeId)

    if(employee.companyId !== companyId){
        res.sendStatus(409)
        return
    }
    else if(!employee){
        res.sendStatus(404);
        return
    }
    // Empregados não podem possuir mais de um cartão do mesmo tipo
    const employeeCardType = await cardServices.checkUserCard(employeeId, cardType);

    if(!employeeCardType){
       
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

    res.sendStatus(409)
    return
}

export async function activateCard(req:Request, res:Response){
    const { securityCode, password} = req.body;
    const {id} = req.params;
    const cardId = parseInt(id);
    
    if(!cardId || !securityCode || !password){
        res.sendStatus(422);
        return
    }
    
    // Somente cartões cadastrados devem ser ativados
    if(!await cardServices.findCardById(cardId)){
        res.sendStatus(409);
        return
    }
    // Somente cartões não expirados devem ser ativados
    if(await cardServices.cardIsExpired(cardId)){
        res.send('card is expired');
        return
    }

    // Cartões já ativados (com senha cadastrada) não devem poder ser ativados de novo
    const {password: cardPassword} = await cardServices.findCardById(cardId);
    if(cardPassword !== null){
        res.send('card is already activated');
        return
    }

    // O CVC deverá ser recebido e verificado para garantir a segurança da requisição
    if(! await cardServices.securityCodeisValid(cardId, securityCode)){
        res.send('invalid security code');
        return
    };

    if( ! cardServices.passwordFollowsRule(password)){
        res.send('invalid password');
        return
    }

    const cardData = {password};
    await cardServices.updateCardPassword(cardId, cardData);
    res.send('chegou aqui').status(200);
}

