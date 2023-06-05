import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  changePassword,
  changePasswordRequest,
  createFirstAccess,
  createUser,
  login,
  requestNewPassword,
  usersDashboard,
  usersList,
} from '../controllers/users.controller.mjs';
import validateToken from '../middleware/validateToken.mjs';
import validationPayload from '../utils/validatePayload.mjs';
import {
  joiChangePassword,
  joiChangePasswordRequest,
  joiCreateFirstAccess,
  joiCreateUser,
  joiRequestNewPassword,
} from '../validations/users.validation.mjs';

const api = express.Router();

const limiter = rateLimit({
  windowMs: 60000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

// Login dos usuários
api.post('/users/login', limiter, login);

// Troca de senha por dentro do Sistema, ou seja, com o usuário logado
api.patch('/users/:id/change-password', validateToken, validationPayload(joiChangePassword), changePassword);

// Criação do Usuário de Qualquer Tipo
api.post('/users', validateToken, validationPayload(joiCreateUser), createUser);

// Solicitação de Recuperação de Senha
api.patch('/users/request-new-password', validationPayload(joiRequestNewPassword), requestNewPassword);
// Troca de senha oriunda do request acima
api.patch('/users/:code/request-change-password', validationPayload(joiChangePasswordRequest), changePasswordRequest);

// Confirmação de Primeiro Acesso
api.put('/users/:code/first-access', validationPayload(joiCreateFirstAccess), createFirstAccess);

// Dashboard Users
api.get('/users/dashboard', validateToken, usersDashboard);

api.get('/users', validateToken, usersList);

export default api;
