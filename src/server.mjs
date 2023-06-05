import cors from 'cors';
import express from 'express';
import responseTime from 'response-time';
import runMigrate from '../src/database/migration.mjs';
import connection from '../src/database/mongodb.mjs';
import NotFound from '../src/exceptions/NotFound.mjs';
import env from './env.mjs';
import exportError from './exportError.mjs';
import routers from './routes.mjs';

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(responseTime());
app.use(routers);

app.get('/health', async (req, res) => {
  try {
    res.status(200).send({ message: 'Tudo ok com a aplicação' });
  } catch (err) {
    res.status(500).json({ message: 'MongoDb is sick' });
  }
});

app.use((req, res, next) => {
  next(new NotFound());
});

app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  return exportError(statusCode, message, err, req, res);
});

app.listen(process.env.PORT || env.PORT, async () => {
  console.info('Connecting to the database...');
  global.db = await connection();
  await runMigrate();
  console.info('Connected database');
  console.log(`👨‍🌾Server running on port: ${env.PORT}`);
});

export default app;
