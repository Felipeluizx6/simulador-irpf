# Simulador de Imposto de Renda Pessoa Física (IRPF)

![Node](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-API-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Status](https://img.shields.io/badge/Status-Em%20Evolução-yellow)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

Projeto desenvolvido com foco em prática real de desenvolvimento fullstack, organização estrutural, versionamento profissional e evolução incremental.

O objetivo não é apenas calcular imposto.
É construir arquitetura.

## Objetivo

Desenvolver uma aplicação web capaz de:

- Receber renda mensal
- Considerar número de dependentes
- Calcular estimativa de IRPF
- Persistir os dados em banco PostgreSQL
- Retornar resultado via API REST
- Exibir resultado no front-end


## Arquitetura Atual

simulador-irpf/ │ ├── backend/ │   ├── server.js │   ├── package.json │   ├── .env │   └── node_modules/ │ ├── frontend/ │   ├── index.html │   ├── style.css │   └── script.js │ ├── .gitignore ├── README.md └── LICENSE

Separação clara entre camadas.
Front-end responsável por interface.
Back-end responsável por regra de negócio e persistência.

Essa reorganização foi um divisor de águas no projeto.

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- PostgreSQL
- Git
- GitHub

## Fluxo da Aplicação

1. Usuário envia dados pelo formulário
2. Front-end envia requisição POST para API
3. Servidor processa cálculo
4. Dados são salvos no PostgreSQL
5. API retorna JSON com resultado
6. Resultado é renderizado dinamicamente

Simples na teoria.
Trabalhoso na prática.


## Endpoints da API

### `POST /api/irpf`

Envia dados para cálculo e persistência.

**Body esperado:**
```json
{
  "monthly_income": 6000,
  "dependents": 2
}

Resposta:

{
  "annual_income": 72000,
  "tax_due": 10235.45,
  "tax_rate": 22.5
}


GET /api/irpf?limit=10

Retorna últimos registros salvos.

GET /health

Verificação de status do servidor.


Banco de Dados

PostgreSQL utilizado para persistência.

Variáveis sensíveis protegidas via .env.

O uso do .gitignore evita exposição de credenciais.


# Como Rodar o Projeto

# Clonar repositório

git clone <url-do-repositorio>

# Instalar dependências

cd backend
npm install

# Configurar arquivo .env

Exemplo:

PORT=3000
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=irpf_db

# Rodar servidor

node server.js

Servidor rodando em:

http://localhost:3000
Acesse o front-end em:
http://localhost:3000/index.html

# Desafios Enfrentados

Erros de rota (Cannot GET)

Organização de diretórios

Separação front/back

Configuração do PostgreSQL

Testes via terminal (Invoke-RestMethod)

Debug via DevTools (F12 / Network)


Foi a parte que mais exigiu disciplina. Teve erro, teve retrabalho, mas foi ali que o projeto amadureceu.


# Próximos Passos

Implementar filtros avançados

Consulta por ID

Melhorar documentação da API

Implementar gráficos

Deploy em ambiente real


# Objetivo Acadêmico e Profissional

Este projeto integra formação prática em:

Desenvolvimento Fullstack

Arquitetura de Software

Integração com Banco de Dados

Organização estrutural

Versionamento profissional


Mais do que um simulador. É um laboratório de engenharia.


Autor

Luiz Felipe M. Silva
XBase Intelligence
contato@felipexbase.com.br




# Licença

Distribuído sob licença MIT
Veja LICENSE para mais detalhes.