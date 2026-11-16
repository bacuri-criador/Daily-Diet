import { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, Flame, Plus, Salad, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard.jsx';
import MealCard from '../components/MealCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { api, getErrorMessage } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function DashboardPage() {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [metrics, setMetrics] = useState({ totalMeals: 0, onDietMeals: 0, offDietMeals: 0, bestStreak: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadDashboard() {
    setError('');
    try {
      const [mealsResponse, metricsResponse] = await Promise.all([api.get('/meals'), api.get('/metrics')]);
      setMeals(mealsResponse.data.meals);
      setMetrics(metricsResponse.data.metrics);
    } catch (requestError) { setError(getErrorMessage(requestError)); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadDashboard(); }, []);

  const percentage = metrics.totalMeals ? Math.round((metrics.onDietMeals / metrics.totalMeals) * 100) : 0;
  const today = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(new Date());
  const firstName = user?.name?.trim().split(/\s+/)[0] || 'Olá';

  return (
    <div className="dashboard-page">
      <section className="welcome-row">
        <div><span className="eyebrow">{today.toUpperCase()}</span><h1>Olá, {firstName}<span className="wave">.</span></h1><p>Vamos acompanhar como está sua rotina alimentar?</p></div>
        <Link to="/refeicoes/nova" className="button button-primary"><Plus size={18} /> Registrar refeição</Link>
      </section>

      {error && <div className="alert alert-error">{error} <button onClick={loadDashboard}>Tentar novamente</button></div>}

      <section className="section-block">
        <div className="section-heading"><div><h2>Seu resumo</h2><p>Um panorama das suas escolhas até aqui.</p></div><span className="period-label"><CalendarDays size={14} /> Todo o período</span></div>
        <div className="stats-grid">
          <StatCard label="Refeições registradas" value={metrics.totalMeals} hint="Total de registros" icon={Salad} tone="green" />
          <StatCard label="Dentro da dieta" value={metrics.onDietMeals} hint="Escolhas dentro do planejado" icon={CheckCircle2} tone="mint" />
          <StatCard label="Fora da dieta" value={metrics.offDietMeals} hint="Sem culpa, siga em frente" icon={Target} tone="peach" />
          <StatCard label="Melhor sequência" value={metrics.bestStreak} hint="Refeições seguidas dentro da dieta" icon={Flame} tone="yellow" />
        </div>
      </section>

      <section className="progress-section">
        <div className="progress-copy"><div className="progress-icon"><TrendingUp size={19} /></div><div><strong>Seu ritmo, suas conquistas</strong><p>{metrics.totalMeals ? `${percentage}% das suas refeições registradas estão dentro da dieta.` : 'Seus indicadores aparecem aqui conforme você registra refeições.'}</p></div></div>
        <div className="progress-visual"><div className="progress-track"><span style={{ width: `${percentage}%` }} /></div><strong>{percentage}%</strong></div>
      </section>

      <section className="section-block recent-section">
        <div className="section-heading"><div><h2>Refeições recentes</h2><p>Seus últimos registros em um só lugar.</p></div><Link to="/refeicoes" className="text-link">Ver todas <ArrowRight size={16} /></Link></div>
        {loading ? <div className="loading-panel"><span className="spinner" /> Carregando refeições...</div> : meals.length ? <div className="meal-list">{meals.slice(0, 4).map((meal) => <MealCard key={meal.id} meal={meal} compact />)}</div> : <EmptyState />}
      </section>

      <div className="encouragement"><span><Sparkles size={17} /></span><p><strong>Lembrete:</strong> uma refeição não define sua jornada. O que importa é o conjunto das suas escolhas.</p></div>
    </div>
  );
}
