const { chromium } = require('@playwright/test');
const playwrightConfig = require('../../../playwright.config');

class BrowserManager {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async init() {
    const launchOptions = {
      headless: playwrightConfig.use.headless,
      slowMo: playwrightConfig.use.launchOptions?.slowMo || 0,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    };

    this.browser = await chromium.launch(launchOptions);
    
    const contextOptions = {
      viewport: { width: 1920, height: 1080 }
    };

    this.context = await this.browser.newContext(contextOptions);
    this.page = await this.context.newPage();
    
    return this.page;
  }

  async close() {
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }

  async screenshot(name) {
    if (this.page) {
      await this.page.screenshot({ 
        path: `./test-results/screenshots/${name}.png`,
        fullPage: true 
      });
    }
  }
}

module.exports = BrowserManager;
