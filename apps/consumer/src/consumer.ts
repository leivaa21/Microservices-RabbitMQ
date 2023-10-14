import amqp, { Channel, Message } from "amqplib";
import { env } from "./config";
import { Event } from "./types";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const RETRY_TIME = 3 * 1000;

export class Consumer {

  static async intialize(url: string, queueName: string) {
    
    try {
      const connection = await amqp.connect(url);
      const channel = await connection.createChannel();
      channel.assertQueue(queueName, { durable: true })
      channel.consume(queueName, (msg: Message | null) => {
        if (msg) {
          const message: Event = JSON.parse(msg.content.toString())
          switch (message.EVENT_NAME) {
            case 'EVENT.USER_WAS_CREATED':
              console.log('USER WAS CREATED', message.data)
              break
            case 'EVENT.USER_WAS_DELETED':
              console.log('USER WAS DELETED', message.data)
              break
            default:
              console.log('RECEIVED UNKNOWN ACTION', message)
              break
          }
        }
      }, { noAck: true })
      console.info('Connected to rabbitmq');
    } catch(err) {
      console.error(`Error connecting to rabbit, retrying on ${RETRY_TIME}ms`, err)
      await sleep(RETRY_TIME);
      this.intialize(url, queueName);
    }

  }

}

Consumer.intialize(env.rabbit.url, env.rabbit.queue);
