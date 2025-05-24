const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');

const UsuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Por favor, forneça um nome'],
      trim: true,
      maxlength: [50, 'Nome não pode ter mais que 50 caracteres']
    },
    email: {
      type: String,
      required: [true, 'Por favor, forneça um email'],
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, forneça um email válido']
    },
    senha: {
      type: String,
      required: [true, 'Por favor, forneça uma senha'],
      minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
      select: false
    },
    perfil: {
      type: String,
      enum: ['admin', 'empresa', 'subadmin'],
      default: 'empresa'
    },
    empresaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empresa',
      default: null
    },
    ativo: {
      type: Boolean,
      default: true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

// Aplica o plugin de validação única
UsuarioSchema.plugin(uniqueValidator, { message: '{PATH} já está em uso' });

// Criptografar a senha antes de salvar
UsuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

// Método para comparar senha inserida com a senha armazenada
UsuarioSchema.methods.matchPassword = async function(senhaInserida) {
  return await bcrypt.compare(senhaInserida, this.senha);
};

// Método para gerar e assinar um token JWT
UsuarioSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      name: this.nome,
      email: this.email,
      role: this.perfil
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

module.exports = mongoose.model('Usuario', UsuarioSchema);