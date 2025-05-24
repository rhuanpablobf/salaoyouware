const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// Importação do controller (será implementado mais tarde)
// const servicoController = require('../controllers/servico.controller');

// Rota temporária para teste
router.get('/test', (req, res) => {
  res.json({ msg: 'Rota de serviços funcionando' });
});

// Obter todos os serviços
router.get('/', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Obter todos os serviços' });
});

// Criar novo serviço
router.post('/', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Criar novo serviço' });
});

// Obter serviço específico
router.get('/:id', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: `Obter serviço ${req.params.id}` });
});

// Atualizar serviço
router.put('/:id', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: `Atualizar serviço ${req.params.id}` });
});

// Excluir serviço
router.delete('/:id', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: `Excluir serviço ${req.params.id}` });
});

module.exports = router;