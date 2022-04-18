import * as companyRepository from '../repositories/companyRepository.js'
import { errorTypes } from '../middlewares/handleErrorsMiddleware.js';

export async function getCompanyFromAPIKey(APIKey:string|string[]){

    const companyAPIKey = APIKey.toString();
    
    if(await companyRepository.findByApiKey(companyAPIKey)){
        return companyRepository.findByApiKey(companyAPIKey)
    }
    else{
        throw errorTypes.notFoundError('company not registered')
    }

} 