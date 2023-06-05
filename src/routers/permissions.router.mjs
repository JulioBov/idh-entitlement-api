import express from 'express';

import { list } from '../controllers/permissions.controller.mjs';
import validateToken from '../middleware/validateToken.mjs';

const api = express.Router();

api.get('/permissions', validateToken, list);

export default api;
