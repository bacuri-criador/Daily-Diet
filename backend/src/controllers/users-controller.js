import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';
import { HttpError } from '../utils/http-error.js';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome com pelo menos 2 caracteres.').max(80),
  email: z.string().trim().email('Informe um e-mail válido.').transform((value) => value.toLowerCase()),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.').max(72),
}).strict();

const loginSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido.').transform((value) => value.toLowerCase()),
  password: z.string().min(1, 'Informe sua senha.'),
}).strict();

function createToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: userId,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function register(request, response) {
  const data = registerSchema.parse(request.body);
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });

  if (existingUser) throw new HttpError(409, 'Este e-mail já está cadastrado.');

  const password = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, password },
  });

  return response.status(201).json({
    user: publicUser(user),
    token: createToken(user.id),
  });
}

export async function login(request, response) {
  const data = loginSchema.parse(request.body);
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new HttpError(401, 'E-mail ou senha incorretos.');
  }

  return response.json({ user: publicUser(user), token: createToken(user.id) });
}

export async function getCurrentUser(request, response) {
  const user = await prisma.user.findUnique({ where: { id: request.userId } });
  if (!user) throw new HttpError(404, 'Usuário não encontrado.');
  return response.json({ user: publicUser(user) });
}
