# language: pt
@ui @login
Funcionalidade: Login na aplicacao
  Como um usuario do sistema
  Quero realizar login na aplicacao
  Para acessar as funcionalidades disponiveis

  Contexto:
    Dado que estou na pagina de login

  @smoke @positivo
  Cenario: Login com credenciais validas
    Dado que tenho credenciais validas de usuario
    Quando preencho o campo email com credenciais validas
    E preencho o campo senha com credenciais validas
    E clico no botao Entrar
    Entao devo ser redirecionado para a pagina inicial
    E o botao de logout deve estar visivel

  @positivo
  Cenario: Login com usuario nao administrador
    Dado que tenho credenciais de usuario nao administrador
    Quando realizo login com as credenciais
    Entao devo ser redirecionado para a pagina inicial
    E o botao de logout deve estar visivel

  @negativo
  Cenario: Tentativa de login com senha incorreta
    Dado que tenho um email valido
    E tenho uma senha incorreta
    Quando preencho o campo email
    E preencho o campo senha
    E clico no botao Entrar
    Entao devo permanecer na pagina de login
    E deve ser exibida a mensagem de erro "Email e/ou senha inválidos"

  @negativo
  Cenario: Tentativa de login com email inexistente
    Dado que tenho um email inexistente
    E tenho uma senha qualquer
    Quando preencho o campo email
    E preencho o campo senha
    E clico no botao Entrar
    Entao devo permanecer na pagina de login
    E deve ser exibida a mensagem de erro "Email e/ou senha inválidos"

  @negativo
  Cenario: Tentativa de login sem preencher a senha
    Dado que tenho um email valido
    Quando preencho o campo email
    E clico no botao Entrar
    Entao devo permanecer na pagina de login
    E deve ser exibida a mensagem de erro "Password é obrigatório"

  @negativo
  Cenario: Tentativa de login sem preencher o email
    Dado que tenho uma senha valida
    Quando preencho o campo senha
    E clico no botao Entrar
    Entao devo permanecer na pagina de login
    E deve ser exibida a mensagem de erro "Email é obrigatório"

  @negativo
  Cenario: Tentativa de login sem preencher nenhum campo
    Quando clico no botao Entrar
    Entao devo permanecer na pagina de login
    E deve ser exibida a mensagem de erro "Email é obrigatório"
    E deve ser exibida a mensagem de erro "Password é obrigatório"

  @negativo
  Cenario: Tentativa de login com email em formato invalido
    Dado que tenho um email em formato invalido
    E tenho uma senha valida
    Quando preencho o campo email
    E preencho o campo senha
    E clico no botao Entrar
    Entao devo permanecer na pagina de login
    E deve ser exibida a mensagem de erro "Email deve ser um email válido"
