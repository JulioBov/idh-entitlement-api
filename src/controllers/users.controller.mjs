import UsersService from '../services/users.service.mjs';
import t from '../translations/translation.mjs';

export const login = async (req, res, next) => {
  try {
    const result = await UsersService.login(req.headers.authorization);
    return res.status(200).json({ message: await t(null, '1'), data: result });
  } catch (err) {
    return next(err);
  }
};

// Troca de senha por dentro do Sistema, ou seja, com o usuário logado
export const changePassword = async (req, res, next) => {
  try {
    await UsersService.changePasswordUser(req.body, req.user);
    return res.status(200).json({ message: await t(req.user._id, '13') });
  } catch (err) {
    return next(err);
  }
};

// Solicitação de Recuperação de Senha
export const requestNewPassword = async (req, res, next) => {
  try {
    await UsersService.requestNewPassword(req.body.email);
    return res.status(200).json({ message: await t(null, '18') });
  } catch (err) {
    return next(err);
  }
};

// Troca de senha oriunda do request acima
export const changePasswordRequest = async (req, res, next) => {
  try {
    await UsersService.changePasswordRequest(req.params.code, req.body);
    return res.status(200).json({ message: await t(null, '13') });
  } catch (err) {
    return next(err);
  }
};

// Criação de Usuários
export const createUser = async (req, res, next) => {
  try {
    await UsersService.create(req.body, req.user);
    return res.status(200).json({ message: await t(req.user._id, '30') });
  } catch (err) {
    return next(err);
  }
};

// Confirmação dos Usuários para Primeiro acesso
export const createFirstAccess = async (req, res, next) => {
  try {
    await UsersService.createFirstAccess(req.body, req.params.code);
    return res.status(200).json({ message: await t(null, '40') });
  } catch (err) {
    return next(err);
  }
};

// Dados do DashBoard, em 2023/06/02
export const usersDashboard = async (req, res, next) => {
  try {
    const result = await UsersService.usersDashboard();
    return res.status(200).json({ message: await t(req.user._id, '42'), data: result });
  } catch (err) {
    return next(err);
  }
};

export const usersList = async (req, res, next) => {
  try {
    const result = await UsersService.usersList(req.query, req.user);
    return res.status(200).json({ message: await t(req.user._id, '42'), data: result });
  } catch (err) {
    return next(err);
  }
};
