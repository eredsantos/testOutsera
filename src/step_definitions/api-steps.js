const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const apiClient = require('../support/api/apiClient');
const authHelper = require('../support/api/authHelper');
const { validateSchema, listaProdutosSchema, produtoSchema, cadastroSucessoSchema, alteracaoSucessoSchema, exclusaoSchema } = require('../support/api/schemas');
const { getAllure } = require('../support/allureHelper');

Before({ tags: '@api' }, async function () {
  this.response = null;
  this.productData = null;
  this.productId = null;
  this.products = [];
  this.currentToken = null;
});

After({ tags: '@api' }, async function () {
  authHelper.clearAuth();
  
  if (this.productId) {
    try {
      await authHelper.loginAsAdmin();
      await apiClient.delete(`/produtos/${this.productId}`);
    } catch (error) {}
  }
  
  if (this.products && this.products.length > 0) {
    try {
      await authHelper.loginAsAdmin();
      for (const product of this.products) {
        await apiClient.delete(`/produtos/${product._id}`);
      }
    } catch (error) {}
  }
  
  authHelper.clearAuth();
});

Given('que a API esta disponivel', async function () {
  const allure = getAllure();
  allure.logInfo('🔍 Verificando disponibilidade da API ServeRest...');
  
  const response = await apiClient.get('/produtos');
  expect(response.status).toBeLessThan(500);
  
  allure.logSuccess(`✅ API está disponível e respondendo corretamente (Status: ${response.status})`);
});

Given('que estou autenticado como administrador', async function () {
  const allure = getAllure();
  allure.logInfo('🔐 Realizando autenticação como administrador...');
  
  this.currentToken = await authHelper.loginAsAdmin();
  
  allure.logSuccess('✅ Autenticação realizada com sucesso! Token de administrador obtido.');
});

Given('que estou autenticado como usuario comum', async function () {
  const user = await authHelper.getRegularUser();
  const loginData = {
    email: user.email,
    password: user.password
  };
  const response = await apiClient.post('/login', loginData);
  this.currentToken = response.body.authorization;
  apiClient.setAuthToken(this.currentToken);
});

Given('que nao estou autenticado', async function () {
  authHelper.clearAuth();
  this.currentToken = null;
});

Given('que tenho um token invalido', async function () {
  authHelper.clearAuth();
  this.currentToken = 'Bearer tokeninvalidoxyz123';
  apiClient.setAuthToken(this.currentToken);
});

Given('que existe um produto cadastrado', async function () {
  const allure = getAllure();
  allure.logInfo('📦 Criando produto de teste para usar no cenário...');
  
  await authHelper.loginAsAdmin();
  
  const timestamp = Date.now();
  this.productData = {
    nome: `Produto Teste ${timestamp}`,
    preco: 100,
    descricao: 'Descricao do produto teste',
    quantidade: 50
  };
  
  allure.attachJSON('📋 Dados do Produto Criado', {
    '📝 Nome': this.productData.nome,
    '💰 Preço': `R$ ${this.productData.preco}`,
    '📄 Descrição': this.productData.descricao,
    '📊 Quantidade': this.productData.quantidade
  });
  
  const response = await apiClient.post('/produtos', this.productData);
  expect(response.status).toBe(201);
  
  this.productId = response.body._id;
  allure.logSuccess(`✅ Produto criado com sucesso! ID: ${this.productId}`);
});

Given('que existem dois produtos cadastrados', async function () {
  await authHelper.loginAsAdmin();
  
  const timestamp = Date.now();
  
  const product1 = {
    nome: `Produto Um ${timestamp}`,
    preco: 100,
    descricao: 'Primeiro produto',
    quantidade: 10
  };
  
  const product2 = {
    nome: `Produto Dois ${timestamp}`,
    preco: 200,
    descricao: 'Segundo produto',
    quantidade: 20
  };
  
  const response1 = await apiClient.post('/produtos', product1);
  const response2 = await apiClient.post('/produtos', product2);
  
  this.products = [
    { ...product1, _id: response1.body._id },
    { ...product2, _id: response2.body._id }
  ];
});

