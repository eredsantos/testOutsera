import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

const BASE_URL = __ENV.LOAD_TEST_BASE_URL;
const ENDPOINT = __ENV.LOAD_TEST_ENDPOINT;
const VUS_TARGET = parseInt(__ENV.LOAD_TEST_VUS);
const DURATION = __ENV.LOAD_TEST_DURATION;

export const options = {
  stages: [
    { duration: '5m', target: VUS_TARGET }, //aqui o ramp-up pode ser configurado
  ],
  
  thresholds: {
    'http_req_failed': ['rate<0.01'],
    'http_req_duration': ['p(95)<500', 'p(99)<1000'],
    'success_rate': ['rate>0.99'],
    'http_reqs': ['rate>50'],
  },
  
  noConnectionReuse: false,
  userAgent: 'K6 Load Test - TestOutsera/1.0',
};

const successRate = new Rate('success_rate');
const headerValidation = new Rate('header_validation_success');
const requestDuration = new Trend('custom_request_duration');
const totalRequests = new Counter('total_requests');

export default function () {
  group('GET /headers - Header Validation Test', () => {
    const params = {
      headers: {
        'Content-Type': 'application/json',
        'X-Test-Run-Id': `load-test-${__ITER}`,
        'X-Virtual-User': `VU-${__VU}`,
        'User-Agent': 'K6 Performance Test',
      },
      tags: {
        name: 'GetHeaders',
        endpoint: ENDPOINT,
      },
      timeout: '30s',
    };

    const startTime = new Date();
    const response = http.get(`${BASE_URL}${ENDPOINT}`, params);
    const duration = new Date() - startTime;
    
    requestDuration.add(duration);
    totalRequests.add(1);

    const checkResults = check(response, {
      'status is 200': (r) => r.status === 200,
      'response time < 1000ms': (r) => r.timings.duration < 1000,
      'response time < 500ms': (r) => r.timings.duration < 500,
      'has headers in response': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.headers !== undefined;
        } catch (e) {
          return false;
        }
      },
      'Content-Type is JSON': (r) => 
        r.headers['Content-Type'] && 
        r.headers['Content-Type'].includes('application/json'),
      'response body is valid JSON': (r) => {
        try {
          JSON.parse(r.body);
          return true;
        } catch (e) {
          return false;
        }
      },
    });

    let headerCheckPassed = false;
    if (response.status === 200) {
      try {
        const body = JSON.parse(response.body);
        headerCheckPassed = check(body, {
          'headers object exists': (b) => b.headers !== undefined,
          'User-Agent header is present': (b) => 
            b.headers['User-Agent'] !== undefined,
          'Host header is present': (b) => 
            b.headers['Host'] === 'httpbin.org',
          'custom headers are reflected': (b) => 
            b.headers['X-Test-Run-Id'] !== undefined &&
            b.headers['X-Virtual-User'] !== undefined,
        });
      } catch (e) {
        console.error(`JSON Parse Error: ${e.message}`);
      }
    }

    successRate.add(response.status === 200);
    headerValidation.add(headerCheckPassed);

    if (response.status !== 200) {
      console.error(
        `Request failed: VU=${__VU}, Iter=${__ITER}, ` +
        `Status=${response.status}, Duration=${response.timings.duration}ms`
      );
    }
  });

  sleep(Math.random() * 3 + 1);
}

export function handleSummary(data) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  return {
    [`src/performance/reports/load-test-report-${timestamp}.html`]: htmlReport(data),
    [`src/performance/reports/load-test-summary-${timestamp}.json`]: JSON.stringify(data, null, 2),
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    [`src/performance/reports/load-test-summary-${timestamp}.txt`]: textSummary(data, { indent: ' ', enableColors: false }),
  };
}

export function setup() {
  console.log('🚀 Iniciando teste de carga...');
  console.log(`📍 Target: ${BASE_URL}${ENDPOINT}`);
  console.log(`👥 Usuários: ${VUS_TARGET} simultâneos`);
  console.log(`⏱️  Duração: ${DURATION}`);
  
  const testResponse = http.get(`${BASE_URL}${ENDPOINT}`);
  if (testResponse.status !== 200) {
    throw new Error(`Setup failed: API não está respondendo (status: ${testResponse.status})`);
  }
  
  return { startTime: new Date().toISOString() };
}

export function teardown(data) {
  console.log('\n✅ Teste de carga finalizado!');
  console.log(`⏰ Início: ${data.startTime}`);
  console.log(`⏰ Fim: ${new Date().toISOString()}`);
}
