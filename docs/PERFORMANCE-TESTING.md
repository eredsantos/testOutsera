# 🚀 Testes de Performance com k6

Este documento descreve como executar e analisar testes de carga no projeto usando k6.

## 📋 Índice

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando Testes](#executando-testes)
- [Métricas](#métricas)
- [Relatórios](#relatórios)
- [Interpretação de Resultados](#interpretação-de-resultados)
- [CI/CD](#cicd)

---

## 🔧 Instalação

### 1. Instalar k6

**Windows (Chocolatey):**
```powershell
choco install k6
```

**Windows (Manual):**
1. Baixe de: https://k6.io/docs/getting-started/installation/
2. Extraia e adicione ao PATH

**Linux:**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**macOS:**
```bash
brew install k6
```

### 2. Verificar Instalação

```bash
k6 version
```

---

## ⚙️ Configuração

As configurações dos testes de performance estão no arquivo `.env`:

```env
LOAD_TEST_BASE_URL=https://httpbin.org
LOAD_TEST_ENDPOINT=/headers
LOAD_TEST_VUS=500
LOAD_TEST_DURATION=5m
```

### Variáveis de Ambiente

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `LOAD_TEST_BASE_URL` | URL base da API | `https://httpbin.org` |
| `LOAD_TEST_ENDPOINT` | Endpoint a ser testado | `/headers` |
| `LOAD_TEST_VUS` | Número de usuários virtuais simultâneos | `500` |
| `LOAD_TEST_DURATION` | Duração total do teste | `5m` |

---

## 🧪 Executando Testes

### Teste de Carga

Executa teste com 500 usuários simultâneos por 5 minutos:

```bash
npm run test:load
```

---

## 📊 Perfil de Carga

O teste segue o seguinte perfil:

```
Usuários
   500 |████████████████████████████████████
       |
       |
       |
     0 |___________________________________> Tempo
       0                                  5m

Fase:
1. Carga constante: 500 usuários virtuais simultâneos (5 minutos)

Duração total: 5 minutos
```

---

## 📈 Métricas

### Métricas Padrão k6

| Métrica | Descrição | Threshold |
|---------|-----------|-----------|
| `http_req_duration` | Tempo total da requisição | p95 < 500ms, p99 < 1000ms |
| `http_req_failed` | Taxa de falha de requisições | < 1% |
| `http_reqs` | Requisições por segundo | > 50 req/s |
| `vus` | Usuários virtuais ativos | - |
| `iterations` | Iterações completas | - |

### Métricas Customizadas

| Métrica | Tipo | Descrição |
|---------|------|-----------|
| `success_rate` | Rate | Taxa de requisições com status 200 |
| `header_validation_success` | Rate | Taxa de validação bem-sucedida de headers |
| `custom_request_duration` | Trend | Duração customizada das requisições |
| `total_requests` | Counter | Contador total de requisições |

### Validações Realizadas

- ✅ Status code 200
- ✅ Response time < 1000ms
- ✅ Response time < 500ms
- ✅ Headers presentes na resposta
- ✅ Content-Type é JSON
- ✅ Response body é JSON válido
- ✅ Headers customizados são refletidos

---

## 📑 Relatórios

Os relatórios são gerados automaticamente em `src/performance/reports/`:

### Tipos de Relatórios

- **HTML Report** (`load-test-report-*.html`): Relatório visual interativo
- **JSON Summary** (`load-test-summary-*.json`): Dados completos em JSON
- **TXT Summary** (`load-test-summary-*.txt`): Resumo em texto plano

### Abrindo Relatórios

**Windows:**
```bash
start src\performance\reports\load-test-report-*.html
```

**Linux/Mac:**
```bash
open src/performance/reports/load-test-report-*.html
```

---

## 🔍 Interpretação de Resultados

### ✅ Teste BEM-SUCEDIDO

```
✓ http_req_failed........: 0.12%   ✓ 120    ✗ 97880
✓ http_req_duration......: avg=245ms  p(95)=380ms  p(99)=520ms
✓ success_rate...........: 99.88%
✓ http_reqs..............: 98000 (163/s)
```

**Indicadores:**
- Taxa de erro < 1% ✅
- P95 < 500ms ✅
- Taxa de sucesso > 99% ✅
- RPS > 50 ✅

### ❌ Teste COM PROBLEMAS

```
✗ http_req_failed........: 5.23%   ✓ 5123   ✗ 92877
✗ http_req_duration......: avg=1240ms  p(95)=2380ms  p(99)=3520ms
✗ success_rate...........: 94.77%
```

**Indicadores:**
- Taxa de erro > 1% ❌
- P95 > 500ms ❌
- Alta latência em percentis ❌

### 📊 Análise de Percentis

- **P50 (Mediana)**: 50% das requisições
- **P90**: 90% das requisições
- **P95**: 95% das requisições (threshold comum)
- **P99**: 99% das requisições (outliers)

**Exemplo:**
```
p(50)=180ms  p(90)=320ms  p(95)=420ms  p(99)=850ms
```
- 50% dos usuários têm resposta em < 180ms
- 95% dos usuários têm resposta em < 420ms ✅
- 99% dos usuários têm resposta em < 850ms ✅

---

## 🔄 CI/CD

### GitHub Actions

Os testes de performance podem ser executados automaticamente via GitHub Actions.

**Workflow:** `.github/workflows/performance-tests.yml`

#### Executar Manualmente

1. Vá para a aba **Actions** no GitHub
2. Selecione **"Performance Tests - k6"**
3. Clique em **"Run workflow"**
4. (Opcional) Ajuste os parâmetros:
   - **vus**: Número de usuários (padrão: 500)
   - **duration**: Duração do teste (padrão: 5m)
5. Clique em **"Run workflow"**

#### Ver Relatórios

Após a execução:
1. Acesse a execução do workflow
2. Role até **"Artifacts"**
3. Baixe `k6-performance-reports`
4. Extraia e abra o arquivo `.html`

---

## 🎯 Thresholds Configurados

```javascript
thresholds: {
  'http_req_failed': ['rate<0.01'],        // < 1% de erro
  'http_req_duration': ['p(95)<500'],      // 95% < 500ms
  'http_req_duration': ['p(99)<1000'],     // 99% < 1s
  'success_rate': ['rate>0.99'],           // > 99% sucesso
  'http_reqs': ['rate>50'],                // > 50 req/s
}
```

## 🔗 Referências

- [k6 Documentation](https://k6.io/docs/)
- [k6 Metrics](https://k6.io/docs/using-k6/metrics/)
- [k6 Thresholds](https://k6.io/docs/using-k6/thresholds/)
- [Load Testing Best Practices](https://k6.io/docs/testing-guides/test-types/)
