const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const {
  getDashboard,
  getEmpresas,
  getEmpresa,
  criarEmpresa,
  atualizarEmpresa,
  desativarEmpresa,
  getPlanos,
  criarPlano,
  atualizarPlano,
  getPagamentos,
  criarAdminUser,
  getAdminUsers
} = require('../controllers/admin.controller');

const { protect, authorize } = require('../middlewares/auth');

// Middleware de proteção e autorização para todas as rotas
router.use(protect);
router.use(authorize('admin'));

// Rotas para o dashboard admin
router.get('/dashboard', getDashboard);

// Rotas para gerenciar empresas
router.get('/empresas', getEmpresas);
router.get('/empresas/:id', getEmpresa);
router.post(
  '/empresas',
  [
    check('nome', 'Nome da empresa é obrigatório').not().isEmpty(),
    check('email', 'Inclua um email válido').isEmail()
  ],
  criarEmpresa
);
router.put('/empresas/:id', atualizarEmpresa);
router.delete('/empresas/:id', desativarEmpresa);

// Rotas para gerenciar planos
router.get('/planos', getPlanos);
router.post(
  '/planos',
  [
    check('nome', 'Nome do plano é obrigatório').not().isEmpty(),
    check('tipo', 'Tipo de plano é obrigatório').isIn(['gratuito', 'pago'])
  ],
  criarPlano
);
router.put('/planos/:id', atualizarPlano);

// Rotas para pagamentos e transações
router.get('/pagamentos', getPagamentos);

// Rotas para usuários admin
router.get('/users', getAdminUsers);
router.post(
  '/users',
  [
    check('nome', 'Nome é obrigatório').not().isEmpty(),
    check('email', 'Inclua um email válido').isEmail(),
    check('senha', 'Senha precisa ter 6 ou mais caracteres').isLength({ min: 6 }),
    check('perfil', 'Perfil é obrigatório').isIn(['admin', 'subadmin'])
  ],
  criarAdminUser
);

module.exports = router;