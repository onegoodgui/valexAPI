import { Router } from "express";
import { makePayment } from "../controllers/paymentsController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchema.js";
import { paymentSchema } from "../schemas/paymentSchema.js";

const paymentsRouter = Router();

paymentsRouter.post('/cards/:id/payment', validateSchemaMiddleware(paymentSchema), makePayment);

export default paymentsRouter;