import { ArrowUpRight, Clock3, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDateTime } from '../utils/format.js';

export default function MealCard({ meal, onDelete, compact = false }) {
  return (
    <article className={`meal-card ${compact ? 'meal-card-compact' : ''}`}>
      <div className={`meal-status-dot ${meal.isOnDiet ? 'status-good' : 'status-out'}`} />
      <div className="meal-card-main">
        <div className="meal-card-heading"><Link to={`/refeicoes/${meal.id}`} className="meal-name">{meal.name}</Link><span className={`status-pill ${meal.isOnDiet ? 'pill-good' : 'pill-out'}`}>{meal.isOnDiet ? 'Dentro da dieta' : 'Fora da dieta'}</span></div>
        <p className="meal-description">{meal.description}</p>
        <div className="meal-meta"><Clock3 size={14} /><span>{formatDateTime(meal.dateTime)}</span></div>
      </div>
      <div className="meal-actions">
        <Link className="mini-action" to={`/refeicoes/${meal.id}`} title="Ver detalhes"><ArrowUpRight size={17} /></Link>
        <Link className="mini-action" to={`/refeicoes/${meal.id}/editar`} title="Editar"><Pencil size={16} /></Link>
        {onDelete && <button className="mini-action danger-action" title="Excluir" onClick={() => onDelete(meal)}><Trash2 size={16} /></button>}
      </div>
    </article>
  );
}
