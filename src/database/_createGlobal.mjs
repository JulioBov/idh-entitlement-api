import { ObjectId } from 'mongodb';

export const _createGlobal = async (array, collection) => {
  await Promise.all(
    array.map(async (data) => {
      const result = await global.conn.collection(collection).findOne({ _id: ObjectId(`${data._id}`) });

      if (result === null) {
        data._id = ObjectId(`${data._id}`);
        return await global.conn.collection(collection).insertOne(data);
      }
    })
  );
};

export default _createGlobal;
