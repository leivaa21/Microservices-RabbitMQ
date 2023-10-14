import { Router } from "express";
import { Producer } from "./producer";

const router = Router();

router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

router.post('/users', async (req, res, next) => {
  const { body } = req;

  const { id, email, nickname } = body;

  if(!id || !email || !nickname) {
    res.status(400).send()
  }

  const message = JSON.stringify({
    EVENT_NAME: 'EVENT.USER_WAS_CREATED',
    data: {
      id, email, nickname
    }
  });
  const sender = Producer.getInstance();
  sender.send(message);
  res.status(200).send()
})

router.delete('/users', async (req, res, next) => {
  const { body } = req;

  const {id} = body;

  if(!id ) {
    res.status(400).send()
  }

  const message = JSON.stringify({
    EVENT_NAME: 'EVENT.USER_WAS_DELETED',
    data: {
      id,
    }
  });
  const sender = Producer.getInstance();
  sender.send(message);
  res.status(200).send()
})

export { router };