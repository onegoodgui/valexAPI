    import bcrypt from 'bcrypt'
    import * as cardRepository from '../repositories/cardRepository.js'
    import * as businessRepository from '../repositories/businessRepository.js'
    import * as paymentRepository from '../repositories/paymentRepository.js'
    import * as rechargeRepository from '../repositories/rechargeRepository.js'
    import { PaymentInsertData } from '../repositories/paymentRepository.js'
    import { Card } from '../repositories/cardRepository.js'
import { errorTypes } from '../middlewares/handleErrorsMiddleware.js'

    export async function passwordVerification(id:number, typedPassword:string){

        const {password: persistedPassword} = await cardRepository.findById(id)
        if(persistedPassword === null){
            throw errorTypes.notFoundError('card still not activated');
        }
        else if(bcrypt.compareSync(typedPassword, persistedPassword)){
            return true
        }
        else{
            throw errorTypes.conflictError('invalid password')
        }
    }

    export async function businessExists(businessId:number, card:Card){

        const business =  await businessRepository.findById(businessId);
        if(!business){
            throw errorTypes.notFoundError('business ID not registered');
        }
        else if(business.type !== card.type){
            throw errorTypes.conflictError('business type does not match card type');

        }

        return business

    }

    export async function availableAmountIsSufficient(cardId:number, amount:number){

        const {totalAmount: recharges} = await cashMovement(rechargeRepository, cardId);
        const {totalAmount: payments} = await cashMovement(paymentRepository, cardId);

        if(recharges - payments - amount < 0){

            throw errorTypes.conflictError('insufficient funds'); 
        }
        else{
            return true
        }
    }

    export async function cashMovement(repository:any, cardId:number){

        const transactions = await repository.findByCardId(cardId);
        const totalAmount = transactions?.reduce((sum:any, amount:any):number => {
            return sum + amount.amount;
        },0)

        return {totalAmount, transactions}
    }

    export async function makePayment(paymentData:PaymentInsertData){

        return await paymentRepository.insert(paymentData);
    }