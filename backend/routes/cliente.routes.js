const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// Importação do controller (será implementado mais tarde)
// const clienteController = require('../controllers/cliente.controller');

// Rota temporária para teste
router.get('/test', (req, res) => {
  res.json({ msg: 'Rota de clientes funcionando' });
});

// Obter todos os clientes
router.get('/', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Obter todos os clientes' });
});

// Criar novo cliente
router.post('/', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Criar novo cliente' });
});

// Obter cliente específico
router.get('/:id', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: `Obter cliente ${req.params.id}` });
});

// Atualizar cliente
router.put('/:id', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: `Atualizar cliente ${req.params.id}` });
});

// Excluir cliente
router.delete('/:id', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: `Excluir cliente ${req.params.id}` });
});

module.exports = router;