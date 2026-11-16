import { useEffect, useState } from 'react';
import { ArrowLeft, Check, CircleCheck, CircleX, Save } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, getErrorMessage } from '../services/api.js';
import { toDateTimeLocal } from '../utils/format.js';

const emptyForm = () => ({ name: '', description: '', dateTime: toDateTimeLocal(new Date()), isOnDiet: true });

export default function MealFormPage({ editing = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(editing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) return;
    api.get(`/meals/${id}`)
      .then(({ data }) => setForm({ name: data.meal.name, description: data.meal.description, dateTime: toDateTimeLocal(data.meal.dateTime), isOnDiet: data.meal.isOnDiet }))
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, [editing, id]);

  async function handleSubmit(event) {
    event.preventDefault(); setError(''); setSubmitting(true);
    const payload = { ...form, dateTime: new Date(form.dateTime).toISOString() };
    try {
      if (editing) await api.put(`/meals/${id}`, payload);
      else await api.post('/meals', payload);
      navigate('/refeicoes', { replace: true, state: { notice: editing ? 'Refeição atualizada com sucesso.' : 'Refeição registrada com sucesso.' } });
    } catch (requestError) { setError(getErrorMessage(requestError)); }
    finally { setSubmitting(false); }
  }

  if (loading) return <div className="loading-panel"><span className="spinner" /> Carregando refeição...</div>;

  return (
    <div className="content-page form-page">
      <Link to={editing ? `/refeicoes/${id}` : '/refeicoes'} className="back-link"><ArrowLeft size={17} /> Voltar para {editing ? 'detalhes' : 'refeições'}</Link>
      <div className="page-title-row form-title-row"><div><span className="eyebrow">{editing ? 'ATUALIZE SEU REGISTRO' : 'NOVO REGISTRO'}</span><h1>{editing ? 'Editar refeição' : 'Registrar refeição'}</h1><p>{editing ? 'Ajuste as informações da sua refeição.' : 'Cada registro ajuda você a entender melhor sua rotina.'}</p></div></div>
      <form className="meal-form-card" onSubmit={handleSubmit}>
        <div className="form-card-heading"><span className="form-card-icon">{editing ? <Save size={19} /> : <CircleCheck size={19} />}</span><div><h2>Informações da refeição</h2><p>Preencha os campos abaixo para salvar seu registro.</p></div></div>
        <div className="form-divider" />
        <div className="form-grid">
          <div className="form-field form-field-full"><label htmlFor="meal-name">Nome da refeição <span>*</span></label><input id="meal-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex.: Café da manhã" minLength={2} maxLength={100} required /></div>
          <div className="form-field form-field-full"><label htmlFor="meal-description">Descrição <span>*</span></label><textarea id="meal-description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Conte um pouco sobre o que você comeu..." rows={4} maxLength={500} required /><small className="field-helper">Até 500 caracteres.</small></div>
          <div className="form-field"><label htmlFor="meal-datetime">Data e horário <span>*</span></label><input id="meal-datetime" type="datetime-local" value={form.dateTime} onChange={(event) => setForm({ ...form, dateTime: event.target.value })} required /></div>
          <div className="form-field"><label>Como essa refeição se encaixa na sua dieta? <span>*</span></label><div className="choice-grid">
            <button type="button" className={`choice-button choice-good ${form.isOnDiet ? 'selected' : ''}`} onClick={() => setForm({ ...form, isOnDiet: true })}><CircleCheck size={20} /><span><strong>Dentro da dieta</strong><small>Faz parte do planejado</small></span>{form.isOnDiet && <Check size={16} className="choice-check" />}</button>
            <button type="button" className={`choice-button choice-out ${!form.isOnDiet ? 'selected' : ''}`} onClick={() => setForm({ ...form, isOnDiet: false })}><CircleX size={20} /><span><strong>Fora da dieta</strong><small>Também faz parte da rotina</small></span>{!form.isOnDiet && <Check size={16} className="choice-check" />}</button>
          </div></div>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-actions"><Link to={editing ? `/refeicoes/${id}` : '/refeicoes'} className="button button-secondary">Cancelar</Link><button className="button button-primary" disabled={submitting}>{submitting ? 'Salvando...' : editing ? 'Salvar alterações' : 'Salvar refeição'} <Check size={17} /></button></div>
      </form>
    </div>
  );
}
