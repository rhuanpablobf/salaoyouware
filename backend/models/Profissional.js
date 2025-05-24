const mongoose = require('mongoose');

const ProfissionalSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Por favor, forneça um nome'],
      trim: true,
      maxlength: [100, 'Nome não pode ter mais que 100 caracteres']
    },
    especialidade: {
      type: String,
      required: [true, 'Por favor, forneça uma especialidade'],
      trim: true
    },
    telefone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, forneça um email válido']
    },
    fotoPerfil: {
      type: String,
      default: 'default-avatar.png'
    },
    biografia: {
      type: String,
      maxlength: [500, 'Biografia não pode ter mais que 500 caracteres']
    },
    comissaoPadrao: {
      type: Number,
      min: 0,
      max: 100,
      default: 40
    },
    dataInicio: {
      type: Date,
      default: Date.now
    },
    horarios: {
      domingo: {
        trabalha: { type: Boolean, default: false },
        intervalos: [
          {
            inicio: String,
            fim: String,
            pausa: Boolean
          }
        ]
      },
      segunda: {
        trabalha: { type: Boolean, default: true },
        intervalos: [
          {
            inicio: String,
            fim: String,
            pausa: Boolean
          }
        ]
      },
      terca: {
        trabalha: { type: Boolean, default: true },
        intervalos: [
          {
            inicio: String,
            fim: String,
            pausa: Boolean
          }
        ]
      },
      quarta: {
        trabalha: { type: Boolean, default: true },
        intervalos: [
          {
            inicio: String,
            fim: String,
            pausa: Boolean
          }
        ]
      },
      quinta: {
        trabalha: { type: Boolean, default: true },
        intervalos: [
          {
            inicio: String,
            fim: String,
            pausa: Boolean
          }
        ]
      },
      sexta: {
        trabalha: { type: Boolean, default: true },
        intervalos: [
          {
            inicio: String,
            fim: String,
            pausa: Boolean
          }
        ]
      },
      sabado: {
        trabalha: { type: Boolean, default: true },
        intervalos: [
          {
            inicio: String,
            fim: String,
            pausa: Boolean
          }
        ]
      }
    },
    servicos: [{
      servicoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Servico',
        required: true
      },
      comissao: {
        type: Number,
        min: 0,
        max: 100
      }
    }],
    empresaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empresa',
      required: true
    },
    ativo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Profissional', ProfissionalSchema);