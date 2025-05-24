const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Por favor, forneça um nome'],
      trim: true,
      maxlength: [100, 'Nome não pode ter mais que 100 caracteres']
    },
    telefone: {
      type: String,
      required: [true, 'Por favor, forneça um telefone'],
      trim: true,
      maxlength: [20, 'Telefone não pode ter mais que 20 caracteres']
    },
    email: {
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, forneça um email válido']
    },
    dataNascimento: {
      type: Date
    },
    endereco: {
      cep: String,
      rua: String,
      numero: String,
      complemento: String,
      bairro: String,
      cidade: String,
      estado: String
    },
    observacoes: {
      type: String,
      maxlength: [1000, 'Observações não podem ter mais que 1000 caracteres']
    },
    preferencias: [String],
    fidelidade: {
      pontos: {
        type: Number,
        default: 0
      },
      nivel: {
        type: Number,
        default: 0
      },
      ultimoResgate: Date
    },
    historicoTratamentos: [{
      data: {
        type: Date,
        default: Date.now
      },
      tratamento: String,
      observacao: String
    }],
    alertas: {
      alergias: [String],
      restricoes: [String]
    },
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

module.exports = mongoose.model('Cliente', ClienteSchema);