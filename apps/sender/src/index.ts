import express from 'express';

import { env } from './config';
import { router } from './router';

const app = express();

app.use(express.json());
app.use(router);
app.listen(env.port, () => {
  console.log(`Listening on port ${env.port}`)
})