import joi from "joi";

export const createCardSchema = joi.object({

    companyId:joi.number().positive(),
    employeeId: joi.number().positive(),
    cardtype: joi.string().valid('groceries', 'health', 'education','restaurants', 'transports').required()
})

export const updatePasswordSchema = joi.object({

    securityCode: joi.string().regex(/^[0-9]{3}$/).required(),
    password: joi.string().regex(/^[0-9]{4}$/).required()
})