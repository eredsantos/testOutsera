const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class AllureHelper {
  constructor() {
    this.resultsDir = './allure-results';
    this.currentTest = null;
    this.attachments = [];
    
    // Cria diretório se não existir
    if (!fs.existsSync(this.resultsDir)) {
      fs.mkdirSync(this.resultsDir, { recursive: true });
    }
  }

  startSuite(suiteName) {
    this.suiteName = suiteName;
  }

  startTest(testName, featureName) {
    this.currentTest = {
      uuid: uuidv4(),
      name: testName,
      fullName: `${featureName}: ${testName}`,
      historyId: testName,
      start: Date.now(),
      stage: 'running',
      attachments: []
    };
    this.attachments = [];
  }

  attachJSON(name, json) {
    if (this.currentTest) {
      try {
        const jsonString = typeof json === 'string' ? json : JSON.stringify(json, null, 2);
        const fileName = `${uuidv4()}-attachment.json`;
        const filePath = path.join(this.resultsDir, fileName);
        
        fs.writeFileSync(filePath, jsonString);
        
        this.attachments.push({
          name: name,
          source: fileName,
          type: 'application/json'
        });
      } catch (error) {
        console.error('Error attaching JSON to Allure:', error);
      }
    }
  }

  attachText(name, text) {
    if (this.currentTest) {
      try {
        const textString = typeof text === 'string' ? text : String(text);
        const fileName = `${uuidv4()}-attachment.txt`;
        const filePath = path.join(this.resultsDir, fileName);
        
        fs.writeFileSync(filePath, textString);
        
        this.attachments.push({
          name: name,
          source: fileName,
          type: 'text/plain'
        });
      } catch (error) {
        console.error('Error attaching text to Allure:', error);
      }
    }
  }

  attachScreenshot(name, screenshot) {
    if (this.currentTest && screenshot) {
      try {
        const fileName = `${uuidv4()}-attachment.png`;
        const filePath = path.join(this.resultsDir, fileName);
        
        fs.writeFileSync(filePath, screenshot);
        
        this.attachments.push({
          name: name,
          source: fileName,
          type: 'image/png'
        });
      } catch (error) {
        console.error('Error attaching screenshot to Allure:', error);
      }
    }
  }

  logUIAction(action, details = '') {
    const message = details ? `${action}\n\nDetalhes: ${details}` : action;
    this.attachText('🖱️ Ação de UI', message);
  }

  logUIAssertion(assertion, result) {
    const emoji = result ? '✅' : '❌';
    const status = result ? 'PASSOU' : 'FALHOU';
    this.attachText(`${emoji} Validação de UI`, `${assertion}\n\nResultado: ${status}`);
  }

  addStep(stepName, status = 'passed') {
    if (this.currentTest) {
      if (!this.currentTest.steps) {
        this.currentTest.steps = [];
      }
      this.currentTest.steps.push({
        name: stepName,
        status: status,
        stage: 'finished',
        start: Date.now(),
        stop: Date.now()
      });
    }
  }

  logInfo(message) {
    this.attachText('ℹ️ Informação', message);
  }

  logSuccess(message) {
    this.attachText('✅ Sucesso', message);
  }

  logWarning(message) {
    this.attachText('⚠️ Aviso', message);
  }

  logError(message) {
    this.attachText('❌ Erro', message);
  }

  logApiRequest(method, endpoint, details = {}) {
    const requestInfo = {
      '🌐 Método HTTP': method,
      '🎯 Endpoint': endpoint,
      '🔗 URL Completa': `${details.baseURL || ''}${endpoint}`,
      '📤 Descrição': this.getRequestDescription(method, endpoint)
    };

    if (details.payload && Object.keys(details.payload).length > 0) {
      requestInfo['📦 Payload Enviado'] = details.payload;
    }

    if (details.params && Object.keys(details.params).length > 0) {
      requestInfo['🔍 Query Parameters'] = details.params;
    }

    if (details.headers && Object.keys(details.headers).length > 0) {
      const safeHeaders = { ...details.headers };
      if (safeHeaders.Authorization) {
        safeHeaders.Authorization = safeHeaders.Authorization.substring(0, 20) + '...';
      }
      requestInfo['📋 Headers'] = safeHeaders;
    }

    this.attachJSON('📤 REQUISIÇÃO ENVIADA', requestInfo);
  }

  logApiResponse(response, additionalInfo = '') {
    const statusEmoji = response.status >= 200 && response.status < 300 ? '✅' : 
                        response.status >= 400 && response.status < 500 ? '⚠️' : 
                        response.status >= 500 ? '❌' : 'ℹ️';

    const responseInfo = {
      [`${statusEmoji} Status Code`]: response.status,
      '📊 Status Text': response.statusText,
      '💬 Descrição': this.getStatusDescription(response.status),
      '📥 Resposta da API': response.body
    };

    if (additionalInfo) {
      responseInfo['ℹ️ Informação Adicional'] = additionalInfo;
    }

    this.attachJSON('📥 RESPOSTA RECEBIDA', responseInfo);
  }

  getRequestDescription(method, endpoint) {
    const descriptions = {
      'GET': `Consultando dados do endpoint ${endpoint}`,
      'POST': `Criando novo recurso em ${endpoint}`,
      'PUT': `Atualizando recurso em ${endpoint}`,
      'DELETE': `Excluindo recurso de ${endpoint}`,
      'PATCH': `Atualizando parcialmente recurso em ${endpoint}`
    };
    return descriptions[method] || `Realizando requisição ${method} para ${endpoint}`;
  }

  getStatusDescription(status) {
    const descriptions = {
      200: '✅ Sucesso - Requisição processada com sucesso',
      201: '✅ Criado - Recurso criado com sucesso',
      204: '✅ Sem Conteúdo - Operação realizada com sucesso',
      400: '⚠️ Requisição Inválida - Dados enviados estão incorretos',
      401: '🔒 Não Autorizado - Token ausente ou inválido',
      403: '🚫 Proibido - Sem permissão para acessar este recurso',
      404: '🔍 Não Encontrado - Recurso não existe',
      409: '⚠️ Conflito - Recurso já existe',
      422: '⚠️ Entidade Não Processável - Validação falhou',
      500: '❌ Erro Interno - Problema no servidor',
      502: '❌ Gateway Inválido - Servidor intermediário com erro',
      503: '❌ Serviço Indisponível - Servidor temporariamente fora'
    };
    return descriptions[status] || `Status ${status}`;
  }

  endTest(status = 'passed', error = null) {
    if (this.currentTest) {
      this.currentTest.status = status;
      this.currentTest.stop = Date.now();
      this.currentTest.stage = 'finished';
      this.currentTest.attachments = this.attachments;
      
      if (error) {
        this.currentTest.statusDetails = {
          message: error.message || String(error),
          trace: error.stack || String(error)
        };
      }
      
      // Salva resultado do teste
      const resultFileName = `${this.currentTest.uuid}-result.json`;
      const resultFilePath = path.join(this.resultsDir, resultFileName);
      
      const testResult = {
        uuid: this.currentTest.uuid,
        historyId: this.currentTest.historyId,
        fullName: this.currentTest.fullName,
        name: this.currentTest.name,
        status: this.currentTest.status,
        stage: this.currentTest.stage,
        start: this.currentTest.start,
        stop: this.currentTest.stop,
        labels: [
          { name: 'suite', value: this.suiteName || 'API Tests' },
          { name: 'feature', value: this.suiteName || 'API Tests' }
        ],
        attachments: this.currentTest.attachments,
        statusDetails: this.currentTest.statusDetails || {}
      };
      
      fs.writeFileSync(resultFilePath, JSON.stringify(testResult, null, 2));
      
      this.currentTest = null;
      this.attachments = [];
    }
  }

  endSuite() {
    this.suiteName = null;
  }

  writeEnvironmentInfo(envInfo) {
    try {
      const resultsDir = './allure-results';
      if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
      }
      
      const envFilePath = path.join(resultsDir, 'environment.properties');
      const envContent = Object.entries(envInfo)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
      
      fs.writeFileSync(envFilePath, envContent);
    } catch (error) {
      console.error('Error writing environment info:', error);
    }
  }
}

let allureInstance = null;

function getAllure() {
  if (!allureInstance) {
    allureInstance = new AllureHelper();
  }
  return allureInstance;
}

module.exports = { getAllure };
