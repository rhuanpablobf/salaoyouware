const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// Importação do controller (será implementado mais tarde)
// const empresaController = require('../controllers/empresa.controller');

// Rota temporária para teste
router.get('/test', (req, res) => {
  res.json({ msg: 'Rota de empresas funcionando' });
});

// Obter detalhes da empresa
router.get('/', auth.protect, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Obter detalhes da empresa' });
});

// Atualizar empresa
router.put('/', auth.protect, (req, res) => {
  // Implementação temporária
  res.json({ msg: 'Atualizar empresa' });
});

module.exports = router;