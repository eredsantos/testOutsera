# language: pt
@api @produtos @delete
Funcionalidade: DELETE /produtos - Excluir produtos
  Como um usuario administrador da API
  Quero excluir produtos
  Para remover produtos que nao estao mais disponiveis

  Contexto:
    Dado que a API esta disponivel
    E que estou autenticado como administrador

  @smoke @positivo
  Cenario: Excluir produto existente com sucesso
    Dado que existe um produto cadastrado
    Quando realizo uma requisicao DELETE para "/produtos/{id}" com o ID do produto
    Entao o status code da resposta deve ser 200
    E o header "content-type" deve conter "application/json"
    E o corpo da resposta deve conter a mensagem "Registro excluído com sucesso"
    E ao consultar o produto ele nao deve mais existir

  @positivo
  Cenario: Tentar excluir produto com ID inexistente
    Quando realizo uma requisicao DELETE para "/produtos/idInexistente999"
    Entao o status code da resposta deve ser 200
    E o header "content-type" deve conter "application/json"
    E o corpo da resposta deve conter a mensagem "Nenhum registro excluído"

  @negativo
  Cenario: Tentar usar metodo nao permitido para exclusao
    Dado que existe um produto cadastrado
    Quando realizo uma requisicao PATCH para "/produtos/{id}" com o ID do produto
    Entao o status code da resposta deve ser 405
