import joi from "joi";

export const paymentSchema = joi.object({

    amount:joi.number().positive(),
    password: joi.string().regex(/^[0-9]{4}$/).required(),
    businessId: joi.number().positive()
})