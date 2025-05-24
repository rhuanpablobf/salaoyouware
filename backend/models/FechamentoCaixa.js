const mongoose = require('mongoose');

const FechamentoCaixaSchema = new mongoose.Schema(
  {
    data: {
      type: Date,
      required: true,
      default: Date.now
    },
    receitas: {
      total: {
        type: Number,
        required: true,
        default: 0
      },
      dinheiro: {
        type: Number,
        default: 0
      },
      cartao: {
        type: Number,
        default: 0
      },
      pix: {
        type: Number,
        default: 0
      },
      outros: {
        type: Number,
        default: 0
      }
    },
    despesas: {
      total: {
        type: Number,
        required: true,
        default: 0
      },
      dinheiro: {
        type: Number,
        default: 0
      },
      cartao: {
        type: Number,
        default: 0
      },
      pix: {
        type: Number,
        default: 0
      },
      outros: {
        type: Number,
        default: 0
      }
    },
    saldo: {
      type: Number,
      required: true
    },
    caixaInicial: {
      type: Number,
      default: 0
    },
    caixaFinal: {
      type: Number,
      default: 0
    },
    valorSistema: {
      type: Number,
      required: true
    },
    valorReal: {
      type: Number,
      required: true
    },
    diferenca: {
      type: Number,
      default: 0
    },
    observacoes: String,
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    movimentos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Financeiro'
      }
    ],
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

module.exports = mongoose.model('FechamentoCaixa', FechamentoCaixaSchema);