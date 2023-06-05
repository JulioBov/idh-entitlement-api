import PermissionsService from '../services/permissions.service.mjs';

export const list = async (req, res, next) => {
  try {
    const result = await PermissionsService.listService();
    return res.status(200).json({ data: result });
  } catch (err) {
    return next(err);
  }
};
