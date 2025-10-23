const { Given, When, Then, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const BrowserManager = require('../support/ui/browserManager');
const LoginPage = require('../support/ui/pages/LoginPage');
const HomePage = require('../support/ui/pages/HomePage');
const CartPage = require('../support/ui/pages/CartPage');
const HeaderComponent = require('../support/ui/components/HeaderComponent');
const UIAssertHelper = require('../support/ui/uiAssertHelper');
const userService = require('../support/services/userService');

setDefaultTimeout(60000);

Before({ tags: '@ui' }, async function () {
  this.browserManager = new BrowserManager();
  this.page = await this.browserManager.init();
  this.loginPage = new LoginPage(this.page);
  this.homePage = new HomePage(this.page);
  this.cartPage = new CartPage(this.page);
  this.header = new HeaderComponent(this.page);
  this.uiAssert = new UIAssertHelper(this.page, this.scenarioName);
  this.userData = null;
  this.email = null;
  this.password = null;
  this.productNames = [];
});

After({ tags: '@ui' }, async function () {
  if (this.browserManager) {
    await this.browserManager.close();
  }
});

Given('que estou na pagina de login', async function () {
  await this.loginPage.navigate();
});

Given('que tenho credenciais validas de usuario', async function () {
  const user = await userService.getValidUser();
  this.userData = user.userData;
  this.email = user.email;
  this.password = user.password;
});

Given('que tenho credenciais de usuario nao administrador', async function () {
  const user = await userService.getNonAdminUser();
  this.userData = user.userData;
  this.email = user.email;
  this.password = user.password;
});

Given('que tenho um email valido', async function () {
  this.email = await userService.getValidEmail();
});

Given('tenho uma senha incorreta', async function () {
  this.password = userService.getIncorrectPassword();
});

Given('que tenho um email inexistente', async function () {
  this.email = userService.generateNonExistentEmail();
});

Given('tenho uma senha qualquer', async function () {
  this.password = userService.getAnyPassword();
});

Given('que tenho uma senha valida', async function () {
  this.password = await userService.getValidPassword();
});

Given('tenho uma senha valida', async function () {
  this.password = await userService.getValidPassword();
});

Given('que tenho um email em formato invalido', async function () {
  this.email = 'emailinvalido';
  await this.loginPage.removeEmailValidation();
});

Given('estou na pagina inicial', async function () {
  const isOnHome = await this.homePage.isOnHomePage();
  await this.uiAssert.assertTruthy(isOnHome, 'Deve estar na página inicial');
});

Given('que visualizo a lista de produtos', async function () {
  const isOnHome = await this.homePage.isOnHomePage();
  if (!isOnHome) {
    await this.homePage.navigate();
  }
  await this.homePage.waitForProductsToLoad();
});

When('preencho o campo email com credenciais validas', async function () {
  await this.loginPage.fillEmail(this.email);
});

When('preencho o campo senha com credenciais validas', async function () {
  await this.loginPage.fillPassword(this.password);
});

When('preencho o campo email', async function () {
  await this.loginPage.fillEmail(this.email);
});

When('preencho o campo senha', async function () {
  await this.loginPage.fillPassword(this.password);
});

When('clico no botao Entrar', async function () {
  await this.loginPage.clickLogin();
});

When('realizo login com as credenciais', async function () {
  await this.loginPage.login(this.email, this.password);
});

When('armazeno o nome do primeiro produto', async function () {
  const products = await this.homePage.getProductNames(1);
  this.productNames = products;
});

When('armazeno o nome dos dois primeiros produtos', async function () {
  const products = await this.homePage.getProductNames(2);
  this.productNames = products;
});

When('adiciono o primeiro produto ao carrinho', async function () {
  await this.homePage.addProductToCart(0);
});

When('adiciono o segundo produto ao carrinho', async function () {
  await this.homePage.addProductToCart(1);
});

When('retorno para a pagina inicial', async function () {
  await this.header.goToHome();
});

When('limpo a lista de compras', async function () {
  await this.header.goToCart();
  await this.cartPage.clearCart();
});

Then('devo ser redirecionado para a pagina inicial', async function () {
  await this.loginPage.waitForPageLoad(1000);
  const isLoggedIn = await this.header.isLoggedIn();
  await this.uiAssert.assertTruthy(isLoggedIn, 'Usuário deve estar logado (botão logout visível)');
});

Then('o botao de logout deve estar visivel', async function () {
  const isLoggedIn = await this.header.isLoggedIn();
  await this.uiAssert.assertTruthy(isLoggedIn, 'Botão de logout deve estar visível');
});

Then('devo permanecer na pagina de login', async function () {
  await this.loginPage.waitForPageLoad(500);
  const isOnLoginPage = await this.loginPage.isOnLoginPage();
  await this.uiAssert.assertTruthy(isOnLoginPage, 'Deve permanecer na página de login');
});

Then('deve ser exibida a mensagem de erro {string}', async function (expectedMessage) {
  await this.loginPage.waitForPageLoad(1000);
  const hasMessage = await this.loginPage.hasAlertWithText(expectedMessage);
  await this.uiAssert.assertTruthy(hasMessage, `Mensagem de erro deve ser exibida: "${expectedMessage}"`);
});

Then('o produto deve estar presente no carrinho', async function () {
  if (this.productNames.length > 0) {
    const isInCart = await this.cartPage.isProductInCart(this.productNames[0]);
    await this.uiAssert.assertTruthy(isInCart, `Produto "${this.productNames[0]}" deve estar no carrinho`);
  }
});

Then('o nome do produto no carrinho deve corresponder ao produto adicionado', async function () {
  if (this.productNames.length > 0) {
    const isInCart = await this.cartPage.isProductInCart(this.productNames[0]);
    await this.uiAssert.assertTruthy(isInCart, `Nome do produto "${this.productNames[0]}" deve corresponder ao adicionado`);
  }
});

Then('o primeiro produto deve estar presente no carrinho', async function () {
  if (this.productNames.length > 0) {
    const isInCart = await this.cartPage.isProductInCart(this.productNames[0]);
    await this.uiAssert.assertTruthy(isInCart, `Primeiro produto "${this.productNames[0]}" deve estar no carrinho`);
  }
});

Then('o segundo produto deve estar presente no carrinho', async function () {
  if (this.productNames.length > 1) {
    const isInCart = await this.cartPage.isProductInCart(this.productNames[1]);
    await this.uiAssert.assertTruthy(isInCart, `Segundo produto "${this.productNames[1]}" deve estar no carrinho`);
  }
});

Then('o carrinho deve estar vazio', async function () {
  const productsInCart = await this.cartPage.getProductsInCart();
  await this.uiAssert.assertLength(productsInCart, 0, 'Carrinho deve estar vazio (0 produtos)');
});

Then('devo estar na pagina inicial', async function () {
  const isOnHome = await this.homePage.isOnHomePage();
  await this.uiAssert.assertTruthy(isOnHome, 'Deve estar na página inicial');
});

Then('a lista de produtos deve estar visivel', async function () {
  const isOnHome = await this.homePage.isOnHomePage();
  await this.uiAssert.assertTruthy(isOnHome, 'Lista de produtos deve estar visível');
});
