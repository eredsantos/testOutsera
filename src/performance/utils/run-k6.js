require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');

const requiredVars = [
  'LOAD_TEST_BASE_URL',
  'LOAD_TEST_ENDPOINT',
  'LOAD_TEST_VUS',
  'LOAD_TEST_DURATION'
];

const missing = requiredVars.filter(v => !process.env[v]);
if (missing.length > 0) {
  console.error('❌ Variáveis de ambiente faltando no .env:');
  missing.forEach(v => console.error(`   - ${v}`));
  process.exit(1);
}

const scriptPath = path.join(__dirname, '../scripts/httpbin-headers-load-test.js');

console.log('🚀 Executando teste de carga k6...\n');

try {
  const isWindows = process.platform === 'win32';
  
  if (isWindows) {
    // No Windows, definir variáveis de ambiente diretamente no processo
    const env = { ...process.env };
    requiredVars.forEach(key => {
      env[key] = process.env[key];
    });
    
    execSync(`k6 run --no-usage-report --compatibility-mode=base "${scriptPath}"`, {
      stdio: 'inherit',
      shell: true,
      env: env
    });
  } else {
    // Unix/Linux - sintaxe original
    const envVars = requiredVars
      .map(key => `${key}=${process.env[key]}`)
      .join(' ');
    
    execSync(`${envVars} k6 run --no-usage-report --compatibility-mode=base ${scriptPath}`, {
      stdio: 'inherit',
      shell: true
    });
  }
} catch (error) {
  console.error('❌ Erro ao executar teste de carga');
  process.exit(1);
}
