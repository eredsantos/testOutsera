require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');

process.env.LOAD_TEST_VUS = '1';
process.env.LOAD_TEST_DURATION = '30s';

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

const envVars = requiredVars
  .map(key => `${key}=${process.env[key]}`)
  .join(' ');

console.log('🚀 Executando teste de carga k6 (smoke test)...\n');

try {
  execSync(`${envVars} k6 run ${scriptPath}`, {
    stdio: 'inherit',
    shell: true
  });
} catch (error) {
  console.error('❌ Erro ao executar teste de carga');
  process.exit(1);
}
