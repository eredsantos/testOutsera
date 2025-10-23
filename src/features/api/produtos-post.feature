# language: pt
@api @produtos @post
Funcionalidade: POST /produtos - Cadastrar produtos
  Como um usuario administrador da API
  Quero cadastrar novos produtos
  Para disponibiliza-los na loja virtual

  Contexto:
    Dado que a API esta disponivel
    E que estou autenticado como administrador

  @smoke @positivo
  Cenario: Cadastrar produto com dados validos
    Dado que tenho os dados validos de um produto
    Quando realizo uma requisicao POST para "/produtos"
    Entao o status code da resposta deve ser 201
    E o header "content-type" deve conter "application/json"
    E o corpo da resposta deve conter a mensagem "Cadastro realizado com sucesso"
    E o corpo da resposta deve conter o campo "_id"
    E o schema da resposta deve ser valido para cadastro com sucesso

  @positivo
  Cenario: Cadastrar produto com preco minimo valido
    Dado que tenho os dados de um produto com preco 1
    Quando realizo uma requisicao POST para "/produtos"
    Entao o status code da resposta deve ser 201
    E o corpo da resposta deve conter a mensagem "Cadastro realizado com sucesso"

  @positivo
  Cenario: Cadastrar produto com quantidade zero
    Dado que tenho os dados de um produto com quantidade 0
    Quando realizo uma requisicao POST para "/produtos"
    Entao o status code da resposta deve ser 201
    E o corpo da resposta deve conter a mensagem "Cadastro realizado com sucesso"

  @negativo
  Cenario: Tentar cadastrar produto sem autenticacao
    Dado que nao estou autenticado
    E que tenho os dados validos de um produto
    Quando realizo uma requisicao POST para "/produtos"
    Entao o status code da resposta deve ser 401
    E o header "content-type" deve conter "application/json"
    E o corpo da resposta deve conter a mensagem "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais"

  @negativo
  Cenario: Tentar cadastrar produto com token invalido
    Dado que tenho um token invalido
    E que tenho os dados validos de um produto
    Quando realizo uma requisicao POST para "/produtos"
    Entao o status code da resposta deve ser 401
    E o corpo da resposta deve conter a mensagem "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais"

  @negativo
  Cenario: Tentar cadastrar produto sem permissao de administrador
    Dado que estou autenticado como usuario comum
    E que tenho os dados validos de um produto
    Quando realizo uma requisicao POST para "/produtos"
    Entao o status code da resposta deve ser 403
    E o header "content-type" deve conter "application/json"
    E o corpo da resposta deve conter a mensagem "Rota exclusiva para administradores"

  @negativo
  Cenario: Tentar cadastrar produto sem campo obrigatorio nome
    Dado que tenho os dados de um produto sem o campo "nome"
    Quando realizo uma requisicao POST para "/produtos"
    Entao o status code da resposta deve ser 400
    E o corpo da resposta deve conter "nome"

  @negativo
  Cenario: Tentar cadastrar produto sem campo obrigatorio preco
    Dado que tenho os dados de um produto sem o campo "preco"
    Quando realizo uma requisicao POST para "/produtos"
    Entao o status code da resposta deve ser 400
    E o corpo da resposta deve conter "preco"

  @negativo
  Cenario: Tentar cadastrar produto sem campo obrigatorio descricao
    Dado que tenho os dados de um produto sem o campo "descricao"
    Quando realizo uma requisicao POST para "/produtos"
    Entao o status code da resposta deve ser 400
    E o corpo da resposta deve conter "descricao"

  @negativo
  Cenario: Tentar cadastrar produto sem campo obrigatorio quantidade
    Dado que tenho os dados de um produto sem o campo "quantidade"
    Quando realizo uma requisicao POST para "/produtos"
    Entao o status code da resposta deve ser 400
    E o corpo da resposta deve conter "quantidade"

  @negativo
  Cenario: Tentar cadastrar produto com preco invalido
    Dado que tenho os dados de um produto com preco "abc"
    Quando realizo uma requisicao POST para "/produtos"
    Entao o status code da resposta deve ser 400
    E o corpo da resposta deve conter "preco"

  @negativo
  Cenario: Tentar cadastrar produto com quantidade negativa
    Dado que tenho os dados de um produto com quantidade -1
    Quando realizo uma requisicao POST para "/produtos"
    Entao o status code da resposta deve ser 400
    E o corpo da resposta deve conter "quantidade"

  @negativo
  Cenario: Tentar cadastrar produto com payload vazio
    Dado que tenho um payload vazio
    Quando realizo uma requisicao POST para "/produtos"
    Entao o status code da resposta deve ser 400

  @negativo
  Cenario: Tentar cadastrar produto com JSON malformado
    Dado que tenho um JSON malformado
    Quando realizo uma requisicao POST para "/produtos" com JSON invalido
    Entao o status code da resposta deve ser 400
