import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Brand from '../components/Brand.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getErrorMessage } from '../services/api.js';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault(); setError(''); setSubmitting(true);
    try { await login(form); navigate('/dashboard'); }
    catch (requestError) { setError(getErrorMessage(requestError)); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-top"><Brand /></div>
        <div className="auth-visual-content">
          <span className="eyebrow eyebrow-light">UM DIA DE CADA VEZ</span>
          <h1>Cuide da sua alimentação.<br /><em>Respeite seu ritmo.</em></h1>
          <p>Um espaço simples para acompanhar suas refeições, reconhecer suas conquistas e construir hábitos que fazem sentido para você.</p>
          <div className="visual-note"><span className="visual-note-dot" /><span>O progresso acontece na constância.</span></div>
        </div>
        <div className="auth-visual-footer">ALIMENTAÇÃO COM MAIS CONSCIÊNCIA</div>
        <div className="visual-orb orb-one" /><div className="visual-orb orb-two" />
      </section>
      <section className="auth-form-area">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand"><Brand /></div>
          <span className="eyebrow">BEM-VINDO DE VOLTA</span>
          <h2>Entre na sua conta</h2>
          <p className="auth-subtitle">Acesse seu espaço e continue acompanhando sua evolução.</p>
          <form onSubmit={handleSubmit} className="form-stack">
            <label className="field-label">E-mail</label>
            <div className="input-wrap"><Mail size={18} /><input type="email" placeholder="voce@email.com" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></div>
            <div className="field-label-row"><label className="field-label" htmlFor="password">Senha</label></div>
            <div className="input-wrap"><LockKeyhole size={18} /><input id="password" type={showPassword ? 'text' : 'password'} placeholder="Sua senha" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /><button type="button" className="input-icon-button" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            {error && <div className="alert alert-error">{error}</div>}
            <button className="button button-primary button-full" disabled={submitting}>{submitting ? 'Entrando...' : 'Entrar'} <ArrowRight size={17} /></button>
          </form>
          <p className="auth-switch">Ainda não tem uma conta? <Link to="/cadastro">Criar cadastro</Link></p>
          <p className="auth-legal">Ao continuar, seus dados serão utilizados apenas para gerenciar sua experiência no Daily Diet.</p>
        </div>
      </section>
    </div>
  );
}
