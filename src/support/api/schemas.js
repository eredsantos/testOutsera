const Joi = require('joi');

const produtoSchema = Joi.object({
  nome: Joi.string().required(),
  preco: Joi.number().integer().min(1).required(),
  descricao: Joi.string().required(),
  quantidade: Joi.number().integer().min(0).required(),
  _id: Joi.string().required(),
  imagem: Joi.string().optional()
});

const listaProdutosSchema = Joi.object({
  quantidade: Joi.number().integer().min(0).required(),
  produtos: Joi.array().items(produtoSchema).required()
});

const cadastroSucessoSchema = Joi.object({
  message: Joi.string().required(),
  _id: Joi.string().required()
});

const alteracaoSucessoSchema = Joi.object({
  message: Joi.string().valid('Registro alterado com sucesso').required()
});

const exclusaoSchema = Joi.object({
  message: Joi.string().required()
});

const erroSchema = Joi.object({
  message: Joi.string().required()
}).unknown(true);

const loginSchema = Joi.object({
  message: Joi.string().required(),
  authorization: Joi.string().required()
});

const usuarioSchema = Joi.object({
  nome: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  administrador: Joi.string().valid('true', 'false').required(),
  _id: Joi.string().required()
});

const listaUsuariosSchema = Joi.object({
  quantidade: Joi.number().integer().min(0).required(),
  usuarios: Joi.array().items(usuarioSchema).required()
});

function validateSchema(data, schema) {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(`Erro na validacao do schema: ${error.message}`);
  }
  return value;
}

module.exports = {
  produtoSchema,
  listaProdutosSchema,
  cadastroSucessoSchema,
  alteracaoSucessoSchema,
  exclusaoSchema,
  erroSchema,
  loginSchema,
  usuarioSchema,
  listaUsuariosSchema,
  validateSchema
};
