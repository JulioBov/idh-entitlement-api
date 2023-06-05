import { list } from '../repository/implementers.repository.mjs';

const listService = async () => {
  return await list();
};

export default {
  listService,
};
