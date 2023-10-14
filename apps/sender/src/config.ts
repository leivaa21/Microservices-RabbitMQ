import 'dotenv/config';

export const env = {
  port: process.env.PORT,
  rabbit: {
    url: process.env.RABBIT_MQ_URL || '',
    queue: process.env.RABBIT_MQ_QUEUE || '',
  }
}