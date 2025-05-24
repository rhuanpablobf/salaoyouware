const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Usuario = require('../models/Usuario');
const Empresa = require('../models/Empresa');

// @desc    Registrar usuário e empresa
// @route   POST /api/auth/registrar
// @access  Público
exports.registrar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nome, email, senha, nomeEmpresa, tipoNegocio } = req.body;

  try {
    // Verificar se o usuário já existe
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        success: false,
        message: 'Usuário já existe'
      });
    }

    // Criar nova empresa
    const empresa = new Empresa({
      nome: nomeEmpresa,
      tipoNegocio: tipoNegocio || 'salao',
      email,
      plano: 'gratuito',
      planoDetalhes: {
        limiteAgendamentos: 5,
        agendamentosUsados: 0
      },
      horariosFuncionamento: {
        segunda: { aberto: true, inicio: '08:00', fim: '18:00' },
        terca: { aberto: true, inicio: '08:00', fim: '18:00' },
        quarta: { aberto: true, inicio: '08:00', fim: '18:00' },
        quinta: { aberto: true, inicio: '08:00', fim: '18:00' },
        sexta: { aberto: true, inicio: '08:00', fim: '18:00' },
        sabado: { aberto: true, inicio: '08:00', fim: '16:00' },
        domingo: { aberto: false, inicio: '', fim: '' }
      }
    });

    await empresa.save();

    // Criar novo usuário
    usuario = new Usuario({
      nome,
      email,
      senha,
      perfil: 'empresa',
      empresaId: empresa._id
    });

    // Salvar usuário
    await usuario.save();

    // Gerar token JWT
    const token = usuario.getSignedJwtToken();

    res.json({
      success: true,
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        empresaId: usuario.empresaId
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor',
      error: err.message
    });
  }
};

// @desc    Autenticar usuário e gerar token
// @route   POST /api/auth/login
// @access  Público
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, senha } = req.body;

  try {
    // Verificar usuário pelo email
    const usuario = await Usuario.findOne({ email }).select('+senha');

    if (!usuario) {
      return res.status(400).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar se a senha está correta
    const senhaCorreta = await usuario.matchPassword(senha);

    if (!senhaCorreta) {
      return res.status(400).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar se o usuário está ativo
    if (!usuario.ativo) {
      return res.status(401).json({
        success: false,
        message: 'Conta inativa. Entre em contato com o suporte.'
      });
    }

    // Gerar token JWT
    const token = usuario.getSignedJwtToken();

    // Se for empresa, verificar se está ativa
    if (usuario.perfil === 'empresa' && usuario.empresaId) {
      const empresa = await Empresa.findById(usuario.empresaId);
      
      if (!empresa || !empresa.ativa) {
        return res.status(401).json({
          success: false,
          message: 'Conta da empresa inativa. Entre em contato com o suporte.'
        });
      }
    }

    res.json({
      success: true,
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        empresaId: usuario.empresaId
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor',
      error: err.message
    });
  }
};

// @desc    Obter dados do usuário atual
// @route   GET /api/auth/me
// @access  Privado
exports.getUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-senha');
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Se for perfil empresa, incluir dados da empresa
    if (usuario.perfil === 'empresa' && usuario.empresaId) {
      const empresa = await Empresa.findById(usuario.empresaId);
      
      if (!empresa) {
        return res.status(404).json({
          success: false,
          message: 'Empresa não encontrada'
        });
      }
      
      return res.json({
        success: true,
        usuario,
        empresa
      });
    }

    res.json({
      success: true,
      usuario
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor',
      error: err.message
    });
  }
};

// @desc    Atualizar senha
// @route   PUT /api/auth/atualizar-senha
// @access  Privado
exports.atualizarSenha = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const usuario = await Usuario.findById(req.usuario.id).select('+senha');

    // Verificar senha atual
    const { senhaAtual, novaSenha } = req.body;
    const senhaCorreta = await usuario.matchPassword(senhaAtual);

    if (!senhaCorreta) {
      return res.status(401).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }

    // Atualizar senha
    usuario.senha = novaSenha;
    await usuario.save();

    res.json({
      success: true,
      message: 'Senha atualizada com sucesso'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor',
      error: err.message
    });
  }
};

// @desc    Solicitar recuperação de senha
// @route   POST /api/auth/esqueceu-senha
// @access  Público
exports.esqueceuSenha = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ email: req.body.email });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Gerar token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token e salvar no banco
    usuario.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Definir expiração (10 min)
    usuario.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await usuario.save();

    // TODO: Enviar email com token (em produção)
    
    // Para ambiente de desenvolvimento, apenas retornar o token
    res.json({
      success: true,
      message: 'Email de recuperação enviado',
      resetToken
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor',
      error: err.message
    });
  }
};

// @desc    Resetar senha
// @route   PUT /api/auth/resetar-senha/:token
// @access  Público
exports.resetarSenha = async (req, res) => {
  try {
    // Obter token e senha inserida
    const { token } = req.params;
    const { senha } = req.body;

    // Hash token recebido
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Buscar usuário com token válido
    const usuario = await Usuario.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!usuario) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }

    // Definir nova senha
    usuario.senha = senha;
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpire = undefined;

    await usuario.save();

    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor',
      error: err.message
    });
  }
};