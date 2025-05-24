const mongoose = require('mongoose');

const PlanoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Por favor, forneça um nome'],
      trim: true,
      unique: true
    },
    descricao: String,
    tipo: {
      type: String,
      enum: ['gratuito', 'pago'],
      default: 'pago'
    },
    periodo: {
      type: String,
      enum: ['mensal', 'anual'],
      default: 'mensal'
    },
    preco: {
      type: Number,
      required: function() {
        return this.tipo === 'pago';
      },
      min: 0
    },
    precoAnual: {
      type: Number,
      min: 0
    },
    limites: {
      agendamentos: {
        type: Number,
        default: 5
      },
      profissionais: {
        type: Number,
        default: 1
      },
      clientes: {
        type: Number,
        default: -1 // -1 significa ilimitado
      },
      servicos: {
        type: Number,
        default: -1 // -1 significa ilimitado
      }
    },
    recursos: {
      financeiro: {
        type: Boolean,
        default: false
      },
      relatorios: {
        type: Boolean,
        default: false
      },
      fidelidade: {
        type: Boolean,
        default: false
      },
      notificacoes: {
        type: Boolean,
        default: false
      },
      multiplosUsuarios: {
        type: Boolean,
        default: false
      }
    },
    stripeProductId: String,
    stripePriceId: String,
    stripeMetadata: Object,
    ativo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Plano', PlanoSchema);