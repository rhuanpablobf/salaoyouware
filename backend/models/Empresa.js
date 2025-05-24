const mongoose = require('mongoose');

const EmpresaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Por favor, forneça um nome'],
      trim: true,
      maxlength: [100, 'Nome não pode ter mais que 100 caracteres']
    },
    tipoNegocio: {
      type: String,
      enum: ['salao', 'barbearia', 'spa', 'clinica', 'outro'],
      default: 'salao'
    },
    email: {
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, forneça um email válido']
    },
    telefone: String,
    endereco: {
      type: Object,
      default: {}
    },
    logo: String,
    plano: {
      type: String,
      enum: ['gratuito', 'basico', 'premium', 'personalizado'],
      default: 'gratuito'
    },
    planoDetalhes: {
      type: Object,
      default: {
        limiteAgendamentos: 5,
        agendamentosUsados: 0
      }
    },
    ativa: {
      type: Boolean,
      default: true
    },
    horariosFuncionamento: {
      type: Object,
      default: {
        segunda: { aberto: true, inicio: '08:00', fim: '18:00' },
        terca: { aberto: true, inicio: '08:00', fim: '18:00' },
        quarta: { aberto: true, inicio: '08:00', fim: '18:00' },
        quinta: { aberto: true, inicio: '08:00', fim: '18:00' },
        sexta: { aberto: true, inicio: '08:00', fim: '18:00' },
        sabado: { aberto: true, inicio: '08:00', fim: '16:00' },
        domingo: { aberto: false, inicio: '', fim: '' }
      }
    },
    configuracoes: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Empresa', EmpresaSchema);