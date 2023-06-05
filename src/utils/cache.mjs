import Redis from 'ioredis';
import env from '../env.mjs';

class Cache {
  constructor() {
    this.redis = new Redis({
      host: env.hostRedis,
      port: env.portRedis,
    });
  }

  async getValue(key) {
    const resp = await this.redis.get(key);
    return resp ? JSON.parse(resp) : false;
  }

  async setValue(key, value) {
    return this.redis.set(key, JSON.stringify(value));
  }

  async setExpire(key, seconds = 10) {
    return this.redis.expire(key, seconds);
  }

  async delValue(key) {
    return this.redis.del(key);
  }
}

export default new Cache();
