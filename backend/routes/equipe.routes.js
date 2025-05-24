const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// Importação do controller (será implementado mais tarde)
// const equipeController = require('../controllers/equipe.controller');

// Rota temporária para teste
router.get('/test', (req, res) => {
  res.json({ msg: 'Rota de equipe funcionando' });
});

// Obter todos os profissionais
router.get('/', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Obter todos os profissionais' });
});

// Criar novo profissional
router.post('/', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Criar novo profissional' });
});

// Obter profissional específico
router.get('/:id', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: `Obter profissional ${req.params.id}` });
});

// Atualizar profissional
router.put('/:id', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: `Atualizar profissional ${req.params.id}` });
});

// Excluir profissional
router.delete('/:id', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: `Excluir profissional ${req.params.id}` });
});

module.exports = router;