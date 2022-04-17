    import bcrypt from 'bcrypt'
    import * as cardRepository from '../repositories/cardRepository.js'
    import * as businessRepository from '../repositories/businessRepository.js'
    import * as paymentRepository from '../repositories/paymentRepository.js'
    import * as rechargeRepository from '../repositories/rechargeRepository.js'

    export async function passwordVerification(id:number, typedPassword:string){

        const {password: persistedPassword} = await cardRepository.findById(id)

        if(bcrypt.compareSync(typedPassword, persistedPassword)){
            return true
        }
        else{
            return false
        }
    }

    export async function businessExists(businessId:number){

        return await businessRepository.findById(businessId)

    }

    export async function cardAvailableAmount(cardId:number){

        const recharges = await cashMovement(rechargeRepository, cardId);
        const payments = await cashMovement(paymentRepository, cardId);

        return recharges - payments
    }

    export async function cashMovement(repository:any, cardId:number){

        const transactions = await repository.findByCardId(cardId);
        const totalAmount = transactions?.reduce((sum:any, amount:any):number => {
            return sum + amount.amount;
        },0)

        return totalAmount
    }