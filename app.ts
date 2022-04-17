import express, {json} from 'express';
import cors from 'cors';
import router from './src/routers/index.js';

const app = express();
app.use(cors());
app.use(json());
app.use(router);



app.listen(4000, () => {
    console.log("running on 4000");
  });
