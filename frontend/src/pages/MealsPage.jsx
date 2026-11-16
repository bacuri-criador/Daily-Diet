import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, SlidersHorizontal, Utensils } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import MealCard from '../components/MealCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { api, getErrorMessage } from '../services/api.js';

export default function MealsPage() {
  const location = useLocation();
  const notice = location.state?.notice;
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  async function loadMeals() {
    setError('');
    try { const { data } = await api.get('/meals'); setMeals(data.meals); }
    catch (requestError) { setError(getErrorMessage(requestError)); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadMeals(); }, []);

  async function handleDelete(meal) {
    if (!window.confirm(`Deseja realmente excluir a refeição "${meal.name}"?`)) return;
    try { await api.delete(`/meals/${meal.id}`); setMeals((current) => current.filter((item) => item.id !== meal.id)); }
    catch (requestError) { setError(getErrorMessage(requestError)); }
  }

  const filteredMeals = useMemo(() => meals.filter((meal) => {
    const matchesSearch = `${meal.name} ${meal.description}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'on' ? meal.isOnDiet : !meal.isOnDiet);
    return matchesSearch && matchesFilter;
  }), [meals, search, filter]);

  return (
    <div className="content-page">
      <section className="page-title-row"><div><span className="eyebrow">SEU HISTÓRICO</span><h1>Minhas refeições</h1><p>Visualize e organize tudo o que você registrou.</p></div><Link to="/refeicoes/nova" className="button button-primary"><Plus size={18} /> Nova refeição</Link></section>
      {notice && <div className="alert alert-success">{notice}</div>}
      {error && <div className="alert alert-error">{error} <button onClick={loadMeals}>Tentar novamente</button></div>}
      <section className="list-toolbar">
        <div className="search-field"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome ou descrição..." /></div>
        <div className="filter-control"><SlidersHorizontal size={17} /><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filtrar refeições"><option value="all">Todas as refeições</option><option value="on">Dentro da dieta</option><option value="off">Fora da dieta</option></select></div>
      </section>
      <div className="list-summary"><span><Utensils size={15} /> {filteredMeals.length} {filteredMeals.length === 1 ? 'refeição encontrada' : 'refeições encontradas'}</span></div>
      {loading ? <div className="loading-panel"><span className="spinner" /> Carregando refeições...</div> : filteredMeals.length ? <div className="meal-list">{filteredMeals.map((meal) => <MealCard key={meal.id} meal={meal} onDelete={handleDelete} />)}</div> : <EmptyState title={meals.length ? 'Nenhum resultado encontrado' : 'Você ainda não registrou refeições'} description={meals.length ? 'Tente mudar a busca ou o filtro selecionado.' : 'Comece adicionando sua primeira refeição ao Daily Diet.'} action={!meals.length} />}
    </div>
  );
}
