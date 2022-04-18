import express, {json} from 'express';
import "express-async-errors";
import cors from 'cors';
import router from './src/routers/index.js';
import handleErrorsMiddleware from './src/middlewares/handleErrorsMiddleware.js';

const app = express();
app.use(cors());
app.use(json());
app.use(router);

app.use(handleErrorsMiddleware)

app.listen(4000, () => {
    console.log("running on 4000");
  });
