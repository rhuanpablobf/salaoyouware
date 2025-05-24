const mongoose = require('mongoose');

const FinanceiroSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: ['receita', 'despesa', 'comissao'],
      required: true
    },
    descricao: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Descrição não pode ter mais que 200 caracteres']
    },
    valor: {
      type: Number,
      required: true,
      min: [0, 'Valor não pode ser negativo']
    },
    data: {
      type: Date,
      required: true,
      default: Date.now
    },
    categoria: {
      type: String,
      trim: true
    },
    formaPagamento: {
      type: String,
      enum: ['dinheiro', 'pix', 'credito', 'debito', 'transferencia', 'boleto', 'outro'],
      required: true
    },
    cliente: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente'
      },
      nome: String
    },
    servico: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Servico'
      },
      nome: String
    },
    profissional: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profissional'
      },
      nome: String
    },
    agendamentoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agendamento'
    },
    repete: {
      ativo: {
        type: Boolean,
        default: false
      },
      frequencia: {
        type: String,
        enum: ['diaria', 'semanal', 'mensal', 'anual']
      },
      proximaData: Date
    },
    observacoes: String,
    fechamentoCaixa: {
      fechado: {
        type: Boolean,
        default: false
      },
      dataFechamento: Date
    },
    empresaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empresa',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Índices para consultas comuns
FinanceiroSchema.index({ empresaId: 1, tipo: 1, data: 1 });
FinanceiroSchema.index({ empresaId: 1, 'fechamentoCaixa.fechado': 1 });

module.exports = mongoose.model('Financeiro', FinanceiroSchema);