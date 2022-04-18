import * as employeeRepository from '../repositories/employeeRepository.js'
import { errorTypes } from '../middlewares/handleErrorsMiddleware.js';

export async function findEmployeeById(id: number){

    const employee = await employeeRepository.findById(id);

    if(!employee){
        throw errorTypes.notFoundError('employee ID does not exist')
    }

    return employee
}