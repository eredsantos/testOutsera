# language: pt
@ui @carrinho
Funcionalidade: Adicionar produtos ao carrinho de compras
  Como um usuario logado
  Quero adicionar produtos ao carrinho
  Para realizar compras na loja

  Contexto:
    Dado que estou na pagina de login
    E que tenho credenciais validas de usuario
    E realizo login com as credenciais
    E estou na pagina inicial

  @smoke @positivo
  Cenario: Adicionar primeiro produto ao carrinho
    Dado que visualizo a lista de produtos
    Quando armazeno o nome do primeiro produto
    E adiciono o primeiro produto ao carrinho
    Entao o produto deve estar presente no carrinho
    E o nome do produto no carrinho deve corresponder ao produto adicionado

  @positivo
  Cenario: Adicionar multiplos produtos ao carrinho
    Dado que visualizo a lista de produtos
    Quando armazeno o nome dos dois primeiros produtos
    E adiciono o primeiro produto ao carrinho
    E retorno para a pagina inicial
    E adiciono o segundo produto ao carrinho
    Entao o primeiro produto deve estar presente no carrinho
    E o segundo produto deve estar presente no carrinho

  @positivo
  Cenario: Limpar lista de compras
    Dado que visualizo a lista de produtos
    E armazeno o nome do primeiro produto
    E adiciono o primeiro produto ao carrinho
    E o produto deve estar presente no carrinho
    Quando limpo a lista de compras
    Entao o carrinho deve estar vazio

  @positivo
  Cenario: Adicionar e limpar multiplos produtos
    Dado que visualizo a lista de produtos
    E armazeno o nome dos dois primeiros produtos
    E adiciono o primeiro produto ao carrinho
    E retorno para a pagina inicial
    E adiciono o segundo produto ao carrinho
    E o primeiro produto deve estar presente no carrinho
    E o segundo produto deve estar presente no carrinho
    Quando limpo a lista de compras
    Entao o carrinho deve estar vazio

  @positivo
  Cenario: Validar navegacao apos adicionar produto
    Dado que visualizo a lista de produtos
    Quando adiciono o primeiro produto ao carrinho
    E retorno para a pagina inicial
    Entao devo estar na pagina inicial
    E a lista de produtos deve estar visivel

  @regression
  Cenario: Fluxo completo de adicao e limpeza de produtos
    Dado que visualizo a lista de produtos
    E armazeno o nome dos dois primeiros produtos
    Quando adiciono o primeiro produto ao carrinho
    Entao o primeiro produto deve estar presente no carrinho
    Quando retorno para a pagina inicial
    E adiciono o segundo produto ao carrinho
    Entao o primeiro produto deve estar presente no carrinho
    E o segundo produto deve estar presente no carrinho
    Quando limpo a lista de compras
    Entao o carrinho deve estar vazio
