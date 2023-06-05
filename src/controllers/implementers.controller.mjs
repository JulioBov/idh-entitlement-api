import ImplementersService from '../services/implementers.service.mjs';

export const list = async (req, res, next) => {
  try {
    const result = await ImplementersService.listService();
    return res.status(200).json({ data: result });
  } catch (err) {
    return next(err);
  }
};
