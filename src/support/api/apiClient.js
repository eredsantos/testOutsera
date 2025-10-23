const axios = require('axios');
const { getAllure } = require('../allureHelper');
require('dotenv').config();

class ApiClient {
  constructor() {
    this.baseURL = process.env.API_BASE_URL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      validateStatus: () => true
    });
  }

  async get(endpoint, params = {}, headers = {}) {
    const allure = getAllure();
    
    allure.logApiRequest('GET', endpoint, {
      baseURL: this.baseURL,
      params: params,
      headers: headers
    });
    
    const response = await this.client.get(endpoint, { 
      params,
      headers 
    });
    
    const formattedResponse = this.formatResponse(response);
    allure.logApiResponse(formattedResponse);
    
    return formattedResponse;
  }

  async post(endpoint, data = {}, headers = {}) {
    const allure = getAllure();
    
    allure.logApiRequest('POST', endpoint, {
      baseURL: this.baseURL,
      payload: data,
      headers: headers
    });
    
    const response = await this.client.post(endpoint, data, { headers });
    const formattedResponse = this.formatResponse(response);
    allure.logApiResponse(formattedResponse);
    
    return formattedResponse;
  }

  async put(endpoint, data = {}, headers = {}) {
    const allure = getAllure();
    
    allure.logApiRequest('PUT', endpoint, {
      baseURL: this.baseURL,
      payload: data,
      headers: headers
    });
    
    const response = await this.client.put(endpoint, data, { headers });
    const formattedResponse = this.formatResponse(response);
    allure.logApiResponse(formattedResponse);
    
    return formattedResponse;
  }

  async delete(endpoint, headers = {}) {
    const allure = getAllure();
    
    allure.logApiRequest('DELETE', endpoint, {
      baseURL: this.baseURL,
      headers: headers
    });
    
    const response = await this.client.delete(endpoint, { headers });
    const formattedResponse = this.formatResponse(response);
    allure.logApiResponse(formattedResponse);
    
    return formattedResponse;
  }

  formatResponse(response) {
    return {
      status: response.status,
      headers: response.headers,
      body: response.data,
      statusText: response.statusText
    };
  }

  setAuthToken(token) {
    this.client.defaults.headers.common['Authorization'] = token;
  }

  clearAuthToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }
}

module.exports = new ApiClient();
