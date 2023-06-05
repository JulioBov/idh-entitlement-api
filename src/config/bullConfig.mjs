import Queue from 'bull';
import env from '../env.mjs';

const queueConfig = {
  redis: {
    host: env.HOST_REDIS,
    port: env.PORT_REDIS,
  },
};

const queueValidateProgram = new Queue('validate_program', queueConfig);

export default queueValidateProgram;
