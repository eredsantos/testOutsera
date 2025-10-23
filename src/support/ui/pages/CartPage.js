const BasePage = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.shoppingCartProductName = '[data-testid="shopping-cart-product-name"]';
    this.removeFromCartButton = '[data-testid="produto-excluir"]';
    this.clearCartButton = '[data-testid="limparLista"]';
    this.shoppingListLink = '[data-testid="lista-de-compras"]';
    this.homeButton = '[data-testid="paginaInicial"]';
  }

  async navigate() {
    await super.navigate('/listacompras');
  }

  async getProductsInCart() {
    try {
      await this.page.waitForSelector(this.shoppingCartProductName, { timeout: 3000 });
      const productElements = await this.page.locator(this.shoppingCartProductName).all();
      const productNames = [];
      
      for (const element of productElements) {
        const name = await element.textContent();
        const cleanName = name.trim().replace(/^Produto:/, '').trim();
        productNames.push(cleanName);
      }
      
      return productNames;
    } catch {
      return [];
    }
  }

  async isProductInCart(productName) {
    const productsInCart = await this.getProductsInCart();
    return productsInCart.some(name => name === productName);
  }

  async clearCart() {
    // Verifica se já está na página da lista de compras
    const currentUrl = await this.getCurrentUrl();
    const isOnListPage = currentUrl.includes('minhaListaDeProdutos');
    
    let isClearButtonVisible = false;
    
    if (isOnListPage) {
      // Verifica se o botão Limpar Lista está disponível
      try {
        await this.page.waitForSelector(this.clearCartButton, { timeout: 2000 });
        isClearButtonVisible = true;
      } catch {
        isClearButtonVisible = false;
      }
    }
    
    if (!isOnListPage || !isClearButtonVisible) {
      await this.page.click(this.shoppingListLink);
      
      // Aguarda que a URL contenha "minhaListaDeProdutos"
      await this.page.waitForURL('**/minhaListaDeProdutos**', { timeout: 10000 });

      // Aguarda que o botão paginaInicial esteja visível
      await this.page.waitForSelector(this.homeButton, { timeout: 5000 });
    }
    
    await this.page.waitForSelector(this.clearCartButton, { timeout: 5000 });
    await this.page.click(this.clearCartButton);
    await this.waitForLoadState();
  }

  async isCartEmpty() {
    const products = await this.getProductsInCart();
    return products.length === 0;
  }

  async isOnCartPage() {
    const currentUrl = await this.getCurrentUrl();
    return currentUrl.includes('/listacompras');
  }
}

module.exports = CartPage;
