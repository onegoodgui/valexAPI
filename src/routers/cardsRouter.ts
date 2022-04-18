import {Router} from 'express';
import { createCard, activateCard, cardBalance } from '../controllers/cardsController.js';
import { validateSchemaMiddleware } from '../middlewares/validateSchema.js';
import { createCardSchema, updatePasswordSchema } from '../schemas/cardsSchema.js';

const cardsRouter = Router();

cardsRouter.post('/cards', validateSchemaMiddleware(createCardSchema), createCard);
cardsRouter.put('/cards/:id/activation', validateSchemaMiddleware(updatePasswordSchema) ,activateCard);
cardsRouter.get('/cards/:id/balance', cardBalance);


export default cardsRouter;