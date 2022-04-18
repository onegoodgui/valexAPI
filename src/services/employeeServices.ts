import * as employeeRepository from '../repositories/employeeRepository.js'
import { errorTypes } from '../middlewares/handleErrorsMiddleware.js';

export async function findEmployeeById(id: number, companyId: number){

    const employee = await employeeRepository.findById(id);

    if(!employee){
        throw errorTypes.notFoundError('employee ID does not exist')
    }
    else if(employee.companyId !== companyId){
        console.log('oi')
        throw errorTypes.conflictError('card type does not match company type')
    }

    return employee
}