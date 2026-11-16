import { Router } from 'express';
import {
  createMeal,
  deleteMeal,
  getMeal,
  getMetrics,
  listMeals,
  updateMeal,
} from '../controllers/meals-controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { asyncHandler } from '../utils/async-handler.js';

const mealsRoutes = Router();
mealsRoutes.use(authenticate);
mealsRoutes.get('/metrics', asyncHandler(getMetrics));
mealsRoutes.post('/meals', asyncHandler(createMeal));
mealsRoutes.get('/meals', asyncHandler(listMeals));
mealsRoutes.get('/meals/:id', asyncHandler(getMeal));
mealsRoutes.put('/meals/:id', asyncHandler(updateMeal));
mealsRoutes.delete('/meals/:id', asyncHandler(deleteMeal));

export { mealsRoutes };
