import { describe, expect, it } from 'vitest';
import { calculateMealMetrics } from '../src/services/metrics.js';

const meal = (dateTime, isOnDiet) => ({ dateTime: new Date(dateTime), isOnDiet });

describe('calculateMealMetrics', () => {
  it('calcula totais e melhor sequência em ordem cronológica', () => {
    const meals = [
      meal('2026-01-04T12:00:00.000Z', true),
      meal('2026-01-01T08:00:00.000Z', true),
      meal('2026-01-02T12:00:00.000Z', false),
      meal('2026-01-03T12:00:00.000Z', true),
      meal('2026-01-05T12:00:00.000Z', true),
    ];

    expect(calculateMealMetrics(meals)).toEqual({
      totalMeals: 5,
      onDietMeals: 4,
      offDietMeals: 1,
      bestStreak: 3,
    });
  });

  it('retorna métricas zeradas quando não existem refeições', () => {
    expect(calculateMealMetrics([])).toEqual({
      totalMeals: 0,
      onDietMeals: 0,
      offDietMeals: 0,
      bestStreak: 0,
    });
  });

  it('considera sequência contínua até a primeira refeição fora da dieta', () => {
    const meals = [
      meal('2026-03-01T08:00:00.000Z', true),
      meal('2026-03-01T12:00:00.000Z', true),
      meal('2026-03-01T19:00:00.000Z', true),
      meal('2026-03-02T08:00:00.000Z', false),
      meal('2026-03-02T12:00:00.000Z', true),
    ];

    expect(calculateMealMetrics(meals).bestStreak).toBe(3);
  });
});
