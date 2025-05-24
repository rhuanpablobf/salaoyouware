const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Usuario = require('../models/Usuario');
const Empresa = require('../models/Empresa');
const Plano = require('../models/Plano');
const Agendamento = require('../models/Agendamento');
const Financeiro = require('../models/Financeiro');

// @desc    Obter dados do dashboard administrativo
// @route   GET /api/admin/dashboard
// @access  Privado/Admin
exports.getDashboard = async (req, res) => {
  try {
    // Calcular MRR (Monthly Recurring Revenue)
    const empresas = await Empresa.find({ plano: 'profissional' });
    
    // Contagem de empresas por plano
    const empresasPorPlano = await Empresa.aggregate([
      {
        $group: {
          _id: '$plano',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calcular MRR com base em uma assinatura média de R$89,90 para empresas no plano profissional
    const mrr = empresas.length * 89.9;
    
    // Empresas inadimplentes
    const empresasInadimplentes = await Empresa.countDocuments({
      plano: 'profissional',
      'planoDetalhes.statusPagamento': 'inadimplente'
    });
    
    // Taxa de conversão (empresas que migraram do plano gratuito para o pago)
    const taxaConversao = empresas.length > 0 ? 
      Math.round((empresas.length / (empresas.length + empresasPorPlano.find(p => p._id === 'gratuito')?.count || 0)) * 100) : 0;
    
    // Novos cadastros nos últimos 30 dias
    const novasEmpresas = await Empresa.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    // Empresas mais recentes
    const empresasRecentes = await Empresa.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('nome plano planoDetalhes.statusPagamento createdAt');
    
    // Atividades recentes (empresas que atualizaram plano, pagamentos, etc.)
    // Esta é uma simulação, em produção seria obtido de um log de atividades
    const atividadesRecentes = [
      {
        tipo: 'atualizacao_plano',
        empresaId: empresasRecentes[0]?._id,
        empresaNome: empresasRecentes[0]?.nome,
        descricao: 'Atualização para plano Profissional',
        data: new Date()
      },
      {
        tipo: 'pagamento',
        empresaId: empresasRecentes[1]?._id,
        empresaNome: empresasRecentes[1]?.nome,
        descricao: 'Pagamento recebido',
        data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];
    
    res.json({
      success: true,
      dadosDashboard: {
        mrr,
        totalEmpresas: empresas.length + (empresasPorPlano.find(p => p._id === 'gratuito')?.count || 0),
        empresasGratuito: empresasPorPlano.find(p => p._id === 'gratuito')?.count || 0,
        empresasProfissional: empresas.length,
        taxaConversao,
        empresasInadimplentes,
        taxaInadimplencia: empresas.length > 0 ? Math.round((empresasInadimplentes / empresas.length) * 100) : 0,
        novasEmpresas,
        empresasRecentes,
        atividadesRecentes,
        // Simular dados históricos para gráficos
        historicoMRR: [
          { mes: 'Ago', valor: mrr * 0.8 },
          { mes: 'Set', valor: mrr * 0.9 },
          { mes: 'Out', valor: mrr }
        ]
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

// @desc    Obter lista de empresas
// @route   GET /api/admin/empresas
// @access  Privado/Admin
exports.getEmpresas = async (req, res) => {
  try {
    const { plano, status, busca, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    // Construir filtros
    let filtros = {};
    
    if (plano) {
      filtros.plano = plano;
    }
    
    if (status) {
      if (status === 'ativas') filtros.ativa = true;
      if (status === 'inativas') filtros.ativa = false;
      if (status === 'inadimplentes') filtros['planoDetalhes.statusPagamento'] = 'inadimplente';
    }
    
    if (busca) {
      filtros = {
        ...filtros,
        $or: [
          { nome: { $regex: busca, $options: 'i' } },
          { email: { $regex: busca, $options: 'i' } }
        ]
      };
    }
    
    // Buscar empresas com paginação
    const empresas = await Empresa.find(filtros)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    // Contar total para paginação
    const total = await Empresa.countDocuments(filtros);
    
    res.json({
      success: true,
      data: empresas,
      paginacao: {
        total,
        pagina: Number(page),
        totalPaginas: Math.ceil(total / limit),
        porPagina: Number(limit)
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

// @desc    Obter dados detalhados de uma empresa
// @route   GET /api/admin/empresas/:id
// @access  Privado/Admin
exports.getEmpresa = async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    
    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada'
      });
    }
    
    // Buscar usuários vinculados à empresa
    const usuarios = await Usuario.find({ 
      empresaId: empresa._id 
    }).select('-senha');
    
    // Buscar estatísticas de uso
    // Simulamos aqui, mas em produção seriam dados reais
    const estatisticas = {
      agendamentosTotal: await Agendamento.countDocuments({ empresaId: empresa._id }),
      agendamentosRecentes: await Agendamento.countDocuments({ 
        empresaId: empresa._id,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      faturamentoMensal: await Financeiro.aggregate([
        {
          $match: { 
            empresaId: mongoose.Types.ObjectId(empresa._id),
            tipo: 'receita',
            data: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$valor' }
          }
        }
      ]).then(res => res[0]?.total || 0),
      clientesRegistrados: 0, // Calcularia a partir do modelo Cliente
      profissionaisAtivos: 0 // Calcularia a partir do modelo Profissional
    };
    
    res.json({
      success: true,
      data: {
        empresa,
        usuarios,
        estatisticas
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

// @desc    Criar nova empresa
// @route   POST /api/admin/empresas
// @access  Privado/Admin
exports.criarEmpresa = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { 
    nome, 
    email, 
    senha, 
    tipoNegocio, 
    plano = 'gratuito',
    telefone,
    whatsapp,
    endereco,
    limiteAgendamentos
  } = req.body;

  try {
    // Verificar se já existe um usuário com este email
    let usuarioExistente = await Usuario.findOne({ email });
    
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um usuário com este email'
      });
    }

    // Criar nova empresa
    const empresa = new Empresa({
      nome,
      tipoNegocio: tipoNegocio || 'salao',
      email,
      telefone,
      whatsapp,
      endereco,
      plano,
      planoDetalhes: {
        limiteAgendamentos: limiteAgendamentos || (plano === 'gratuito' ? 5 : -1),
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

    // Criar usuário para a empresa
    const usuario = new Usuario({
      nome: `Admin ${nome}`,
      email,
      senha: senha || 'empresa123', // Senha padrão se não fornecida
      perfil: 'empresa',
      empresaId: empresa._id
    });

    await usuario.save();

    res.status(201).json({
      success: true,
      data: {
        empresa,
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil
        }
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

// @desc    Atualizar empresa
// @route   PUT /api/admin/empresas/:id
// @access  Privado/Admin
exports.atualizarEmpresa = async (req, res) => {
  try {
    const { 
      nome, 
      tipoNegocio,
      telefone, 
      whatsapp, 
      email,
      plano,
      ativa,
      planoDetalhes
    } = req.body;

    let empresa = await Empresa.findById(req.params.id);
    
    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada'
      });
    }

    // Construir objeto de atualização
    const camposAtualizacao = {};
    
    if (nome) camposAtualizacao.nome = nome;
    if (tipoNegocio) camposAtualizacao.tipoNegocio = tipoNegocio;
    if (telefone) camposAtualizacao.telefone = telefone;
    if (whatsapp) camposAtualizacao.whatsapp = whatsapp;
    if (email) camposAtualizacao.email = email;
    if (plano) camposAtualizacao.plano = plano;
    if (ativa !== undefined) camposAtualizacao.ativa = ativa;
    
    if (planoDetalhes) {
      // Mescla os detalhes existentes com os novos
      camposAtualizacao.planoDetalhes = {
        ...empresa.planoDetalhes,
        ...planoDetalhes
      };
    }

    // Realizar a atualização
    empresa = await Empresa.findByIdAndUpdate(
      req.params.id,
      { $set: camposAtualizacao },
      { new: true }
    );

    res.json({
      success: true,
      data: empresa
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

// @desc    Desativar empresa
// @route   DELETE /api/admin/empresas/:id
// @access  Privado/Admin
exports.desativarEmpresa = async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    
    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada'
      });
    }

    // Desativar apenas, não excluir permanentemente
    empresa.ativa = false;
    await empresa.save();

    // Desativar usuários vinculados
    await Usuario.updateMany(
      { empresaId: empresa._id },
      { $set: { ativo: false } }
    );

    res.json({
      success: true,
      message: 'Empresa desativada com sucesso'
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

// @desc    Obter lista de planos
// @route   GET /api/admin/planos
// @access  Privado/Admin
exports.getPlanos = async (req, res) => {
  try {
    const planos = await Plano.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: planos
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

// @desc    Criar novo plano
// @route   POST /api/admin/planos
// @access  Privado/Admin
exports.criarPlano = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { 
      nome, 
      descricao, 
      tipo, 
      periodo,
      preco, 
      precoAnual,
      limites,
      recursos,
      stripeProductId,
      stripePriceId
    } = req.body;

    // Verificar se já existe plano com este nome
    const planoExistente = await Plano.findOne({ nome });
    
    if (planoExistente) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um plano com este nome'
      });
    }

    // Criar novo plano
    const plano = new Plano({
      nome,
      descricao,
      tipo,
      periodo: periodo || 'mensal',
      preco,
      precoAnual,
      limites,
      recursos,
      stripeProductId,
      stripePriceId
    });

    await plano.save();

    res.status(201).json({
      success: true,
      data: plano
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

// @desc    Atualizar plano
// @route   PUT /api/admin/planos/:id
// @access  Privado/Admin
exports.atualizarPlano = async (req, res) => {
  try {
    const { 
      nome, 
      descricao, 
      tipo, 
      periodo,
      preco, 
      precoAnual,
      limites,
      recursos,
      ativo,
      stripeProductId,
      stripePriceId
    } = req.body;

    let plano = await Plano.findById(req.params.id);
    
    if (!plano) {
      return res.status(404).json({
        success: false,
        message: 'Plano não encontrado'
      });
    }

    // Construir objeto de atualização
    const camposAtualizacao = {};
    
    if (nome) camposAtualizacao.nome = nome;
    if (descricao) camposAtualizacao.descricao = descricao;
    if (tipo) camposAtualizacao.tipo = tipo;
    if (periodo) camposAtualizacao.periodo = periodo;
    if (preco) camposAtualizacao.preco = preco;
    if (precoAnual) camposAtualizacao.precoAnual = precoAnual;
    if (ativo !== undefined) camposAtualizacao.ativo = ativo;
    if (stripeProductId) camposAtualizacao.stripeProductId = stripeProductId;
    if (stripePriceId) camposAtualizacao.stripePriceId = stripePriceId;
    
    if (limites) {
      camposAtualizacao.limites = {
        ...plano.limites,
        ...limites
      };
    }
    
    if (recursos) {
      camposAtualizacao.recursos = {
        ...plano.recursos,
        ...recursos
      };
    }

    // Realizar a atualização
    plano = await Plano.findByIdAndUpdate(
      req.params.id,
      { $set: camposAtualizacao },
      { new: true }
    );

    res.json({
      success: true,
      data: plano
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

// @desc    Obter histórico de pagamentos
// @route   GET /api/admin/pagamentos
// @access  Privado/Admin
exports.getPagamentos = async (req, res) => {
  try {
    const { status, periodo, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    // Na versão final, esta seria uma implementação real com dados do Stripe/AppMax
    // Para demonstração, retornamos dados simulados
    
    const pagamentos = [
      {
        id: '1',
        empresaId: '60d5ec9c8e1d8c001f3c2d1e',
        empresaNome: 'Salão Beleza & Arte',
        plano: 'Profissional',
        valor: 89.90,
        data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'sucesso',
        metodo: 'cartao',
        detalhes: {
          ultimos4: '4242'
        }
      },
      {
        id: '2',
        empresaId: '60d5ec9c8e1d8c001f3c2d2e',
        empresaNome: 'Barbearia Modern',
        plano: 'Profissional',
        valor: 89.90,
        data: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        status: 'falha',
        metodo: 'cartao',
        detalhes: {
          ultimos4: '0123',
          erro: 'Cartão recusado'
        }
      }
    ];
    
    res.json({
      success: true,
      data: pagamentos,
      paginacao: {
        total: pagamentos.length,
        pagina: Number(page),
        totalPaginas: Math.ceil(pagamentos.length / limit),
        porPagina: Number(limit)
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

// @desc    Criar usuário administrador
// @route   POST /api/admin/users
// @access  Privado/Admin
exports.criarAdminUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nome, email, senha, perfil } = req.body;

  try {
    // Verificar se já existe um usuário com este email
    let usuario = await Usuario.findOne({ email });
    
    if (usuario) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um usuário com este email'
      });
    }

    // Criar usuário admin/subadmin
    usuario = new Usuario({
      nome,
      email,
      senha,
      perfil // 'admin' ou 'subadmin'
    });

    await usuario.save();

    res.status(201).json({
      success: true,
      data: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
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

// @desc    Obter usuários administrativos
// @route   GET /api/admin/users
// @access  Privado/Admin
exports.getAdminUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.find({
      perfil: { $in: ['admin', 'subadmin'] }
    }).select('-senha');
    
    res.json({
      success: true,
      data: usuarios
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