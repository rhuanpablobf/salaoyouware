const mongoose = require('mongoose');

const AgendamentoSchema = new mongoose.Schema(
  {
    cliente: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
      },
      nome: {
        type: String,
        required: true
      },
      telefone: String,
      email: String
    },
    profissional: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profissional',
        required: true
      },
      nome: {
        type: String,
        required: true
      }
    },
    servico: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Servico',
        required: true
      },
      nome: {
        type: String,
        required: true
      },
      preco: {
        type: Number,
        required: true
      },
      duracao: {
        type: Number,
        required: true
      }
    },
    data: {
      type: Date,
      required: true
    },
    horarioInicio: {
      type: String,
      required: true
    },
    horarioFim: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pendente', 'confirmado', 'concluido', 'cancelado', 'ausente'],
      default: 'pendente'
    },
    pagamento: {
      status: {
        type: String,
        enum: ['pendente', 'pago', 'cancelado'],
        default: 'pendente'
      },
      metodo: {
        type: String,
        enum: ['dinheiro', 'pix', 'credito', 'debito', 'transferencia', 'nenhum'],
        default: 'nenhum'
      },
      valor: {
        type: Number
      },
      dataRegistro: {
        type: Date
      }
    },
    observacoes: String,
    lembretesEnviados: [
      {
        tipo: {
          type: String,
          enum: ['email', 'sms', 'whatsapp']
        },
        data: {
          type: Date,
          default: Date.now
        },
        status: {
          type: String,
          enum: ['enviado', 'falha']
        }
      }
    ],
    avaliacao: {
      nota: {
        type: Number,
        min: 1,
        max: 5
      },
      comentario: String,
      data: Date
    },
    historicoCancelamento: {
      data: Date,
      motivo: String,
      solicitadoPor: {
        type: String,
        enum: ['cliente', 'empresa']
      }
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

// Índice para consultas por data
AgendamentoSchema.index({ empresaId: 1, data: 1 });
AgendamentoSchema.index({ 'profissional.id': 1, data: 1 });

module.exports = mongoose.model('Agendamento', AgendamentoSchema);