import * as companyRepository from '../repositories/companyRepository.js'

export async function getCompanyFromAPIKey(APIKey:string|string[]){

    const companyAPIKey = APIKey.toString();
    
    return companyRepository.findByApiKey(companyAPIKey);

} 