const mongoose = require('mongoose');

const ServicoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Por favor, forneça um nome'],
      trim: true,
      maxlength: [100, 'Nome não pode ter mais que 100 caracteres']
    },
    descricao: {
      type: String,
      maxlength: [500, 'Descrição não pode ter mais que 500 caracteres']
    },
    categoria: {
      type: String,
      required: true,
      enum: ['cortes', 'coloracao', 'penteados', 'tratamentos', 'manicure', 'depilacao', 'outro']
    },
    duracao: {
      type: Number,
      required: [true, 'Por favor, forneça a duração do serviço'],
      min: [5, 'Duração mínima é de 5 minutos'],
      max: [480, 'Duração máxima é de 480 minutos (8 horas)']
    },
    preco: {
      type: Number,
      required: [true, 'Por favor, forneça o preço do serviço'],
      min: [0, 'Preço não pode ser negativo']
    },
    comissaoPadrao: {
      type: Number,
      min: 0,
      max: 100,
      default: 40
    },
    tipo: {
      type: String,
      enum: ['servico', 'combo'],
      default: 'servico'
    },
    servicosIncluidos: [{
      servicoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Servico'
      },
      nome: String,
      preco: Number,
      duracao: Number
    }],
    desconto: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    ativo: {
      type: Boolean,
      default: true
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

module.exports = mongoose.model('Servico', ServicoSchema);