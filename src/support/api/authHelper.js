const apiClient = require('./apiClient');

class AuthHelper {
  constructor() {
    this.adminUser = null;
    this.adminToken = null;
    this.regularUser = null;
  }

  async getAdminUser() {
    if (!this.adminUser) {
      const response = await apiClient.get('/usuarios', { administrador: 'true' });
      
      if (response.status === 200 && response.body.usuarios.length > 0) {
        this.adminUser = response.body.usuarios[0];
      } else {
        throw new Error('Nenhum usuario administrador encontrado');
      }
    }
    return this.adminUser;
  }

  async getRegularUser() {
    if (!this.regularUser) {
      const response = await apiClient.get('/usuarios', { administrador: 'false' });
      
      if (response.status === 200 && response.body.usuarios.length > 0) {
        this.regularUser = response.body.usuarios[0];
      } else {
        throw new Error('Nenhum usuario regular encontrado');
      }
    }
    return this.regularUser;
  }

  async getAdminToken() {
    const user = await this.getAdminUser();
    
    const loginData = {
      email: user.email,
      password: user.password
    };

    const response = await apiClient.post('/login', loginData);
    
    if (response.status === 200) {
      this.adminToken = response.body.authorization;
      return this.adminToken;
    } else {
      throw new Error('Falha ao obter token de administrador');
    }
  }

  async loginAsAdmin() {
    const token = await this.getAdminToken();
    apiClient.setAuthToken(token);
    return token;
  }

  clearAuth() {
    apiClient.clearAuthToken();
    this.adminToken = null;
  }
}

module.exports = new AuthHelper();
