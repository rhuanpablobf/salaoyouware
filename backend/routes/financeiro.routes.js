const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// Importação do controller (será implementado mais tarde)
// const financeiroController = require('../controllers/financeiro.controller');

// Rota temporária para teste
router.get('/test', (req, res) => {
  res.json({ msg: 'Rota de financeiro funcionando' });
});

// Obter resumo financeiro
router.get('/resumo', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Obter resumo financeiro' });
});

// Obter todas as transações
router.get('/', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Obter todas as transações' });
});

// Registrar nova transação
router.post('/', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Registrar nova transação' });
});

// Obter transação específica
router.get('/:id', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: `Obter transação ${req.params.id}` });
});

// Atualizar transação
router.put('/:id', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: `Atualizar transação ${req.params.id}` });
});

// Excluir transação
router.delete('/:id', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: `Excluir transação ${req.params.id}` });
});

module.exports = router;