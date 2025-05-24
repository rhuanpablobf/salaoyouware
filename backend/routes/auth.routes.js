const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const {
  registrar,
  login,
  getUsuario,
  atualizarSenha,
  esqueceuSenha,
  resetarSenha
} = require('../controllers/auth.controller');

const { protect } = require('../middlewares/auth');

// Rota para registro de usuário
router.post(
  '/registrar',
  [
    check('nome', 'Nome é obrigatório').not().isEmpty(),
    check('email', 'Inclua um email válido').isEmail(),
    check('senha', 'Senha precisa ter 6 ou mais caracteres').isLength({ min: 6 })
  ],
  registrar
);

// Rota para login
router.post(
  '/login',
  [
    check('email', 'Inclua um email válido').isEmail(),
    check('senha', 'Senha é obrigatória').exists()
  ],
  login
);

// Rota para obter dados do usuário logado
router.get('/me', protect, getUsuario);

// Rota para atualizar senha
router.put(
  '/atualizar-senha',
  protect,
  [
    check('senhaAtual', 'Senha atual é obrigatória').not().isEmpty(),
    check('novaSenha', 'Nova senha precisa ter 6 ou mais caracteres').isLength({ min: 6 })
  ],
  atualizarSenha
);

// Rota para recuperação de senha
router.post(
  '/esqueceu-senha',
  [
    check('email', 'Inclua um email válido').isEmail()
  ],
  esqueceuSenha
);

// Rota para resetar senha com token
router.put(
  '/resetar-senha/:token',
  [
    check('senha', 'Senha precisa ter 6 ou mais caracteres').isLength({ min: 6 })
  ],
  resetarSenha
);

module.exports = router;