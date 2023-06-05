import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { STATUS, USER_TYPE } from '../enums/User.enum.mjs';
import env from '../env.mjs';
import UserModel from '../models/User.model.mjs';
import UsersRepository from '../repository/users.repository.mjs';
import Cache from '../utils/cache.mjs';
import generateCodeOnlyNumbers from '../utils/generateKey.mjs';
import sendEmail from '../utils/sendEmail.mjs';
import {
  validadeLogin,
  validateCreateFirstAccess,
  validateCreateUser,
  validateRequestChangeNewPassword,
  validateRequestNewPassword,
} from './business/users.business.mjs';

async function generatePassword(password) {
  const hash = await new Promise((resolve, reject) => {
    bcrypt.hash(password, 5, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return hash;
}

const login = async (authHeader) => {
  const result = await validadeLogin(authHeader);
  await UsersRepository.updateLastAcess(result._id);
  delete result.password;
  return jwt.sign(result, env.KEY_TOKEN_JWT, { expiresIn: env.TOKEN_EXPIRATION });
};

const create = async (body, user) => {
  const { implementerName, permissionsForUser } = await validateCreateUser(body, user);
  const id = new ObjectId();
  let userForSave = {};
  const code = await generateCodeOnlyNumbers();

  if (body.type === USER_TYPE.ADMIN) {
    userForSave = new UserModel({
      id,
      name: body.name,
      email: body.email,
      phone: body.phone,
      city: body.city,
      state: body.state,
      cpf: body.cpf,
      type: USER_TYPE.ADMIN,
      date_of_birth: body.date_of_birth,
      status: STATUS.INACTIVE,
      permissions: permissionsForUser,
      registered_by: user._id,
      code_first_access: code,
    });
  }
  if (body.type === USER_TYPE.AGENT) {
    userForSave = new UserModel({
      id,
      name: body.name,
      email: body.email,
      phone: body.phone,
      city: body.city,
      state: body.state,
      cpf: body.cpf,
      type: USER_TYPE.AGENT,
      date_of_birth: body.date_of_birth,
      status: STATUS.INACTIVE,
      code_first_access: code,
      registered_by: user._id,
      implementer_id: body.implementer_id,
      implementer_name: implementerName,
      position: body.position,
    });
  }

  await Cache.setValue(`${id}_language`, 'PT');
  await UsersRepository.createUser(userForSave);

  // Esse código deve ser substituido pelo template de email correto
  sendEmail(
    `<h1>Seu código primeiro acesso é ${code}</h1>`,
    body.email,
    'Você foi convidado para fazer parte do APP do IDH'
  );
};

// Troca de senha por dentro do Sistema, ou seja, com o usuário logado
const changePasswordUser = async (body, user) => {
  const password = await generatePassword(body.password);
  await UsersRepository.updatePassword(user._id, password);
};

// Solicitação de Recuperação de Senha
const requestNewPassword = async (email) => {
  const userDb = await validateRequestNewPassword(email);
  const code = await generateCodeOnlyNumbers();
  await UsersRepository.setForgotPasswordCode(userDb._id, code);

  // Esse código deve ser substituido pelo template de email adquado
  sendEmail(
    `<h1>Seu código de recuperação de senha é ${code}</h1>`,
    userDb.email,
    'Solicitação de Recuperação de Senha'
  );
};

// Troca de senha oriunda do request acima
const changePasswordRequest = async (code, body) => {
  const userDb = await validateRequestChangeNewPassword(body, code);
  const password = await generatePassword(body.password);
  await UsersRepository.updatePassword(userDb._id, password);
};

// Confirmação do primeiro acesso
const createFirstAccess = async (body, code) => {
  const userDb = await validateCreateFirstAccess(body, code);
  const password = await generatePassword(body.password);
  await UsersRepository.updatePasswordFirstAccess(userDb._id, password);
};

const usersDashboard = async () => {
  const result = await UsersRepository.getDashboard();
  return result;
};

const usersList = async (query, user) => {
  const result = await UsersRepository.usersList({
    user: user,
    limit: query.limit,
    page: query.page,
    name: query.name,
    email: query.email,
    phone: query.phone,
    city: query.city,
    state: query.state,
    type: query.type,
    position: query.position,
    implementer_id: query.implementer_id,
    id: query.id,
    field: query.field,
    sort: query.sort,
    search: query.search,
  });
  return result;
};

export default {
  login,
  changePasswordUser,
  requestNewPassword,
  changePasswordRequest,
  create,
  createFirstAccess,
  usersDashboard,
  usersList,
};
