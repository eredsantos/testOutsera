# language: pt
@api @produtos @put
Funcionalidade: PUT /produtos - Editar produtos
  Como um usuario administrador da API
  Quero editar produtos existentes
  Para manter as informacoes atualizadas

  Contexto:
    Dado que a API esta disponivel
    E que estou autenticado como administrador

  @smoke @positivo
  Cenario: Editar produto existente com sucesso
    Dado que existe um produto cadastrado
    E que tenho os dados atualizados do produto
    Quando realizo uma requisicao PUT para "/produtos/{id}" com o ID do produto
    Entao o status code da resposta deve ser 200
    E o header "content-type" deve conter "application/json"
    E o corpo da resposta deve conter a mensagem "Registro alterado com sucesso"
    E o schema da resposta deve ser valido para alteracao com sucesso

  @positivo
  Cenario: Editar todos os campos de um produto
    Dado que existe um produto cadastrado
    E que tenho novos dados para todos os campos do produto
    Quando realizo uma requisicao PUT para "/produtos/{id}" com o ID do produto
    Entao o status code da resposta deve ser 200
    E o corpo da resposta deve conter a mensagem "Registro alterado com sucesso"
    E ao consultar o produto os dados devem estar atualizados

  @positivo
  Cenario: Criar novo produto ao tentar editar ID inexistente
    Dado que tenho os dados validos de um produto
    Quando realizo uma requisicao PUT para "/produtos/idInexistente999"
    Entao o status code da resposta deve ser 201
    E o header "content-type" deve conter "application/json"
    E o corpo da resposta deve conter a mensagem "Cadastro realizado com sucesso"
    E o corpo da resposta deve conter o campo "_id"

  @negativo
  Cenario: Tentar editar produto para nome ja existente
    Dado que existem dois produtos cadastrados
    E que tenho os dados do primeiro produto com nome do segundo
    Quando realizo uma requisicao PUT para "/produtos/{id}" do primeiro produto
    Entao o status code da resposta deve ser 400
    E o header "content-type" deve conter "application/json"
    E o corpo da resposta deve conter a mensagem "Já existe produto com esse nome"

  @negativo
  Cenario: Tentar editar produto removendo campo obrigatorio nome
    Dado que existe um produto cadastrado
    E que tenho os dados do produto sem o campo "nome"
    Quando realizo uma requisicao PUT para "/produtos/{id}" com o ID do produto
    Entao o status code da resposta deve ser 400
    E o corpo da resposta deve conter "nome"

  @negativo
  Cenario: Tentar editar produto com preco invalido
    Dado que existe um produto cadastrado
    E que tenho os dados do produto com preco "texto"
    Quando realizo uma requisicao PUT para "/produtos/{id}" com o ID do produto
    Entao o status code da resposta deve ser 400
    E o corpo da resposta deve conter "preco"

  @negativo
  Cenario: Tentar editar produto com quantidade negativa
    Dado que existe um produto cadastrado
    E que tenho os dados do produto com quantidade -5
    Quando realizo uma requisicao PUT para "/produtos/{id}" com o ID do produto
    Entao o status code da resposta deve ser 400
    E o corpo da resposta deve conter "quantidade"

  @negativo
  Cenario: Tentar editar produto com payload vazio
    Dado que existe um produto cadastrado
    E que tenho um payload vazio
    Quando realizo uma requisicao PUT para "/produtos/{id}" com o ID do produto
    Entao o status code da resposta deve ser 400

  @negativo
  Cenario: Tentar editar produto com JSON malformado
    Dado que existe um produto cadastrado
    E que tenho um JSON malformado
    Quando realizo uma requisicao PUT para "/produtos/{id}" com JSON invalido
    Entao o status code da resposta deve ser 400
