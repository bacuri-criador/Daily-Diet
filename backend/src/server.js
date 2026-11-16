import 'dotenv/config';
import { app } from './app.js';
import { prisma } from './utils/prisma.js';

const port = Number(process.env.PORT) || 3333;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 24) {
  console.error('Defina JWT_SECRET com pelo menos 24 caracteres no arquivo backend/.env.');
  process.exit(1);
}

const server = app.listen(port, () => {
  console.log(`Daily Diet API disponível em http://localhost:${port}`);
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
