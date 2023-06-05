import InternalServerError from '../exceptions/InternalServerError.mjs';
const collectionName = 'permissions';

export const list = async () => {
  try {
    return await global.conn.collection(collectionName).find({}).toArray();
  } catch (err) {
    throw new InternalServerError(err.message);
  }
};

export default {
  list,
};
