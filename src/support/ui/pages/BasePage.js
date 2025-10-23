require('dotenv').config();

class BasePage {
  constructor(page) {
    this.page = page;
    this.baseUrl = process.env.FRONTEND_BASE_URL;
  }

  async waitForPageLoad(timeout = 1000) {
    await this.page.waitForTimeout(timeout);
  }

  async getCurrentUrl() {
    return this.page.url();
  }

  async waitForLoadState(state = 'networkidle') {
    await this.page.waitForLoadState(state);
  }

  async navigate(path = '') {
    const url = path ? `${this.baseUrl}${path}` : this.baseUrl;
    await this.page.goto(url);
    await this.waitForLoadState();
  }
}

module.exports = BasePage;