Given('que existe um produto em um carrinho', async function () {
  await authHelper.loginAsAdmin();
  
  const timestamp = Date.now();
  this.productData = {
    nome: `Produto em Carrinho ${timestamp}`,
    preco: 150,
    descricao: 'Produto que estara em carrinho',
    quantidade: 100
  };
  
  const produtoResponse = await apiClient.post('/produtos', this.productData);
  this.productId = produtoResponse.body._id;
  
  const user = await authHelper.getRegularUser();
  const loginResponse = await apiClient.post('/login', {
    email: user.email,
    password: user.password
  });
  
  apiClient.setAuthToken(loginResponse.body.authorization);
  
  const carrinhoData = {
    produtos: [
      {
        idProduto: this.productId,
        quantidade: 1
      }
    ]
  };
  
  await apiClient.post('/carrinhos', carrinhoData);
  await authHelper.loginAsAdmin();
});

Given('que tenho os dados validos de um produto', async function () {
  const timestamp = Date.now();
  this.productData = {
    nome: `Produto Valido ${timestamp}`,
    preco: 250,
    descricao: 'Produto com dados validos',
    quantidade: 30
  };
});

Given('que tenho os dados atualizados do produto', async function () {
  const timestamp = Date.now();
  this.productData = {
    nome: `Produto Atualizado ${timestamp}`,
    preco: 300,
    descricao: 'Produto com dados atualizados',
    quantidade: 40
  };
});

Given('que tenho novos dados para todos os campos do produto', async function () {
  const timestamp = Date.now();
  this.productData = {
    nome: `Produto Totalmente Novo ${timestamp}`,
    preco: 500,
    descricao: 'Todos os campos foram alterados',
    quantidade: 100
  };
  this.originalProduct = { ...this.productData };
});

Given('que tenho os dados de um produto com preco {int}', async function (preco) {
  const timestamp = Date.now();
  this.productData = {
    nome: `Produto Preco ${preco} ${timestamp}`,
    preco: preco,
    descricao: 'Produto teste',
    quantidade: 10
  };
});

Given('que tenho os dados de um produto com quantidade {int}', async function (quantidade) {
  const timestamp = Date.now();
  this.productData = {
    nome: `Produto Qtd ${quantidade} ${timestamp}`,
    preco: 100,
    descricao: 'Produto teste',
    quantidade: quantidade
  };
});

Given('que tenho os dados de um produto com o mesmo nome', async function () {
  this.productData = {
    nome: this.products[0].nome,
    preco: 999,
    descricao: 'Tentativa de nome duplicado',
    quantidade: 5
  };
});

Given('que tenho os dados do primeiro produto com nome do segundo', async function () {
  this.productData = {
    nome: this.products[1].nome,
    preco: 888,
    descricao: 'Tentativa de alteracao para nome duplicado',
    quantidade: 15
  };
});

Given('que tenho os dados de um produto sem o campo {string}', async function (campo) {
  const timestamp = Date.now();
  this.productData = {
    nome: `Produto Teste ${timestamp}`,
    preco: 100,
    descricao: 'Produto teste',
    quantidade: 10
  };
  delete this.productData[campo];
});

Given('que tenho os dados do produto sem o campo {string}', async function (campo) {
  const timestamp = Date.now();
  this.productData = {
    nome: `Produto Teste ${timestamp}`,
    preco: 100,
    descricao: 'Produto teste',
    quantidade: 10
  };
  delete this.productData[campo];
});

Given('que tenho os dados de um produto com preco {string}', async function (precoInvalido) {
  const timestamp = Date.now();
  this.productData = {
    nome: `Produto Teste ${timestamp}`,
    preco: precoInvalido,
    descricao: 'Produto teste',
    quantidade: 10
  };
});

Given('que tenho os dados do produto com preco {string}', async function (precoInvalido) {
  const timestamp = Date.now();
  this.productData = {
    nome: `Produto Teste ${timestamp}`,
    preco: precoInvalido,
    descricao: 'Produto teste',
    quantidade: 10
  };
});

Given('que tenho os dados do produto com quantidade {int}', async function (quantidade) {
  const timestamp = Date.now();
  this.productData = {
    nome: `Produto Teste ${timestamp}`,
    preco: 100,
    descricao: 'Produto teste',
    quantidade: quantidade
  };
});

Given('que tenho um payload vazio', async function () {
  this.productData = {};
});

