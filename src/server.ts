import 'dotenv/config';
import app from './app.js';
import prisma from './config/database.js';

const PORT = process.env.PORT || 3000;

// Função para iniciar o servidor
const startServer = async (): Promise<void> => {
  try {
    // Testa a conexão com o banco de dados
    await prisma.$connect();
    console.log('✓ Conectado ao banco de dados');

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`✓ Servidor rodando na porta ${PORT}`);
      console.log(`✓ API disponível em: http://localhost:${PORT}`);
      console.log(`✓ Documentação: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('✗ Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

// Tratamento de sinais de encerramento
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n${signal} recebido. Encerrando graciosamente...`);

  try {
    await prisma.$disconnect();
    console.log('✓ Desconectado do banco de dados');
    process.exit(0);
  } catch (error) {
    console.error('✗ Erro ao desconectar:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Inicia o servidor
startServer();
