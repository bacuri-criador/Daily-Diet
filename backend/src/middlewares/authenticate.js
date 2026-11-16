import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/http-error.js';

export function authenticate(request, response, next) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'É necessário entrar na sua conta para continuar.'));
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload.sub || typeof payload.sub !== 'string') {
      throw new Error('Token sem identificação do usuário.');
    }
    request.userId = payload.sub;
    return next();
  } catch {
    return next(new HttpError(401, 'Sessão inválida ou expirada. Entre novamente.'));
  }
}
