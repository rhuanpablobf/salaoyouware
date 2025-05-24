# BelezaPro - Sistema SaaS para Salões de Beleza

Este é o backend do sistema BelezaPro, uma plataforma SaaS para gerenciamento de salões de beleza, barbearias e clínicas de estética.

## Requisitos

- Node.js (v14+)
- MongoDB (v4+)
- NPM ou Yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/belezapro.git
cd belezapro
```

2. Instale as dependências:
```bash
# Navegue até a pasta do backend
cd src/backend

# Instale as dependências
npm install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto backend com as seguintes variáveis:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/belezapro
   JWT_SECRET=sua_chave_secreta_jwt
   JWT_EXPIRE=30d
   STRIPE_SECRET_KEY=sua_chave_stripe
   STRIPE_WEBHOOK_SECRET=seu_webhook_secret_stripe
   ```

4. Configure o MongoDB:
   - Instale o MongoDB em sua máquina local ou use um serviço como MongoDB Atlas
   - Para MongoDB local, certifique-se de que o serviço está em execução
   - Para MongoDB Atlas, substitua a URL de conexão no arquivo `.env`

## Executando o projeto

1. Inicie o servidor backend:
```bash
# Modo de desenvolvimento com auto-reload
npm run dev

# OU para produção
npm start
```

2. Servidor estará disponível em `http://localhost:5000`

## Endpoints principais da API

### Autenticação
- `POST /api/auth/registrar` - Registrar nova empresa/usuário
- `POST /api/auth/login` - Fazer login e obter token JWT
- `GET /api/auth/me` - Obter dados do usuário autenticado

### Empresas (Admin)
- `GET /api/admin/empresas` - Listar todas as empresas
- `POST /api/admin/empresas` - Criar uma nova empresa
- `PUT /api/admin/empresas/:id` - Atualizar empresa
- `DELETE /api/admin/empresas/:id` - Desativar empresa

### Agenda
- `GET /api/agenda` - Listar agendamentos
- `POST /api/agenda` - Criar novo agendamento
- `PUT /api/agenda/:id` - Atualizar agendamento
- `DELETE /api/agenda/:id` - Cancelar agendamento

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Criar novo cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Desativar cliente

### Equipe/Profissionais
- `GET /api/equipe` - Listar profissionais
- `POST /api/equipe` - Criar novo profissional
- `PUT /api/equipe/:id` - Atualizar profissional
- `DELETE /api/equipe/:id` - Desativar profissional

### Serviços
- `GET /api/servicos` - Listar serviços
- `POST /api/servicos` - Criar novo serviço
- `PUT /api/servicos/:id` - Atualizar serviço
- `DELETE /api/servicos/:id` - Desativar serviço

### Financeiro
- `GET /api/financeiro` - Listar movimentações financeiras
- `POST /api/financeiro` - Registrar nova receita/despesa
- `GET /api/financeiro/caixa` - Buscar dados do caixa
- `POST /api/financeiro/fechamento` - Realizar fechamento de caixa

### Relatórios
- `GET /api/relatorios/faturamento` - Relatório de faturamento
- `GET /api/relatorios/servicos` - Relatório de serviços
- `GET /api/relatorios/clientes` - Relatório de clientes
- `GET /api/relatorios/agendamentos` - Relatório de agendamentos

## Conexão com o frontend

O frontend deve ser configurado para fazer requisições para a API do backend.

1. No arquivo de configuração do frontend (provavelmente em `/src/js/config.js`), defina o endereço da API:
```javascript
const API_URL = 'http://localhost:5000/api';
export default API_URL;
```

2. Utilize este endereço para todas as requisições HTTP do frontend.

## Conectando a um banco de dados MongoDB remoto

Se você deseja conectar a um banco MongoDB remoto, como MongoDB Atlas:

1. Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster (o nível gratuito é suficiente para testes)
3. Crie um usuário de banco de dados com permissões adequadas
4. Obtenha a string de conexão
5. Atualize a variável `MONGO_URI` no arquivo `.env` com a string de conexão obtida

Exemplo de string de conexão:
```
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/belezapro?retryWrites=true&w=majority
```

## Observações importantes

- Para implantação em produção, certifique-se de configurar variáveis de ambiente seguras e um serviço de banco de dados MongoDB escalável.
- Para desenvolvimento local, você pode usar o MongoDB Community Edition instalado em sua máquina.
- O sistema usa JWT para autenticação, então é importante manter o JWT_SECRET seguro e não compartilhá-lo.