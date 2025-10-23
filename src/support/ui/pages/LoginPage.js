const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = '#email';
    this.passwordInput = '#password';
    this.loginButton = '[data-testid="entrar"]';
    this.alertMessage = '.alert';
  }

  async navigate() {
    await super.navigate('/login');
  }

  async fillEmail(email) {
    await this.page.fill(this.emailInput, email);
  }

  async fillPassword(password) {
    await this.page.fill(this.passwordInput, password);
  }

  async clickLogin() {
    await this.page.click(this.loginButton);
    await this.waitForLoadState();
  }

  async login(email, password) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async getAlertMessage() {
    try {
      const alert = await this.page.locator(this.alertMessage).first();
      return await alert.textContent();
    } catch {
      return null;
    }
  }

  async getAllAlertMessages() {
    try {
      await this.page.waitForSelector('.alert', { timeout: 5000, state: 'visible' });
      await this.page.waitForTimeout(500);
      
      const alerts = await this.page.locator('.alert').all();
      const messages = [];
      
      for (const alert of alerts) {
        const text = await alert.textContent();
        const cleanText = text.replace('×', '').trim();
        messages.push(cleanText);
      }
      
      return messages;
    } catch (error) {
      return [];
    }
  }

  async hasAlertWithText(expectedText) {
    const alerts = await this.getAllAlertMessages();
    return alerts.some(msg => msg.includes(expectedText));
  }

  async clearEmail() {
    await this.page.fill(this.emailInput, '');
  }

  async clearPassword() {
    await this.page.fill(this.passwordInput, '');
  }

  async clearFields() {
    await this.clearEmail();
    await this.clearPassword();
  }

  async removeEmailValidation() {
    await this.page.evaluate(() => {
      const emailInput = document.querySelector('#email');
      if (emailInput) {
        emailInput.removeAttribute('type');
        emailInput.setAttribute('type', 'text');
      }
    });
  }

  async isOnLoginPage() {
    const currentUrl = await this.getCurrentUrl();
    return currentUrl.includes('/login');
  }
}

module.exports = LoginPage;
