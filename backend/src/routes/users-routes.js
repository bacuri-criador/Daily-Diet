import { Router } from 'express';
import { getCurrentUser, login, register } from '../controllers/users-controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { asyncHandler } from '../utils/async-handler.js';

const usersRoutes = Router();
usersRoutes.post('/users', asyncHandler(register));
usersRoutes.post('/sessions', asyncHandler(login));
usersRoutes.get('/me', authenticate, asyncHandler(getCurrentUser));

export { usersRoutes };
