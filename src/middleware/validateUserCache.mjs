import Forbidden from '../exceptions/Forbidden.mjs';
import Cache from '../utils/cache.mjs';

const validateUserActive = async (req, res, next) => {
  try {
    const resultCache = await Cache.getValue(`${req.user.user._id}_inactive`);
    if (resultCache) throw new Forbidden('Inactive User');
    next();
  } catch (erro) {
    return next(erro);
  }
};

export default validateUserActive;
