const apiClient = require('../api/apiClient');

class UserService {
  async getNonAdminUser() {
    const response = await apiClient.get('/usuarios', { administrador: 'false' });
    
    if (response.status === 200 && response.body.usuarios.length > 0) {
      const userData = response.body.usuarios[0];
      return {
        email: userData.email,
        password: userData.password,
        userData: userData
      };
    } else {
      throw new Error('Nenhum usuario nao administrador encontrado');
    }
  }

  async getValidUser() {
    const response = await apiClient.get('/usuarios', { administrador: 'false' });
    
    if (response.status === 200 && response.body.usuarios.length > 0) {
      const userData = response.body.usuarios[0];
      return {
        email: userData.email,
        password: userData.password,
        userData: userData
      };
    } else {
      throw new Error('Nenhum usuario encontrado');
    }
  }

  async getValidEmail() {
    const user = await this.getValidUser();
    return user.email;
  }

  async getValidPassword() {
    const user = await this.getValidUser();
    return user.password;
  }

  generateNonExistentEmail() {
    return `inexistente${Date.now()}@teste.com`;
  }

  getIncorrectPassword() {
    return 'senhaIncorreta123';
  }

  getAnyPassword() {
    return 'senhaQualquer123';
  }
}

module.exports = new UserService();
