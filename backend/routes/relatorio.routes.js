const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth').protect;

// Importação do controller (será implementado mais tarde)
// const relatorioController = require('../controllers/relatorio.controller');

// Rota temporária para teste
router.get('/test', (req, res) => {
  res.json({ msg: 'Rota de relatórios funcionando' });
});

// Obter relatório de agendamentos
router.get('/agendamentos', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Obter relatório de agendamentos' });
});

// Obter relatório de clientes
router.get('/clientes', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Obter relatório de clientes' });
});

// Obter relatório financeiro
router.get('/financeiro', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Obter relatório financeiro' });
});

// Obter relatório de serviços
router.get('/servicos', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Obter relatório de serviços' });
});

// Obter relatório personalizado
router.post('/personalizado', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Gerar relatório personalizado' });
});

module.exports = router;