import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { HttpError } from '../utils/http-error.js';

export function notFoundHandler(request, response) {
  response.status(404).json({ message: 'Endpoint não encontrado.' });
}

export function errorHandler(error, request, response, next) {
  if (response.headersSent) return next(error);

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: 'Verifique os dados informados.',
      errors: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (error instanceof HttpError) {
    return response.status(error.statusCode).json({
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return response.status(409).json({ message: 'Já existe um cadastro com esses dados.' });
  }

  console.error(error);
  return response.status(500).json({
    message: 'Ocorreu um erro inesperado. Tente novamente.',
  });
}
