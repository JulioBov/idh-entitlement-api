import t from '../translations/translation.mjs';

export const validationPayload = (rules) => async (req, res, next) => {
  const { error, value } = rules.validate(req.body);
  if (error) {
    const { details } = error;
    console.log('AQUI', details);
    const code = details.map((i) => i.message).join(',');
    const traduction = await t(req.user ? req.user._id : null, code);
    res.status(422).json({ message: traduction });
  } else {
    req.body = value;
    next();
  }
};

export default validationPayload;
