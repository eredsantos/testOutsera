const { expect } = require('@playwright/test');
const { getAllure } = require('../allureHelper');

class UIAssertHelper {
  constructor(page, scenarioName = 'UI Test') {
    this.page = page;
    this.scenarioName = scenarioName;
    this.assertCount = 0;
  }

  async assertWithScreenshot(assertionFn, description) {
    this.assertCount++;
    const allure = getAllure();
    
    try {
      if (this.page) {
        const screenshot = await this.page.screenshot({ fullPage: false });
        allure.attachScreenshot(
          `📸 Screenshot #${this.assertCount}: ${description}`,
          screenshot
        );
      }

      await assertionFn();
      allure.logUIAssertion(description, true);
      
      return true;
    } catch (error) {
      if (this.page) {
        const failureScreenshot = await this.page.screenshot({ fullPage: true });
        allure.attachScreenshot(
          `❌ Falha na Validação #${this.assertCount}: ${description}`,
          failureScreenshot
        );
      }

      allure.logUIAssertion(description, false);
      allure.logError(`Assertion falhou: ${error.message}`);
      
      throw error;
    }
  }

  async assertVisible(selector, description) {
    return this.assertWithScreenshot(
      async () => {
        const element = await this.page.locator(selector);
        await expect(element).toBeVisible();
      },
      description || `Elemento "${selector}" deve estar visível`
    );
  }

  async assertTruthy(value, description) {
    return this.assertWithScreenshot(
      async () => {
        expect(value).toBeTruthy();
      },
      description || 'Valor deve ser verdadeiro'
    );
  }

  async assertFalsy(value, description) {
    return this.assertWithScreenshot(
      async () => {
        expect(value).toBeFalsy();
      },
      description || 'Valor deve ser falso'
    );
  }

  async assertEqual(actual, expected, description) {
    return this.assertWithScreenshot(
      async () => {
        expect(actual).toBe(expected);
      },
      description || `Valor esperado: ${expected}, recebido: ${actual}`
    );
  }

  async assertContains(text, substring, description) {
    return this.assertWithScreenshot(
      async () => {
        expect(text).toContain(substring);
      },
      description || `Texto deve conter: "${substring}"`
    );
  }

  async assertLength(array, expectedLength, description) {
    return this.assertWithScreenshot(
      async () => {
        expect(array.length).toBe(expectedLength);
      },
      description || `Array deve ter ${expectedLength} elementos`
    );
  }

  async captureStep(stepDescription) {
    const allure = getAllure();
    
    if (this.page) {
      const screenshot = await this.page.screenshot({ fullPage: false });
      allure.attachScreenshot(
        `📷 ${stepDescription}`,
        screenshot
      );
      allure.logUIAction(stepDescription);
    }
  }
}

module.exports = UIAssertHelper;
