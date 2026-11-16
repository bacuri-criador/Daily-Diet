import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, Clock3, Pencil, Trash2, Utensils } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, getErrorMessage } from '../services/api.js';
import { formatDateTime } from '../utils/format.js';

export default function MealDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/meals/${id}`)
      .then(({ data }) => setMeal(data.meal))
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm(`Deseja realmente excluir a refeição "${meal.name}"?`)) return;
    try { await api.delete(`/meals/${id}`); navigate('/refeicoes', { replace: true }); }
    catch (requestError) { setError(getErrorMessage(requestError)); }
  }

  if (loading) return <div className="loading-panel"><span className="spinner" /> Carregando refeição...</div>;
  if (!meal) return <div className="content-page"><Link to="/refeicoes" className="back-link"><ArrowLeft size={17} /> Voltar para refeições</Link><div className="alert alert-error">{error || 'Refeição não encontrada.'}</div></div>;

  return (
    <div className="content-page detail-page">
      <Link to="/refeicoes" className="back-link"><ArrowLeft size={17} /> Voltar para refeições</Link>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="page-title-row"><div><span className="eyebrow">DETALHES DO REGISTRO</span><h1>{meal.name}</h1><p>Confira as informações desta refeição.</p></div><div className="detail-actions"><Link to={`/refeicoes/${id}/editar`} className="button button-secondary"><Pencil size={16} /> Editar</Link><button className="button button-danger-outline" onClick={handleDelete}><Trash2 size={16} /> Excluir</button></div></div>
      <article className="detail-card">
        <div className="detail-card-top"><div className="detail-food-icon"><Utensils size={24} /></div><span className={`status-pill status-pill-large ${meal.isOnDiet ? 'pill-good' : 'pill-out'}`}>{meal.isOnDiet ? 'Dentro da dieta' : 'Fora da dieta'}</span></div>
        <div className="detail-description"><span className="detail-label">DESCRIÇÃO</span><p>{meal.description}</p></div>
        <div className="form-divider" />
        <div className="detail-meta-grid"><div className="detail-meta-item"><span className="detail-meta-icon"><CalendarDays size={18} /></span><div><small>Data e horário</small><strong>{formatDateTime(meal.dateTime)}</strong></div></div><div className="detail-meta-item"><span className="detail-meta-icon"><Clock3 size={18} /></span><div><small>Registrada no Daily Diet</small><strong>{formatDateTime(meal.createdAt)}</strong></div></div></div>
      </article>
    </div>
  );
}
