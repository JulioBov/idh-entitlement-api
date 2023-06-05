import express from 'express';
import implementers from '../src/routers/implementers.router.mjs';
import permissions from '../src/routers/permissions.router.mjs';
import users from '../src/routers/users.router.mjs';

const api = express.Router();

api.use('/v1', users);
api.use('/v1', permissions);
api.use('/v1', implementers);

export default api;
