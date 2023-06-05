import express from 'express';

import { list } from '../controllers/implementers.controller.mjs';
import validateToken from '../middleware/validateToken.mjs';

const api = express.Router();

api.get('/implementers', validateToken, list);

export default api;
