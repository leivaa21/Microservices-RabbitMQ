import amqp, { Channel } from 'amqplib'
import { env } from './config';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const RETRY_TIME = 3 * 1000;

export class Producer {

  static instance: Producer;

  constructor(
    private readonly channel: Channel,
    private readonly queueName: string,
  ) {}

  static async intialize(url: string, queueName: string) {
    
    try {
      const connection = await amqp.connect(url);
      const channel = await connection.createChannel();
      console.info('Connected to rabbitmq');
      this.instance = new Producer(channel, queueName);
    } catch(err) {
      console.error(`Error connecting to rabbit, retrying on ${RETRY_TIME}ms`, err)
      await sleep(RETRY_TIME);
      this.intialize(url, queueName);
    }

  }

  static getInstance(): Producer {
    if(!this.instance) throw new Error('Error');
    return this.instance;
  }


  public send(message: string) {
    this.channel.sendToQueue(this.queueName, Buffer.from(message));
  }

}
Producer.intialize(env.rabbit.url, env.rabbit.queue);