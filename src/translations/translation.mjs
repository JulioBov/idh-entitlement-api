import Cache from '../utils/cache.mjs';

const t = async (id, code) => {
  const lg = await Cache.getValue(`${id}_language`);
  if (!lg) return data['PT'][code];
  return data[lg][code];
};

const data = {
  PT: {
    1: 'Login realizado com sucesso',
    2: 'Favor informar os dados de login',
    3: 'Usuário não encontrado',
    4: 'Usuário ou senha incorretos',
    5: 'Consulta realizada com sucesso',
    6: 'Car não encontrado',
    7: 'O car é obrigatório em todos os registros',
    8: 'Email inválido',
    9: 'O arquivo deve conter ao menos uma linha',
    10: 'Listagem obtida com sucesso',
    11: 'Arquivo enviado para processamento com sucesso, em breve você poderá voltar a lista',
    12: 'Arquivo gerado com sucesso',
    13: 'Senha alterada com sucesso',
    14: 'Senha é obrigatória',
    15: 'A confirmação de senha é obrigatória',
    16: 'Usuário cadastrado com sucesso',
    17: 'Email é obrigatório',
    18: 'Requisição de troca de senha realizada com sucesso',
    19: 'As senhas não conferem',
    20: 'Código inválido',
    21: 'Telefone é obrigatório',
    22: 'O Nome é obrigatório',
    23: 'As permissões devem ser um array de ids',
    24: 'Ids inválidos',
    25: 'O tipo de usuário é obrigatório',
    26: 'Tipo inválido',
    27: 'Posição inválida',
    28: 'Posição é obrigátoria',
    29: 'Estado inválido',
    30: 'Usuário criado com sucesso',
    31: 'O array de permissoes deve conter ao menos uma permissão',
    32: 'Email já se encontra em uso',
    33: 'Telefone já se encontra em uso',
    34: 'CPF inválido',
    35: 'Data inválida',
    36: 'CPF já se encontra em uso',
    37: 'Permissões inválidas',
    38: 'A implementadora é obrigatória',
    39: 'A implementadora é inválida',
    40: 'Primeiro acesso confirmado com sucesso',
    41: 'Usuário inativo',
    42: 'Dados do dashboard obtidos com sucesso',
  },
  EN: {},
};

export default t;
