import mongodb from 'mongodb';
import env from '../env.mjs';

async function connection() {
  const client = new mongodb.MongoClient(env.CONNECTION_STRING, { useUnifiedTopology: true });
  try {
    await client.connect();
    global.conn = client.db(env.MONGO_BASE_NAME);
  } catch (error) {
    console.error(`Error ${error}`);
  }
}

export default connection;
