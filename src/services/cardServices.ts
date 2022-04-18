import {faker} from '@faker-js/faker'

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js'

import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid'

import * as cardRepository from '../repositories/cardRepository.js'
import * as paymentRepository from '../repositories/paymentRepository.js'
import * as rechargeRepository from '../repositories/rechargeRepository.js'
import { CardInsertData, CardUpdateData } from '../repositories/cardRepository.js';
import { TransactionTypes } from '../repositories/cardRepository.js'

import * as paymentServices from '../services/paymentServices.js'

import {errorTypes} from '../middlewares/handleErrorsMiddleware.js'

dayjs.extend(customParseFormat)

export async function checkUserCard(employeeId:number, type: TransactionTypes){

    const employeeCardType =  await cardRepository.findByTypeAndEmployeeId(type, employeeId);
    if(employeeCardType){
        throw errorTypes.conflictError(`employee already has the ${type} card`)
    }
    return
}

export async function generateCardData(name:string){

   const expirationDate = dayjs().add(5, 'year').format('MM/YYYY');
   const cardHolderName = generateCardHolderName(name);

   const securityCode = faker.finance.creditCardCVV();
   const hashedSecurityCode = bcrypt.hashSync(securityCode, 10);
   const cardNumber = await generateCardNumber();

   return {expirationDate, cardHolderName, hashedSecurityCode, cardNumber}
}

function generateCardHolderName(name:string){

    const nameParts = name.split(' ');

    const firstName = nameParts.shift().toUpperCase();
    const lastName = nameParts.pop().toUpperCase();
    const middleNames = nameParts.reduce((surname, surnamePart):string => {
        if(surnamePart.length > 3){
            return surname + surnamePart[0].toUpperCase() + ' '
        }
        return surname
    },' ')
 
   return firstName + middleNames + lastName;
}

export async function cardNumberConflict(cardNumber:string){

    const cardsList = await cardRepository.find();
    const cardConflict = cardsList.find((card) => card.number === cardNumber);
    if(cardConflict){
        return true
    }
    else{
        return false
    }
}

async function generateCardNumber(){

    const candidateCardNumber = faker.finance.creditCardNumber('mastercard');
    let attemptCardNumber = candidateCardNumber;
    let conflictStatus = await cardNumberConflict(attemptCardNumber)

    if(conflictStatus === true){
        do{
            attemptCardNumber = faker.finance.creditCardNumber('mastercard');
            conflictStatus = await cardNumberConflict(attemptCardNumber); 
        }while(conflictStatus === true);
        
        return attemptCardNumber
    }
 
    return attemptCardNumber;

}

export async function insertCard(cardData:CardInsertData){
    return await cardRepository.insert(cardData)
}

export async function findCardById(id:number){
    const card = await cardRepository.findById(id);
    if(!card){
        throw errorTypes.notFoundError()
    }

    return await cardRepository.findById(id)
}

export async function cardIsActivated(id:number){

    const card = await cardRepository.findById(id);

    if(card.password !== null){
        throw errorTypes.conflictError('card already activated')
    }
    return card
}


export async function cardIsExpired(id:number){

    const today = dayjs()
    const todayDayjs = dayjs(today,'MM/YYYY');

    const {expirationDate} = await cardRepository.findById(id);
    const expirationDateDayjs = dayjs(expirationDate,'MM/YYYY');

    if(expirationDateDayjs.isSame(todayDayjs, 'month') || expirationDateDayjs.isAfter(todayDayjs, 'month')){
        return
    }
    else{
        throw errorTypes.conflictError('card is expired')
    }
}

export async function securityCodeisValid(id:number, securityCode:string){

    const {securityCode: hashedSecurityCode} = await cardRepository.findById(id);
    console.log(securityCode);

    if(bcrypt.compareSync(securityCode, hashedSecurityCode)){
        return 
    }
    else{
        throw errorTypes.conflictError('invalid security code')
    }
}

export async function updateCardPassword(id:number, cardData:CardUpdateData) {
    
    const hashedPassword = bcrypt.hashSync(cardData.password, 10);
    cardData.password = hashedPassword;
    await cardRepository.update(id, cardData)
}

export async function cardBalance(cardId:number){

    const {transactions, totalAmount: transactionsAmount} = await paymentServices.cashMovement(paymentRepository, cardId);
    const {transactions: recharges, totalAmount: rechargesAmount} = await paymentServices.cashMovement(rechargeRepository, cardId);
    const balance = rechargesAmount - transactionsAmount;

    return {balance, transactions, recharges}

}