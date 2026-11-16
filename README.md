# Daily Diet — Projeto Fullstack

Aplicação para registrar refeições, acompanhar indicadores alimentares e visualizar a evolução do usuário. Desenvolvida para a atividade avaliativa de Programação para WEB II.

## Tecnologias

- **Backend:** Node.js, Express, Prisma ORM, SQLite, JWT, bcryptjs e Zod.
- **Frontend:** React, Vite, React Router, Axios e Lucide React.
- **Testes:** Vitest.

## Funcionalidades

- Cadastro de usuário e login com senha criptografada.
- Autenticação por token JWT e rotas protegidas.
- Cadastro, listagem, visualização, edição e exclusão de refeições.
- Associação automática de cada refeição ao usuário autenticado.
- Bloqueio de leitura, edição e exclusão de refeições pertencentes a outros usuários.
- Dashboard com total de refeições, refeições dentro da dieta, refeições fora da dieta e melhor sequência dentro da dieta.
- Busca e filtro de refeições.
- Interface responsiva para desktop, tablet e celular.

## Pré-requisitos

- Node.js 20 ou superior.
- npm 10 ou superior (recomendado).

## Instalação

Na pasta raiz do projeto, instale as dependências:

```bash
npm install
```

Crie os arquivos de ambiente a partir dos exemplos:

**Windows (PowerShell):**

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

**Linux/macOS:**

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Abra `backend/.env` e substitua `JWT_SECRET` por uma chave aleatória longa (com pelo menos 24 caracteres). O banco SQLite será armazenado em `backend/prisma/dev.db`.

## Banco de dados

Na raiz do projeto, execute:

```bash
npm run db:generate
npm run db:migrate
```

`db:migrate` aplica a migration inicial e cria o banco SQLite local.

## Executar a aplicação

Com o banco configurado, inicie frontend e backend juntos:

```bash
npm run dev
```

A aplicação ficará disponível em:

- Frontend: http://localhost:5173
- API: http://localhost:3333
- Health check: http://localhost:3333/health

Também é possível iniciar cada parte separadamente:

```bash
npm run dev:backend
npm run dev:frontend
```

## Endpoints da API

Todas as rotas abaixo usam o prefixo `/api`.

| Método | Rota | Autenticação | Descrição |
|---|---|---:|---|
| POST | `/users` | Não | Criar usuário |
| POST | `/sessions` | Não | Fazer login |
| GET | `/me` | Sim | Obter usuário autenticado |
| POST | `/meals` | Sim | Criar refeição |
| GET | `/meals` | Sim | Listar refeições do usuário |
| GET | `/meals/:id` | Sim | Visualizar uma refeição |
| PUT | `/meals/:id` | Sim | Editar uma refeição |
| DELETE | `/meals/:id` | Sim | Excluir uma refeição |
| GET | `/metrics` | Sim | Obter métricas do usuário |

### Exemplo de cadastro de refeição

Envie o token no cabeçalho `Authorization: Bearer <token>` e o corpo:

```json
{
  "name": "Almoço",
  "description": "Arroz, feijão, frango grelhado e salada.",
  "dateTime": "2026-11-16T12:30:00.000Z",
  "isOnDiet": true
}
```

### Formato das métricas

```json
{
  "metrics": {
    "totalMeals": 12,
    "onDietMeals": 9,
    "offDietMeals": 3,
    "bestStreak": 5
  }
}
```

A melhor sequência é calculada pela ordem cronológica das refeições: cada refeição dentro da dieta aumenta a sequência e uma refeição fora da dieta reinicia a contagem.

## Testes

Execute os testes unitários das métricas:

```bash
npm test
```

## Build do frontend

```bash
npm run build
```

Os arquivos de produção serão gerados em `frontend/dist`.

## Estrutura de pastas

```text
daily-diet/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   └── index.html
├── .gitignore
└── package.json
```

## Segurança e observações

- As senhas são armazenadas com hash bcrypt; nunca são retornadas pela API.
- O `userId` da refeição é definido no backend pelo token autenticado, não pelo frontend.
- As consultas de refeições sempre filtram pelo usuário autenticado.
- Configure um `JWT_SECRET` forte e HTTPS em produção.
- O SQLite é adequado para desenvolvimento e demonstração acadêmica. Para implantação com múltiplas instâncias, avalie um banco de dados gerenciado.
- Não envie arquivos `.env`, tokens ou bancos locais com dados pessoais para o GitHub.
