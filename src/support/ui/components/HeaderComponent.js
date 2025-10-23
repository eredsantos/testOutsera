class HeaderComponent {
  constructor(page) {
    this.page = page;
    this.logoutButton = '[data-testid="logout"]';
    this.cartLink = '[data-testid="shopping-cart"]';
    this.shoppingListLink = '[data-testid="lista-de-compras"]';
    this.homeButton = '[data-testid="paginaInicial"]';
  }

  async isLoggedIn() {
    try {
      await this.page.waitForSelector(this.logoutButton, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async logout() {
    await this.page.click(this.logoutButton);
    await this.page.waitForLoadState('networkidle');
  }

  async goToHome() {
    await this.page.click(this.homeButton);
    await this.page.waitForLoadState('networkidle');
  }

  async goToCart() {
    await this.page.click(this.shoppingListLink);
    
    await this.page.waitForURL('**/minhaListaDeProdutos**', { timeout: 10000 });
    
    await this.page.waitForSelector(this.homeButton, { timeout: 5000 });
    
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = HeaderComponent;
