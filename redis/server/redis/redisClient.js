import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

const connectToRedis = async () => {
  try {
    await client.connect();
    console.log('REDIS successfully connected!!!');
  } catch (error) {
    console.error('ERROR while connecting to REDIS:', error);
    throw error;
  }
};

export { client, connectToRedis };
