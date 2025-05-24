const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    // Conexão com MongoDB Atlas ou fallback para localhost
    const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://rhuan:15Rhuanp@cluster0.tccvkh6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    console.log('Tentando conectar ao MongoDB Atlas...');
    console.log('URI de conexão:', MONGO_URI.replace(/(mongodb\+srv:\/\/[^:]+:)([^@]+)/, '$1*****'));
    
    const conexao = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('==============================================');
    console.log(`✅ MongoDB conectado com sucesso!`);
    console.log(`✅ Servidor: ${conexao.connection.host}`);
    console.log(`✅ Banco de dados: ${conexao.connection.name}`);
    console.log('==============================================');
    
    // Testar funcionalidade do banco com uma consulta simples
    const admin = conexao.connection.db.admin();
    const serverStatus = await admin.serverStatus();
    console.log(`MongoDB versão: ${serverStatus.version}`);
    console.log(`Tempo online: ${Math.floor(serverStatus.uptime / 60)} minutos`);
    console.log(`Conexões ativas: ${serverStatus.connections.current}`);
    
    return conexao;
  } catch (error) {
    console.error('==============================================');
    console.error(`❌ ERRO DE CONEXÃO COM MONGODB:`);
    console.error(`❌ ${error.message}`);
    
    if (error.name === 'MongoNetworkError') {
      console.error('❌ Erro de rede. Verifique sua conexão com a internet.');
    }
    
    if (error.message.includes('Authentication failed')) {
      console.error('❌ Falha de autenticação. Verifique seu usuário e senha.');
    }
    
    if (error.message.includes('timed out')) {
      console.error('❌ Tempo de conexão esgotado. O servidor MongoDB pode estar inacessível.');
    }
    
    console.error('==============================================');
    process.exit(1);
  }
};

module.exports = conectarDB;