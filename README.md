# Test Automation - outsera

Projeto de automação de testes de Backend (API) e Frontend (UI) utilizando Cucumber BDD, Playwright e JavaScript.


# DISCLAIMER:

Como não foi passado nenhum ambiente próprio para realizar os testes, utilizei o ambiente de testes da **[Serverest](https://front.serverest.dev)**, por se tratar de um ambiente público, as informações contidas na aplicação deles podem variar o tempo todo, e o ambiente pode apresentar instabilidades.


Na solução do teste proposto foi solicitado realizar testes de **checkout**, entretanto, como não encontrei uma plataforma de checkout de testes, tomei a liberdade de alterar esse escopo para realizar testes da funcionalidade de **Lista de Compras**, na plataforma da **Serverest**.


## 🚀 Tecnologias

- **[Cucumber](https://cucumber.io/)** - Framework BDD para escrita de testes em linguagem natural
- **[Playwright](https://playwright.dev/)** - Framework para automação de testes de UI
- **[Axios](https://axios-http.com/)** - Cliente HTTP para testes de API
- **[Allure](https://allurereport.org/)** - Framework para geração de relatórios de testes
- **[Joi](https://joi.dev/)** - Validação de schemas JSON
- **[k6](https://k6.io/)** - Ferramenta de testes de carga e performance
- **Node.js** - Ambiente de execução JavaScript

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm
- k6 (apenas para testes de performance) - [Instruções de instalação](https://k6.io/docs/getting-started/installation/)

## 🔧 Configuração Local

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd testOutsera
```

2. Instale as dependências:
```bash
npm install
```

3. Instale os navegadores do Playwright:
```bash
npx playwright install
```

4. (Opcional) Configure variáveis de ambiente criando um arquivo `.env`:
```env
HEADLESS=false          # true para executar sem interface gráfica
SLOW_MO=0              # Adiciona delay entre ações (em ms)
```

## 🧪 Executando os Testes

### Testes de UI (Interface)

Executa apenas os testes de frontend:

```bash
npm run test:ui
```

### Testes de API (Backend)

**IMPORTANTE**:
Para os testes de API, foram validados **apenas** os endpoints da controller de **Produtos**.


Executa apenas os testes de API:

```bash
npm run test:api
```

### Testes de UI + API

Executa todos os testes do projeto:

```bash
npm run test:all
```

### Testes por Categoria

```bash
# Testes de smoke
npm run test:smoke

# Testes de regressão
npm run test:regression
```

### Testes de Performance (k6)

Executa testes de carga no endpoint `GET /headers` da API httpbin.org com 500 usuários simultâneos:

```bash
# Teste de carga completo (500 VUs por 5 minutos)
npm run test:load
```

Para mais detalhes sobre testes de performance, consulte: **[docs/PERFORMANCE-TESTING.md](docs/PERFORMANCE-TESTING.md)**

## 📊 Relatórios

### Gerar Relatório Allure

Após executar os testes, gere o relatório:

```bash
npm run report:generate
```

### Abrir Relatório Allure

Abre o relatório no navegador:

```bash
npm run report:open
```

### Executar Testes e Abrir Relatório

Executa todos os testes e abre o relatório automaticamente:

```bash
npm run test:all:open
```

### Limpar Relatórios

Remove todos os relatórios anteriores:

```bash
npm run clean:reports
```

## 📁 Estrutura do Projeto

```
testOutsera/
├── .github/
│   └── workflows/        # Workflows CI/CD
│       ├── tests.yml     # Testes funcionais
│       └── performance-tests.yml  # Testes de carga
├── src/
│   ├── features/         # Arquivos .feature com cenários BDD
│   │   ├── api/          # Cenários de testes de API
│   │   └── ui/           # Cenários de testes de UI
│   ├── step_definitions/ # Implementação dos steps
│   ├── support/          # Arquivos de suporte e configuração
│   └── performance/      # Testes de carga (k6)
│       ├── scripts/      # Scripts de teste k6
│       ├── utils/        # Utilitários para execução
│       └── reports/      # Relatórios de performance
├── docs/                 # Documentação do projeto
│   ├── CI-CD.md         # Guia de configuração de CI/CD
│   └── PERFORMANCE-TESTING.md  # Guia de testes de performance
├── reports/             # Relatórios Cucumber (HTML/JSON)
├── allure-results/      # Resultados para o Allure
├── allure-report/       # Relatório Allure gerado
└── test-results/        # Screenshots dos testes
```

## 🔄 CI/CD

Para informações sobre configuração de pipelines de CI/CD (GitHub Actions, GitLab CI, etc):

📄 **[docs/CI-CD.md](docs/CI-CD.md)**


## 🏷️ Tags Disponíveis

Os testes podem ser filtrados por tags:

- `@api` - Testes de API
- `@ui` - Testes de UI
- `@smoke` - Testes de smoke
- `@regression` - Testes de regressão

Exemplo de execução customizada:
```bash
npx cucumber-js --tags "@api and @smoke"
```
