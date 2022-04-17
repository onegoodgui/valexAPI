import {Router} from 'express';
import { rechargeCard } from '../controllers/rechargesController.js';
import { validateSchemaMiddleware } from '../middlewares/validateSchema.js';
import { rechargeCardSchema } from '../schemas/rechargeSchema.js';

const rechargeRouter = Router();

rechargeRouter.patch('/cards/:id/recharge', validateSchemaMiddleware(rechargeCardSchema), rechargeCard)

export default rechargeRouter