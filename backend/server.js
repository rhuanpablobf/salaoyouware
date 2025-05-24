// Importações de pacotes
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Importação de rotas
const authRoutes = require('./routes/auth.routes');
const empresaRoutes = require('./routes/empresa.routes');
const agendaRoutes = require('./routes/agenda.routes');
const clienteRoutes = require('./routes/cliente.routes');
const equipeRoutes = require('./routes/equipe.routes');
const servicoRoutes = require('./routes/servico.routes');
const financeiroRoutes = require('./routes/financeiro.routes');
const relatorioRoutes = require('./routes/relatorio.routes');
const adminRoutes = require('./routes/admin.routes');

// Inicializa o app Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../')));

// Definição de rotas
app.use('/api/auth', authRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/equipe', equipeRoutes);
app.use('/api/servicos', servicoRoutes);
app.use('/api/financeiro', financeiroRoutes);
app.use('/api/relatorios', relatorioRoutes);
app.use('/api/admin', adminRoutes);

// Rota para o frontend (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Conexão com o MongoDB
const conectarDB = require('./config/database');

// Conectar ao MongoDB
conectarDB()
  .then(() => {
    // Inicia o servidor após conectar ao banco de dados
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err.message);
  });

// Tratamento de exceções não capturadas
process.on('uncaughtException', (err) => {
  console.error('Exceção não capturada:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Rejeição de promise não tratada:', err);
});