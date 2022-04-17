import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import * as rechargeRepository from '../repositories/rechargeRepository.js';
import { RechargeInsertData } from '../repositories/rechargeRepository';


export async function rechargeCard(rechargeData:RechargeInsertData){

    return await rechargeRepository.insert(rechargeData);
}