const { Before, After, BeforeAll, AfterAll, Status } = require('@cucumber/cucumber');
const { getAllure } = require('./allureHelper');

BeforeAll(function () {
  const allure = getAllure();
  
  allure.writeEnvironmentInfo({
    'Node Version': process.version,
    'OS': process.platform,
    'Test Type': 'API & UI Tests',
    'Framework': 'Cucumber + Playwright',
    'Headless Mode': process.env.HEADLESS || 'auto',
    'Screenshot Mode': process.env.SCREENSHOT || 'only-on-failure'
  });
});

Before(function (scenario) {
  this.featureName = scenario.pickle.uri.split('/').pop().replace('.feature', '');
  this.scenarioName = scenario.pickle.name;
  this.isUITest = scenario.pickle.tags.some(tag => tag.name === '@ui');
  
  const allure = getAllure();
  allure.startSuite(this.featureName);
  allure.startTest(this.scenarioName, this.featureName);
  
  if (this.isUITest) {
    allure.logInfo(`🎭 Iniciando teste de UI: ${this.scenarioName}`);
  }
});

After(async function (scenario) {
  const allure = getAllure();
  const isUITest = this.isUITest;
  
  if (isUITest && this.browserManager && this.browserManager.page) {
    try {
      const screenshot = await this.browserManager.page.screenshot({ fullPage: true });
      
      if (scenario.result.status === Status.FAILED) {
        await this.attach(screenshot, 'image/png');
        allure.attachScreenshot('❌ Screenshot Final - Teste Falhou', screenshot);
        allure.logError(`Teste falhou: ${scenario.result.message}`);
      } else if (scenario.result.status === Status.PASSED) {
        allure.attachScreenshot('✅ Screenshot Final - Teste Passou', screenshot);
        allure.logSuccess('Teste executado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao processar anexos de UI:', error);
    }
  }
  
  if (scenario.result.status === Status.FAILED) {
    allure.endTest('failed', scenario.result.message);
  } else if (scenario.result.status === Status.PASSED) {
    allure.endTest('passed');
  } else {
    allure.endTest('broken');
  }
  
  allure.endSuite();
});
