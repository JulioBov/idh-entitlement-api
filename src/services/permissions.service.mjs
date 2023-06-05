import { list } from '../repository/permissions.repository.mjs';

const listService = async () => {
  return await list();
};

export default {
  listService,
};
