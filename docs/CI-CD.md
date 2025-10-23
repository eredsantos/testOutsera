# Implementacao de Pipeline CI/CD

Este documento descreve como implementar um pipeline de CI/CD para executar os testes de backend e frontend de forma automatizada apos cada commit.

## Indice

1. [GitHub Actions](#github-actions)
2. [GitLab CI/CD](#gitlab-cicd)
3. [Requisitos](#requisitos)
4. [Configuracoes Adicionais](#configuracoes-adicionais)

---

## GitHub Actions

### Arquivo de Configuracao

Crie o arquivo `.github/workflows/tests.yml` na raiz do projeto:

```yaml
name: Testes Automatizados

on:
  push:
    branches:
      - main
      - master
      - develop
  pull_request:
    branches:
      - main
      - master
      - develop

jobs:
  test:
    name: Executar Testes
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - name: Checkout do codigo
        uses: actions/checkout@v4
      
      - name: Configurar Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Instalar dependencias
        run: npm ci
      
      - name: Instalar navegadores do Playwright
        run: npx playwright install --with-deps chromium
      
      - name: Executar testes de API
        run: npm run test:api
        continue-on-error: false
      
      - name: Executar testes de UI
        run: npm run test:ui
        continue-on-error: false
      
      - name: Gerar relatorio Allure
        if: always()
        run: npm run report:generate
      
      - name: Upload dos resultados Allure
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: allure-results-${{ matrix.node-version }}
          path: allure-results/
          retention-days: 30
      
      - name: Upload do relatorio Allure
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: allure-report-${{ matrix.node-version }}
          path: allure-report/
          retention-days: 30
      
      - name: Upload de screenshots em caso de falha
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: screenshots-${{ matrix.node-version }}
          path: test-results/screenshots/
          retention-days: 7

  publish-report:
    name: Publicar Relatorio Allure
    needs: test
    runs-on: ubuntu-latest
    if: always()
    
    steps:
      - name: Checkout do codigo
        uses: actions/checkout@v4
      
      - name: Download dos resultados Allure
        uses: actions/download-artifact@v4
        with:
          pattern: allure-results-*
          merge-multiple: true
          path: allure-results/
      
      - name: Publicar relatorio Allure
        uses: simple-elf/allure-report-action@master
        if: always()
        with:
          allure_results: allure-results
          allure_history: allure-history
          keep_reports: 20
      
      - name: Deploy para GitHub Pages
        if: always()
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: allure-history
          publish_branch: gh-pages
```

### Configuracao do GitHub Pages

1. Acesse as configuracoes do repositorio
2. Va em `Settings` > `Pages`
3. Em `Source`, selecione a branch `gh-pages`
4. Salve as configuracoes

O relatorio Allure estara disponivel em: `https://<usuario>.github.io/<repositorio>/`

---

## GitLab CI/CD

### Arquivo de Configuracao

Crie o arquivo `.gitlab-ci.yml` na raiz do projeto:

```yaml
image: mcr.microsoft.com/playwright:v1.40.0-focal

stages:
  - install
  - test
  - report
  - deploy

variables:
  npm_config_cache: "$CI_PROJECT_DIR/.npm"
  PLAYWRIGHT_BROWSERS_PATH: "$CI_PROJECT_DIR/ms-playwright"

cache:
  paths:
    - .npm/
    - node_modules/
    - ms-playwright/

install_dependencies:
  stage: install
  script:
    - npm ci
    - npx playwright install --with-deps chromium
  artifacts:
    paths:
      - node_modules/
      - ms-playwright/
    expire_in: 1 day

test_api:
  stage: test
  needs: 
    - install_dependencies
  script:
    - npm run test:api
  artifacts:
    when: always
    paths:
      - allure-results/
      - reports/
    expire_in: 30 days
  allow_failure: false

test_ui:
  stage: test
  needs:
    - install_dependencies
  script:
    - npm run test:ui
  artifacts:
    when: always
    paths:
      - allure-results/
      - test-results/
      - reports/
    expire_in: 30 days
  allow_failure: false

generate_report:
  stage: report
  needs:
    - test_api
    - test_ui
  when: always
  script:
    - npm run report:generate
  artifacts:
    when: always
    paths:
      - allure-report/
    expire_in: 30 days

pages:
  stage: deploy
  needs:
    - generate_report
  when: always
  script:
    - mkdir -p public
    - cp -r allure-report/* public/
  artifacts:
    paths:
      - public
    expire_in: 30 days
  only:
    - main
    - master
```

### Acesso ao Relatorio

Apos a execucao do pipeline, o relatorio Allure estara disponivel em:
`https://<usuario>.gitlab.io/<repositorio>/`

---

## Requisitos

### Variaveis de Ambiente

Configure as seguintes variaveis de ambiente no seu CI/CD:

#### GitHub Actions

Adicione em `Settings` > `Secrets and variables` > `Actions`:

- `API_BASE_URL`: https://serverest.dev
- `FRONTEND_BASE_URL`: https://front.serverest.dev

#### GitLab CI/CD

Adicione em `Settings` > `CI/CD` > `Variables`:

- `API_BASE_URL`: https://serverest.dev
- `FRONTEND_BASE_URL`: https://front.serverest.dev

### Dependencias do Sistema

O pipeline utiliza a imagem Docker do Playwright que ja inclui:
- Node.js
- Navegadores (Chromium, Firefox, WebKit)
- Dependencias do sistema necessarias

### Recursos Necessarios

- Runner com pelo menos 2GB de RAM
- Runner com suporte a Docker (para GitLab)
- Acesso a internet para instalar dependencias

---

## Configuracoes Adicionais

### Executar Testes em Paralelo

Para executar testes em paralelo, modifique o `cucumber.js`:

```javascript
module.exports = {
  default: {
    // ... outras configuracoes
    parallel: 2, // Numero de workers em paralelo
  }
};
```

### Notificacoes

#### GitHub Actions - Slack

Adicione ao final do workflow:

```yaml
- name: Notificar Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Testes finalizados'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

#### GitLab CI/CD - Slack

Adicione um job de notificacao:

```yaml
notify:
  stage: deploy
  when: always
  script:
    - 'curl -X POST -H "Content-type: application/json" --data "{\"text\":\"Pipeline $CI_PIPELINE_STATUS\"}" $SLACK_WEBHOOK'
```

### Execucao Agendada

#### GitHub Actions

Adicione ao `on:` do workflow:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Executa todos os dias as 2h da manha
```

#### GitLab CI/CD

Configure em `CI/CD` > `Schedules` no GitLab ou adicione:

```yaml
only:
  - schedules
  - main
```

### Retry em Caso de Falha

#### GitHub Actions

Adicione ao job:

```yaml
- name: Executar testes com retry
  uses: nick-invision/retry@v2
  with:
    timeout_minutes: 15
    max_attempts: 3
    command: npm run test
```

#### GitLab CI/CD

Adicione ao job:

```yaml
test_api:
  retry:
    max: 2
    when:
      - runner_system_failure
      - stuck_or_timeout_failure
```

---

## Boas Praticas

1. **Separacao de Ambientes**: Use branches diferentes para desenvolvimento, homologacao e producao
2. **Testes de Smoke**: Execute testes smoke em todo commit e testes completos apenas em PRs ou deploys
3. **Cache Eficiente**: Utilize cache de dependencias para acelerar a pipeline
4. **Artefatos**: Mantenha artefatos por tempo limitado para economizar espaco
5. **Monitoramento**: Configure alertas para falhas consecutivas
6. **Documentacao**: Mantenha este documento atualizado com mudancas na pipeline

---

## Troubleshooting

### Erro: "Playwright browsers not found"

Solucao: Certifique-se de executar `npx playwright install --with-deps chromium` antes dos testes

### Erro: "ENOENT: no such file or directory"

Solucao: Verifique se as pastas necessarias existem antes de executar os testes:

```bash
mkdir -p test-results/screenshots allure-results
```

### Testes falhando apenas no CI

Solucao: Adicione waits adicionais ou aumente os timeouts no `playwright.config.js`:

```javascript
timeout: 90000,
expect: {
  timeout: 15000
}
```

### Relatorio Allure nao gera

Solucao: Verifique se o `allure-results` existe e contem arquivos JSON:

```bash
ls -la allure-results/
```
