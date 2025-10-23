const BasePage = require('./BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.productContainer = '.container-fluid';
    this.productTitle = '.card-title.negrito';
    this.addToCartButton = '[data-testid="adicionarNaLista"]';
  }

  async navigate() {
    await super.navigate('/home');
  }

  async isOnHomePage() {
    try {
      await this.page.waitForSelector(this.addToCartButton, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getProductNames(count = 2) {
    await this.page.waitForSelector(this.productTitle);
    const productElements = await this.page.locator(this.productTitle).all();
    const productNames = [];
    
    for (let i = 0; i < Math.min(count, productElements.length); i++) {
      const name = await productElements[i].textContent();
      productNames.push(name.trim());
    }
    
    return productNames;
  }

  async addProductToCart(productIndex = 0) {
    await this.page.waitForSelector(this.addToCartButton);
    const addButtons = await this.page.locator(this.addToCartButton).all();
    
    if (addButtons.length > productIndex) {
      await addButtons[productIndex].click();
      await this.waitForLoadState();
      await this.waitForPageLoad(1000);
    } else {
      throw new Error(`Produto no indice ${productIndex} nao encontrado`);
    }
  }

  async waitForProductsToLoad() {
    await this.page.waitForSelector(this.productTitle);
  }
}

module.exports = HomePage;