Given('que tenho um JSON malformado', async function () {
  this.malformedJson = true;
});

When('realizo uma requisicao GET para {string}', async function (endpoint) {
  this.response = await apiClient.get(endpoint);
});

When('realizo uma requisicao GET para {string} com o ID do produto', async function (endpoint) {
  const url = endpoint.replace('{id}', this.productId);
  this.response = await apiClient.get(url);
});

When('realizo uma requisicao GET para {string} com o parametro {string}', async function (endpoint, parametro) {
  const params = {};
  params[parametro] = this.productData[parametro];
  this.response = await apiClient.get(endpoint, params);
});

When('realizo uma requisicao POST para {string}', async function (endpoint) {
  if (this.malformedJson) {
    try {
      this.response = await apiClient.client.post(endpoint, '{"nome": malformed}', {
        headers: { 'Content-Type': 'application/json' }
      });
      this.response = apiClient.formatResponse(this.response);
    } catch (error) {
      this.response = { status: 400, body: { message: error.message } };
    }
  } else {
    this.response = await apiClient.post(endpoint, this.productData);
  }
});

When('realizo uma requisicao POST para {string} com JSON invalido', async function (endpoint) {
  try {
    this.response = await apiClient.client.post(endpoint, '{"invalid json"', {
      headers: { 'Content-Type': 'application/json' }
    });
    this.response = apiClient.formatResponse(this.response);
  } catch (error) {
    this.response = { status: 400, body: { message: error.message } };
  }
});

When('realizo uma requisicao PUT para {string}', async function (endpoint) {
  if (this.malformedJson) {
    try {
      this.response = await apiClient.client.put(endpoint, '{"nome": malformed}', {
        headers: { 'Content-Type': 'application/json' }
      });
      this.response = apiClient.formatResponse(this.response);
    } catch (error) {
      this.response = { status: 400, body: { message: error.message } };
    }
  } else {
    this.response = await apiClient.put(endpoint, this.productData);
  }
});

When('realizo uma requisicao PUT para {string} com o ID do produto', async function (endpoint) {
  const url = endpoint.replace('{id}', this.productId);
  this.response = await apiClient.put(url, this.productData);
});

When('realizo uma requisicao PUT para {string} do primeiro produto', async function (endpoint) {
  const url = endpoint.replace('{id}', this.products[0]._id);
  this.response = await apiClient.put(url, this.productData);
});

When('realizo uma requisicao PUT para {string} com JSON invalido', async function (endpoint) {
  const url = endpoint.replace('{id}', this.productId);
  try {
    this.response = await apiClient.client.put(url, '{"invalid json"', {
      headers: { 'Content-Type': 'application/json' }
    });
    this.response = apiClient.formatResponse(this.response);
  } catch (error) {
    this.response = { status: 400, body: { message: error.message } };
  }
});

When('realizo uma requisicao DELETE para {string}', async function (endpoint) {
  this.response = await apiClient.delete(endpoint);
});

When('realizo uma requisicao DELETE para {string} com o ID do produto', async function (endpoint) {
  const url = endpoint.replace('{id}', this.productId);
  this.response = await apiClient.delete(url);
});

When('realizo uma requisicao PATCH para {string}', async function (endpoint) {
  try {
    this.response = await apiClient.client.patch(endpoint, this.productData || {});
    this.response = apiClient.formatResponse(this.response);
  } catch (error) {
    this.response = { status: 405, body: { message: error.message } };
  }
});

When('realizo uma requisicao PATCH para {string} com o ID do produto', async function (endpoint) {
  const url = endpoint.replace('{id}', this.productId);
  try {
    this.response = await apiClient.client.patch(url, this.productData || {});
    this.response = apiClient.formatResponse(this.response);
  } catch (error) {
    this.response = { status: 405, body: { message: error.message } };
  }
});

Then('o status code da resposta deve ser {int}', async function (statusCode) {
  const allure = getAllure();
  allure.logInfo(`🔍 Validando se o status code é ${statusCode}...`);
  
  expect(this.response.status).toBe(statusCode);
  
  allure.logSuccess(`✅ Status code validado corretamente: ${statusCode}`);
});

