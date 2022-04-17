import joi from "joi";

export const rechargeCardSchema = joi.object({

    amount:joi.number().positive()
})