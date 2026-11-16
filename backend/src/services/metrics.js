/**
 * Calcula as métricas de uma lista de refeições.
 * A sequência considera cada refeição em ordem cronológica. Uma refeição
 * fora da dieta interrompe a sequência atual.
 */
export function calculateMealMetrics(meals) {
  const chronologicalMeals = [...meals].sort(
    (first, second) => new Date(first.dateTime).getTime() - new Date(second.dateTime).getTime(),
  );

  let currentStreak = 0;
  let bestStreak = 0;
  let onDietMeals = 0;

  for (const meal of chronologicalMeals) {
    if (meal.isOnDiet) {
      onDietMeals += 1;
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  const totalMeals = chronologicalMeals.length;

  return {
    totalMeals,
    onDietMeals,
    offDietMeals: totalMeals - onDietMeals,
    bestStreak,
  };
}
