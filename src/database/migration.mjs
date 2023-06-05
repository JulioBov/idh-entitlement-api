import Cache from '../utils/cache.mjs';
import _createGlobal from './_createGlobal.mjs';
import implementers from './data-source/1-implementers.mjs';
import users from './data-source/2-users.mjs';
import permissions from './data-source/3-permissions.mjs';

export const insertImplementers = async () => {
  console.log('--------------------------------------------');
  console.log('1 - Inserindo Implementadoras');
  await _createGlobal(implementers, 'implementers');
};

export const insertUsers = async () => {
  console.log('--------------------------------------------');
  console.log('2 - Inserindo Usuários');
  await _createGlobal(users, 'users');
  users.map(async (u) => {
    await Cache.setValue(`${u._id}_language`, 'PT');
  });
};

export const insertPermissions = async () => {
  console.log('--------------------------------------------');
  console.log('1 - Inserindo Permissoes');
  await _createGlobal(permissions, 'permissions');
};

async function migrateData(migrateType, insertFunction) {
  if (!(await global.conn.collection('migration').findOne({ migrate: migrateType }))) {
    await insertFunction();
    await global.conn.collection('migration').insertOne({ migrate: migrateType, run_date: new Date() });
  }
}

export const runMigrate = async () => {
  console.log('0 - Iniciando Migração');
  await migrateData('implementers', insertImplementers);
  await migrateData('users', insertUsers);
  await migrateData('permissions', insertPermissions);
  console.log('Migração Finalizada');
};

export default runMigrate;
