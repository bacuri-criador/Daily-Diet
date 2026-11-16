import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, ChevronDown, CirclePlus, LayoutDashboard, LogOut, Menu, Utensils, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import Brand from './Brand.jsx';
import { getInitials } from '../utils/format.js';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTitle = location.pathname.startsWith('/refeicoes/nova')
    ? 'Nova refeição'
    : location.pathname.includes('/editar') ? 'Editar refeição'
      : location.pathname.startsWith('/refeicoes/') ? 'Detalhes da refeição'
        : location.pathname.startsWith('/refeicoes') ? 'Minhas refeições' : 'Visão geral';

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const navItems = [
    { to: '/dashboard', label: 'Visão geral', icon: LayoutDashboard },
    { to: '/refeicoes', label: 'Minhas refeições', icon: Utensils },
  ];

  return (
    <div className="app-shell">
      {mobileOpen && <button className="mobile-overlay" aria-label="Fechar menu" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <Brand />
          <button className="icon-button sidebar-close" aria-label="Fechar menu" onClick={() => setMobileOpen(false)}><X size={19} /></button>
        </div>
        <div className="nav-caption">MENU PRINCIPAL</div>
        <nav className="main-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={19} strokeWidth={2} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon"><BarChart3 size={17} /></span>
            <strong>Pequenos passos.</strong>
            <p>Consistência é melhor que perfeição. Continue no seu ritmo.</p>
          </div>
          <button className="profile-button" onClick={handleLogout} title="Sair da conta">
            <span className="avatar">{getInitials(user?.name)}</span>
            <span className="profile-copy"><strong>{user?.name}</strong><small>Minha conta</small></span>
            <LogOut size={17} className="logout-icon" />
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu-button" aria-label="Abrir menu" onClick={() => setMobileOpen(true)}><Menu size={21} /></button>
            <div className="breadcrumb"><span>Daily Diet</span><span className="breadcrumb-slash">/</span><strong>{pageTitle}</strong></div>
          </div>
          <div className="topbar-user"><span className="topbar-greeting">Olá, {user?.name?.split(' ')[0]}</span><span className="avatar avatar-small">{getInitials(user?.name)}</span><ChevronDown size={15} /></div>
        </header>
        <div className="page-content"><Outlet /></div>
        <footer className="app-footer">Daily Diet <span>·</span> Sua rotina em equilíbrio</footer>
      </main>
    </div>
  );
}
