import { ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({ title = 'Sua lista está vazia', description = 'Registre sua primeira refeição para começar a acompanhar sua rotina.', action = true }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><ClipboardList size={25} /></div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && <Link to="/refeicoes/nova" className="button button-primary">Adicionar refeição</Link>}
    </div>
  );
}
