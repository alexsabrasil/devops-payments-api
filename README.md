
# API de Pagamentos — DevOps e Integração

API REST desenvolvida com Node.js, TypeScript e Express, utilizando PostgreSQL para persistência e Redis para cache.

O projeto demonstra integração entre serviços, validação de dados, testes automatizados e integração contínua com GitHub Actions.

## Tecnologias

- Node.js 22
- TypeScript
- Express
- PostgreSQL 15
- Redis 7
- Docker Compose
- GitHub Actions
- Node.js Test Runner

## Arquitetura

Cliente HTTP
    |
    v
API Express
    |
    v
Controller
    |
    v
Service
    |
    +--> PostgreSQL (persistência)
    |
    +--> Redis (cache)
    |
    +--> Gateway de pagamento simulado

## Funcionalidades

- Criação de pagamentos
- Consulta de pagamentos por identificador
- Simulação de processamento por gateway externo
- Atualização de status: PENDING, COMPLETED ou FAILED
- Persistência em PostgreSQL
- Cache em Redis
- Validação de dados de entrada
- Endpoint de verificação de saúde

## Endpoints

### GET /health

Verifica o estado informado pela API e suas conexões.

### POST /api/payments

Exemplo de requisição:

```json
{
  "amount": 75.50,
  "currency": "BRL",
  "user_id": "usuario-teste"
}
```

### GET /api/payments/:id

Consulta um pagamento pelo identificador UUID.

## Execução local

### Pré-requisitos

- Node.js 22
- npm
- Docker e Docker Compose

### Configuração

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Configure a senha do PostgreSQL em `.env`.

### Iniciar infraestrutura

```bash
docker compose up -d
```

### Instalar dependências

```bash
npm ci
```

### Iniciar a API

```bash
npm run build
npm start
```

A API estará disponível em:

http://localhost:3001

## Testes automatizados

Com PostgreSQL, Redis e API em execução:

```bash
npm test
```

Os seis testes atuais verificam:

1. Rejeição de valores negativos.
2. Rejeição de valor zero.
3. Rejeição de campos obrigatórios ausentes.
4. Criação e consulta de pagamento válido.
5. Rejeição de moeda com formato inválido.
6. Rejeição de valores com mais de duas casas decimais.

## Integração contínua

O GitHub Actions está configurado para:

1. Preparar o ambiente Node.js 22.
2. Inicializar PostgreSQL e Redis.
3. Instalar dependências.
4. Compilar o código TypeScript.
5. Inicializar o banco de dados.
6. Iniciar a API.
7. Executar os testes automatizados.

O workflow está em `.github/workflows/ci.yml`.

## Observações

Este projeto é acadêmico e utiliza um gateway de pagamento simulado. Não processa transações financeiras reais.

O projeto não deve ser utilizado em produção sem controles adicionais de segurança, autenticação, autorização e resiliência.
