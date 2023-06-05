import { ObjectId } from 'mongodb';
import { STATUS, USER_TYPE } from '../enums/User.enum.mjs';
import InternalServerError from '../exceptions/InternalServerError.mjs';
const collectionName = 'users';

export const createUser = async (user) => {
  try {
    return await global.conn.collection(collectionName).insertOne(user);
  } catch (err) {
    throw new InternalServerError(err.message);
  }
};

export const findByEmail = async (email) => {
  try {
    return await global.conn.collection(collectionName).findOne({ email });
  } catch (err) {
    throw new InternalServerError(err.message);
  }
};

export const findByPhone = async (phone) => {
  try {
    return await global.conn.collection(collectionName).findOne({ phone });
  } catch (err) {
    throw new InternalServerError(err.message);
  }
};

export const findByCPF = async (cpf) => {
  try {
    return await global.conn.collection(collectionName).findOne({ cpf });
  } catch (err) {
    throw new InternalServerError(err.message);
  }
};

export const getDashboard = async () => {
  try {
    return await global.conn
      .collection(collectionName)
      .aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();
  } catch (err) {
    throw new InternalServerError(err.message);
  }
};

export const findById = async (_id) => {
  try {
    return await global.conn.collection(collectionName).findOne({ _id: ObjectId(`${_id}`) });
  } catch (err) {
    throw new InternalServerError(err);
  }
};

export const setForgotPasswordCode = async (_id, code) => {
  try {
    return await global.conn.collection(collectionName).updateOne(
      { _id: ObjectId(`${_id}`), deleted_in: null },
      {
        $set: {
          password_recovery_code: code,
        },
      }
    );
  } catch (err) {
    throw new InternalServerError(err);
  }
};

export const updatePassword = async (_id, password) => {
  try {
    return await global.conn.collection(collectionName).updateOne(
      { _id: ObjectId(`${_id}`) },
      {
        $set: {
          password,
          password_recovery_code: null,
        },
      }
    );
  } catch (err) {
    throw new InternalServerError(err);
  }
};

export const updatePasswordFirstAccess = async (_id, password) => {
  try {
    return await global.conn.collection(collectionName).updateOne(
      { _id: ObjectId(`${_id}`) },
      {
        $set: {
          password,
          status: STATUS.ACTIVE,
          code_first_access: null,
        },
      }
    );
  } catch (err) {
    throw new InternalServerError(err);
  }
};

export const updateLastAcess = async (_id) => {
  try {
    return await global.conn.collection(collectionName).updateOne(
      { _id: ObjectId(`${_id}`) },
      {
        $set: {
          last_acess: new Date(),
        },
      }
    );
  } catch (err) {
    throw new InternalServerError(err);
  }
};

const usersList = async ({
  user,
  limit = 10,
  page = 1,
  name = '',
  email = '',
  phone = '',
  city = '',
  state = '',
  type = '',
  position = '',
  implementer_id = '',
  id = '',
  field = '',
  sort = '',
  search = '',
}) => {
  try {
    const filter = [
      {
        $lookup: {
          from: 'implementers',
          let: { joinIdentifier: '$implementer_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toObjectId: '$_id' }, { $toObjectId: '$$joinIdentifier' }],
                },
              },
            },
          ],
          as: 'implementer',
        },
      },
      { $unwind: { path: '$implementer', preserveNullAndEmptyArrays: true } }, // adicionada a opção preserveNullAndEmptyArrays
    ];

    if (user.type === USER_TYPE.AGENT) {
      filter.push({ $match: { implementer_id: user.implementer_id } });
    }

    const filterExt = {
      $match: {
        $and: [],
      },
    };

    if (id !== '') {
      filterExt.$match.$and.push({ _id: new Object(id) });
    }
    if (name !== '') {
      filterExt.$match.$and.push({ name: name });
    }
    if (email !== '') {
      filterExt.$match.$and.push({ email: email });
    }
    if (phone !== '') {
      filterExt.$match.$and.push({ phone: phone });
    }
    if (city !== '') {
      filterExt.$match.$and.push({ checklis_id: city });
    }

    if (state !== '') {
      filterExt.$match.$and.push({ state: state });
    }

    if (type !== '') {
      filterExt.$match.$and.push({ type: type });
    }
    if (position !== '') {
      filterExt.$match.$and.push({ position: position });
    }
    if (implementer_id !== '') {
      filterExt.$match.$and.push({ 'implementer._id': new Object(implementer_id) });
    }

    if (search !== '') {
      filterExt.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { city: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { 'implementer.name': { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    if (sort !== '' && field !== '') filterExt.push({ $sort: { [field]: parseInt(sort) } });

    if (filterExt.$match.$and.length > 0) {
      filter.push(filterExt);
    }
    filter.push({ $count: 'total' });
    const count = await global.conn.collection(collectionName).aggregate(filter).toArray();

    filter.pop();
    const result = await global.conn
      .collection(collectionName)
      .aggregate(filter)
      .skip(parseInt(limit) * parseInt(page - 1))
      .limit(parseInt(limit))
      .toArray();

    return {
      result,
      count: count.length > 0 ? count[0].total : 0,
    };
  } catch (err) {
    throw new InternalServerError(err);
  }
};

export default {
  findByEmail,
  findByPhone,
  findByCPF,
  findById,
  updatePassword,
  setForgotPasswordCode,
  createUser,
  updatePasswordFirstAccess,
  getDashboard,
  usersList,
  updateLastAcess,
};
