import jwt from 'jsonwebtoken';
import env from '../env.mjs';
import Unauthorized from '../exceptions/Unauthorized.mjs';

const validateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decode = jwt.verify(token, env.KEY_TOKEN_JWT);
    req.user = decode;
    req.token = token;
    next();
  } catch (err) {
    throw new Unauthorized();
  }
};

export default validateToken;
