import { cpf } from 'cpf-cnpj-validator';
import joi from 'joi';
import { AGENT_TYPE, USER_TYPE } from '../enums/User.enum.mjs';

export const joiChangePassword = joi.object().keys({
  password: joi
    .string()
    .required()
    .regex(/(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    .messages({
      'any.required': '14',
      'string.pattern.base': '14',
    }),
  confirm_password: joi.equal(joi.ref('password')).messages({
    'any.only': '15',
  }),
});

export const joiRequestNewPassword = joi.object().keys({
  email: joi.string().email().required().messages({
    'any.required': '17',
    'string.empty': '17',
    'string.email': '8',
  }),
});

export const joiChangePasswordRequest = joi.object().keys({
  email: joi.string().email().required().messages({
    'any.required': '17',
    'string.empty': '17',
    'string.email': '8',
  }),
  password: joi
    .string()
    .required()
    .regex(/(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    .messages({
      'any.required': '14',
      'string.pattern.base': '14',
    }),
  confirm_password: joi.equal(joi.ref('password')).messages({
    'any.only': '19',
  }),
});

export const joiCreateFirstAccess = joi.object().keys({
  email: joi.string().email().required().messages({
    'any.required': '17',
    'string.empty': '17',
    'string.email': '8',
  }),
  password: joi
    .string()
    .required()
    .regex(/(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    .messages({
      'any.required': '14',
      'string.pattern.base': '14',
    }),
  confirm_password: joi.equal(joi.ref('password')).messages({
    'any.only': '19',
  }),
});

export const joiCreateUser = joi.object().keys({
  name: joi.string().required().messages({
    'any.required': '22',
    'string.empty': '22',
  }),
  phone: joi.string().required().messages({
    'any.required': '21',
    'string.empty': '21',
  }),
  email: joi.string().email().required().messages({
    'any.required': '17',
    'string.empty': '17',
    'string.email': '8',
  }),
  city: joi.optional().allow('').default(null).messages({}),
  state: joi
    .string()
    .valid(
      'AC',
      'AL',
      'AM',
      'AP',
      'BA',
      'CE',
      'DF',
      'ES',
      'GO',
      'MA',
      'MG',
      'MS',
      'MT',
      'PA',
      'PB',
      'PE',
      'PI',
      'PR',
      'RJ',
      'RN',
      'RO',
      'RR',
      'RS',
      'SC',
      'SE',
      'SP',
      'TO'
    )
    .optional()
    .default(null)
    .allow('')
    .uppercase()
    .messages({
      'any.only': '29',
    }),
  type: joi.string().valid(USER_TYPE.ADMIN, USER_TYPE.AGENT, USER_TYPE.FARMER).required().messages({
    'any.required': '25',
    'any.only': '26',
  }),
  position: joi.any().when('type', {
    is: USER_TYPE.AGENT,
    then: joi
      .string()
      .required()
      .valid(
        AGENT_TYPE.ENVIRONMENTAL_CONSULTING,
        AGENT_TYPE.PROSPECTION,
        AGENT_TYPE.TRACEABILITY,
        AGENT_TYPE.ZOOTECHNICAL_CONSULTING
      )
      .messages({
        'any.required': '28',
        'any.only': '27',
      }),
  }),
  implementer_id: joi.any().when('type', {
    is: USER_TYPE.AGENT,
    then: joi
      .string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/)
      .messages({
        'any.required': '38',
        'string.required': '38',
        'string.pattern.base': '24',
      }),
  }),
  permissions: joi
    .array()
    .optional()
    .min(1)
    .default([])
    .items(
      joi
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .messages({
          'string.pattern.base': '24',
        })
    )
    .messages({ 'array.base': '23', 'array.min': '31' }),
  cpf: joi
    .string()
    .optional()
    .allow('')
    .custom((value, helper) => {
      if (cpf.isValid(value)) {
        return cpf.format(value);
      }
      return helper.message('error');
    })
    .default(null)
    .messages({
      custom: '34',
    }),
  date_of_birth: joi.date().optional().allow('').default(null).messages({
    'date.base': '35',
  }),
});
