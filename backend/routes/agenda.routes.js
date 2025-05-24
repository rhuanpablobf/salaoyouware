const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// Importação do controller (será implementado mais tarde)
// const agendaController = require('../controllers/agenda.controller');

// Rota temporária para teste
router.get('/test', (req, res) => {
  res.json({ msg: 'Rota de agendamentos funcionando' });
});

// Obter todos os agendamentos
router.get('/', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Obter todos os agendamentos' });
});

// Criar novo agendamento
router.post('/', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Criar novo agendamento' });
});

// Obter agendamento específico
router.get('/:id', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: `Obter agendamento ${req.params.id}` });
});

// Atualizar agendamento
router.put('/:id', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: `Atualizar agendamento ${req.params.id}` });
});

// Cancelar agendamento
router.delete('/:id', auth, (req, res) => {
  // Implementação temporária
  res.json({ msg: `Cancelar agendamento ${req.params.id}` });
});

module.exports = router;