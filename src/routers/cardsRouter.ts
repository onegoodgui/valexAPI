import {Router} from 'express';
import { createCard, activateCard } from '../controllers/cardsController.js';
import { validateSchemaMiddleware } from '../middlewares/validateSchema.js';
import { createCardSchema, updatePasswordSchema } from '../schemas/cardsSchema.js';

const cardsRouter = Router();

cardsRouter.post('/cards', validateSchemaMiddleware(createCardSchema), createCard);
cardsRouter.put('/cards/:id/activation', validateSchemaMiddleware(updatePasswordSchema) ,activateCard);


export default cardsRouter;