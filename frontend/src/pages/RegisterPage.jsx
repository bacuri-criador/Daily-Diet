import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Brand from '../components/Brand.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getErrorMessage } from '../services/api.js';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault(); setError('');
    if (form.password !== form.confirmPassword) { setError('As senhas não coincidem.'); return; }
    if (form.password.length < 8) { setError('A senha deve ter pelo menos 8 caracteres.'); return; }
    setSubmitting(true);
    try { await register({ name: form.name, email: form.email, password: form.password }); navigate('/dashboard'); }
    catch (requestError) { setError(getErrorMessage(requestError)); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-top"><Brand /></div>
        <div className="auth-visual-content">
          <span className="eyebrow eyebrow-light">SEU COMEÇO É AQUI</span>
          <h1>Hábitos melhores.<br /><em>Sem cobranças.</em></h1>
          <p>Registre o que você come, acompanhe seus padrões e celebre cada escolha consciente. Do seu jeito, no seu tempo.</p>
          <div className="visual-note"><span className="visual-note-dot" /><span>Uma rotina possível é uma rotina sustentável.</span></div>
        </div>
        <div className="auth-visual-footer">ALIMENTAÇÃO COM MAIS CONSCIÊNCIA</div>
        <div className="visual-orb orb-one" /><div className="visual-orb orb-two" />
      </section>
      <section className="auth-form-area">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand"><Brand /></div>
          <span className="eyebrow">VAMOS COMEÇAR</span>
          <h2>Crie sua conta</h2>
          <p className="auth-subtitle">Leva só alguns instantes. Sua jornada começa com um passo.</p>
          <form onSubmit={handleSubmit} className="form-stack">
            <label className="field-label" htmlFor="name">Nome completo</label>
            <div className="input-wrap"><UserRound size={18} /><input id="name" placeholder="Como podemos te chamar?" autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} minLength={2} maxLength={80} required /></div>
            <label className="field-label" htmlFor="email">E-mail</label>
            <div className="input-wrap"><Mail size={18} /><input id="email" type="email" placeholder="voce@email.com" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></div>
            <label className="field-label" htmlFor="password">Senha</label>
            <div className="input-wrap"><LockKeyhole size={18} /><input id="password" type={showPassword ? 'text' : 'password'} placeholder="Mínimo de 8 caracteres" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength={8} required /><button type="button" className="input-icon-button" aria-label="Mostrar ou ocultar senha" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            <label className="field-label" htmlFor="confirmPassword">Confirmar senha</label>
            <div className="input-wrap"><LockKeyhole size={18} /><input id="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Digite sua senha novamente" autoComplete="new-password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} required /></div>
            {error && <div className="alert alert-error">{error}</div>}
            <button className="button button-primary button-full" disabled={submitting}>{submitting ? 'Criando conta...' : 'Criar minha conta'} <ArrowRight size={17} /></button>
          </form>
          <p className="auth-switch">Já tem uma conta? <Link to="/login">Entrar</Link></p>
          <p className="auth-legal">Seus dados são protegidos e suas refeições permanecem privadas.</p>
        </div>
      </section>
    </div>
  );
}