Then('o header {string} deve conter {string}', async function (header, value) {
  const allure = getAllure();
  allure.logInfo(`🔍 Validando header "${header}" contém "${value}"...`);
  
  const headerValue = this.response.headers[header] || this.response.headers[header.toLowerCase()];
  expect(headerValue).toContain(value);
  
  allure.logSuccess(`✅ Header "${header}" validado corretamente: ${headerValue}`);
});

Then('o corpo da resposta deve conter o campo {string}', async function (campo) {
  const allure = getAllure();
  allure.logInfo(`🔍 Validando se o campo "${campo}" existe na resposta...`);
  
  expect(this.response.body).toHaveProperty(campo);
  expect(this.response.body[campo]).toBeDefined();
  
  const valor = this.response.body[campo];
  allure.logSuccess(`✅ Campo "${campo}" encontrado com valor: ${JSON.stringify(valor)}`);
});

Then('o corpo da resposta deve conter a mensagem {string}', async function (mensagem) {
  const allure = getAllure();
  allure.logInfo(`🔍 Validando se a mensagem contém: "${mensagem}"...`);
  
  const message = this.response.body.message;
  expect(message).toBeDefined();
  expect(message.toLowerCase()).toContain(mensagem.toLowerCase());
  
  allure.logSuccess(`✅ Mensagem validada corretamente: "${message}"`);
});

Then('o corpo da resposta deve conter {string}', async function (texto) {
  const allure = getAllure();
  allure.logInfo(`🔍 Validando se a resposta contém: "${texto}"...`);
  
  const responseString = JSON.stringify(this.response.body).toLowerCase();
  expect(responseString).toContain(texto.toLowerCase());
  
  allure.logSuccess(`✅ Texto "${texto}" encontrado na resposta`);
});

Then('o schema da resposta deve ser valido para lista de produtos', async function () {
  const allure = getAllure();
  allure.logInfo('🔍 Validando schema da resposta contra o schema de lista de produtos...');
  
  validateSchema(this.response.body, listaProdutosSchema);
  
  allure.logSuccess('✅ Schema validado com sucesso! Estrutura da resposta está correta.');
});

Then('o schema da resposta deve ser valido para produto', async function () {
  const allure = getAllure();
  allure.logInfo('🔍 Validando schema da resposta contra o schema de produto...');
  
  validateSchema(this.response.body, produtoSchema);
  
  allure.logSuccess('✅ Schema validado com sucesso! Estrutura do produto está correta.');
});

Then('o schema da resposta deve ser valido para cadastro com sucesso', async function () {
  validateSchema(this.response.body, cadastroSucessoSchema);
  if (this.response.body._id) {
    this.productId = this.response.body._id;
  }
});

Then('o schema da resposta deve ser valido para alteracao com sucesso', async function () {
  validateSchema(this.response.body, alteracaoSucessoSchema);
});

Then('todos os produtos retornados devem conter o nome filtrado', async function () {
  const nomeFiltrado = this.productData.nome;
  expect(this.response.body.produtos).toBeDefined();
  
  if (this.response.body.produtos.length > 0) {
    this.response.body.produtos.forEach(produto => {
      expect(produto.nome).toBe(nomeFiltrado);
    });
  }
});

Then('todos os produtos retornados devem ter o preco filtrado', async function () {
  const precoFiltrado = this.productData.preco;
  expect(this.response.body.produtos).toBeDefined();
  
  if (this.response.body.produtos.length > 0) {
    this.response.body.produtos.forEach(produto => {
      expect(produto.preco).toBe(precoFiltrado);
    });
  }
});

Then('ao consultar o produto os dados devem estar atualizados', async function () {
  const response = await apiClient.get(`/produtos/${this.productId}`);
  expect(response.status).toBe(200);
  expect(response.body.nome).toBe(this.productData.nome);
  expect(response.body.preco).toBe(this.productData.preco);
  expect(response.body.descricao).toBe(this.productData.descricao);
  expect(response.body.quantidade).toBe(this.productData.quantidade);
});

Then('ao consultar o produto ele nao deve mais existir', async function () {
  const response = await apiClient.get(`/produtos/${this.productId}`);
  expect(response.status).toBe(400);
  expect(response.body.message.toLowerCase()).toContain('produto não encontrado');
  this.productId = null;
});
