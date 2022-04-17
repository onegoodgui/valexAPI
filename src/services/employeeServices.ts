import * as employeeRepository from '../repositories/employeeRepository.js'

export function findEmployeeById(id: number){

    return employeeRepository.findById(id);
}