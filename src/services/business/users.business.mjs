import base64 from 'base-64';
import bcrypt from 'bcrypt';
import { STATUS, USER_TYPE } from '../../enums/User.enum.mjs';
import NotFound from '../../exceptions/NotFound.mjs';
import UnprocessableEntity from '../../exceptions/Unauthorized.mjs';
import ImplementersRepository from '../../repository/implementers.repository.mjs';
import PermissionsRepository from '../../repository/permissions.repository.mjs';
import UsersRepository from '../../repository/users.repository.mjs';
import t from '../../translations/translation.mjs';

export const validadeLogin = async (authHeader) => {
  if (!authHeader) throw new NotFound(await t('2'));

  const encodedCredentials = authHeader.split(' ')[1];
  const decodedCredentials = base64.decode(encodedCredentials);
  const [username, password] = decodedCredentials.split(':');

  const userDb = await UsersRepository.findByEmail(username);
  if (!userDb) throw new NotFound(await t(null, '3'));

  if (userDb.status !== STATUS.ACTIVE) throw new NotFound(await t(null, '41'));

  const match = await bcrypt.compare(password, userDb.password);
  if (!match) throw new NotFound(await t(null, '4'));

  return userDb;
};

export const validateRequestNewPassword = async (email) => {
  const userDb = await UsersRepository.findByEmail(email);
  if (!userDb) throw new NotFound(await t(null, '3'));
  return userDb;
};

export const validateRequestChangeNewPassword = async (body, code) => {
  const userDb = await UsersRepository.findByEmail(body.email);
  if (!userDb) throw new NotFound(await t(null, '3'));
  if (userDb.password_recovery_code !== code) throw new NotFound(await t(null, '20'));
  return userDb;
};

export const validateCreateFirstAccess = async (body, code) => {
  const userDb = await UsersRepository.findByEmail(body.email);
  if (!userDb) throw new NotFound(await t(null, '3'));
  if (userDb.code_first_access !== code) throw new NotFound(await t(null, '20'));
  return userDb;
};

export const validateCreateUser = async (body, user) => {
  let implementerName = '';
  let permissionsForUser = [];
  const userDb1 = await UsersRepository.findByEmail(body.email);
  if (userDb1) throw new UnprocessableEntity(await t(user._id, '32'));

  const userDb2 = await UsersRepository.findByPhone(body.phone);
  if (userDb2) throw new UnprocessableEntity(await t(user._id, '33'));

  if (body.cpf) {
    const userDb3 = await UsersRepository.findByPhone(body.cpf);
    if (userDb3) throw new UnprocessableEntity(await t(user._id, '36'));
  }

  if (body.type === USER_TYPE.ADMIN) {
    // Devemos confirmar se todas as permissoes passadas estao corretas, ou seja, se existem
    if (body.permissions.length > 0) {
      const permissions = await PermissionsRepository.list();
      const areAllElementsPresent = body.permissions.every((id) =>
        permissions.some((obj) => obj._id.toString() === id)
      );
      if (!areAllElementsPresent) throw new UnprocessableEntity(await t(user._id, '37'));

      permissionsForUser = permissions.filter((obj) => body.permissions.includes(obj._id.toString())).map((obj) => obj);
    }
  }

  // Caso seja agente, devemos verificar se a implementora informada é válida
  if (body.type === USER_TYPE.AGENT) {
    const result = await ImplementersRepository.list();
    if (!result.find((x) => x._id.toString() === body.implementer_id)) {
      throw new NotFound(await t(user._id, '39'));
    } else {
      const imp = result.find((x) => x._id.toString() === body.implementer_id);
      implementerName = imp.name;
    }
  }

  return { implementerName, permissionsForUser };
};
