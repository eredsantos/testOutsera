# language: pt
@api @produtos @get
Funcionalidade: GET /produtos - Listar e buscar produtos
  Como um usuario da API
  Quero consultar produtos cadastrados
  Para visualizar as informacoes dos produtos disponiveis

  Contexto:
    Dado que a API esta disponivel

  @smoke @positivo
  Cenario: Listar todos os produtos com sucesso
    Quando realizo uma requisicao GET para "/produtos"
    Entao o status code da resposta deve ser 200
    E o header "content-type" deve conter "application/json"
    E o corpo da resposta deve conter o campo "quantidade"
    E o corpo da resposta deve conter o campo "produtos"
    E o schema da resposta deve ser valido para lista de produtos

  @positivo
  Cenario: Buscar produto por ID existente
    Dado que existe um produto cadastrado
    Quando realizo uma requisicao GET para "/produtos/{id}" com o ID do produto
    Entao o status code da resposta deve ser 200
    E o header "content-type" deve conter "application/json"
    E o corpo da resposta deve conter o campo "nome"
    E o corpo da resposta deve conter o campo "preco"
    E o corpo da resposta deve conter o campo "descricao"
    E o corpo da resposta deve conter o campo "quantidade"
    E o corpo da resposta deve conter o campo "_id"
    E o schema da resposta deve ser valido para produto

  @positivo
  Cenario: Buscar produtos com filtro por nome
    Dado que existe um produto cadastrado
    Quando realizo uma requisicao GET para "/produtos" com o parametro "nome"
    Entao o status code da resposta deve ser 200
    E o header "content-type" deve conter "application/json"
    E todos os produtos retornados devem conter o nome filtrado

  @positivo
  Cenario: Buscar produtos com filtro por preco
    Dado que existe um produto cadastrado
    Quando realizo uma requisicao GET para "/produtos" com o parametro "preco"
    Entao o status code da resposta deve ser 200
    E o header "content-type" deve conter "application/json"
    E todos os produtos retornados devem ter o preco filtrado

  @negativo
  Cenario: Buscar produto com ID inexistente
    Quando realizo uma requisicao GET para "/produtos/idInexistente123"
    Entao o status code da resposta deve ser 400
    E o header "content-type" deve conter "application/json"
    E o corpo da resposta deve conter a mensagem "Produto não encontrado"

  @negativo
  Cenario: Tentar usar metodo nao permitido na listagem de produtos
    Quando realizo uma requisicao PATCH para "/produtos"
    Entao o status code da resposta deve ser 405
