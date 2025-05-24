const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Protege rotas que exigem autenticação
exports.protect = async (req, res, next) => {
  let token;

  // Verificar se o token está no header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Formato: Bearer <token>
    token = req.headers.authorization.split(' ')[1];
  }

  // Verificar se o token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acesso não autorizado. Autenticação necessária.'
    });
  }

  try {
    // Verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adicionar usuário à requisição
    req.usuario = await Usuario.findById(decoded.id);
    
    if (!req.usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    if (req.usuario.empresaId) {
      req.empresaId = req.usuario.empresaId;
    }
    
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Acesso não autorizado. Token inválido.'
    });
  }
};

// Restringe acesso baseado no perfil do usuário
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: 'Acesso não autorizado. Autenticação necessária.'
      });
    }

    if (!roles.includes(req.usuario.perfil)) {
      return res.status(403).json({
        success: false,
        message: `Usuário com perfil '${req.usuario.perfil}' não tem permissão para acessar este recurso`
      });
    }
    
    next();
  };
};

// Middleware para verificar limites do plano
exports.verificaLimitePlano = async (req, res, next) => {
  try {
    // Obter dados da empresa
    const empresaId = req.empresaId;
    
    if (!empresaId) {
      return res.status(400).json({
        success: false,
        message: 'Empresa não identificada'
      });
    }
    
    const Empresa = require('../models/Empresa');
    const empresa = await Empresa.findById(empresaId);
    
    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada'
      });
    }
    
    // Verificar plano e limites para criação de agendamento
    if (req.originalUrl.includes('/agenda') && req.method === 'POST') {
      // Verificar se é plano gratuito e se atingiu o limite
      if (empresa.plano === 'gratuito' && 
          empresa.planoDetalhes.agendamentosUsados >= empresa.planoDetalhes.limiteAgendamentos) {
        return res.status(403).json({
          success: false,
          message: 'Limite de agendamentos atingido no plano gratuito. Atualize para o plano profissional.',
          limitePlano: true
        });
      }
    }
    
    // Salvar na requisição para usar nos controllers
    req.empresa = empresa;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar limites do plano',
      error: err.message
    });
  }
};