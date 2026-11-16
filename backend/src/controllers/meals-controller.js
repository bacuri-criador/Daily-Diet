import { z } from 'zod';
import { prisma } from '../utils/prisma.js';
import { HttpError } from '../utils/http-error.js';
import { calculateMealMetrics } from '../services/metrics.js';

const mealSchema = z.object({
  name: z.string().trim().min(2, 'O nome deve ter pelo menos 2 caracteres.').max(100),
  description: z.string().trim().min(2, 'Informe uma descrição.').max(500),
  dateTime: z.string().datetime({ offset: true }).transform((value) => new Date(value)),
  isOnDiet: z.boolean(),
}).strict();

async function findOwnedMeal(mealId, userId) {
  const meal = await prisma.meal.findFirst({ where: { id: mealId, userId } });
  if (!meal) throw new HttpError(404, 'Refeição não encontrada.');
  return meal;
}

export async function createMeal(request, response) {
  const data = mealSchema.parse(request.body);
  const meal = await prisma.meal.create({
    data: { ...data, userId: request.userId },
  });
  return response.status(201).json({ meal });
}

export async function listMeals(request, response) {
  const meals = await prisma.meal.findMany({
    where: { userId: request.userId },
    orderBy: [{ dateTime: 'desc' }, { createdAt: 'desc' }],
  });
  return response.json({ meals });
}

export async function getMeal(request, response) {
  const meal = await findOwnedMeal(request.params.id, request.userId);
  return response.json({ meal });
}

export async function updateMeal(request, response) {
  const data = mealSchema.parse(request.body);
  await findOwnedMeal(request.params.id, request.userId);

  const meal = await prisma.meal.update({
    where: { id: request.params.id },
    data,
  });
  return response.json({ meal });
}

export async function deleteMeal(request, response) {
  await findOwnedMeal(request.params.id, request.userId);
  await prisma.meal.delete({ where: { id: request.params.id } });
  return response.status(204).send();
}

export async function getMetrics(request, response) {
  const meals = await prisma.meal.findMany({
    where: { userId: request.userId },
    select: { dateTime: true, isOnDiet: true },
  });
  return response.json({ metrics: calculateMealMetrics(meals) });
}
