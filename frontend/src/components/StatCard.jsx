export default function StatCard({ label, value, hint, icon: Icon, tone = 'green' }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon tone-${tone}`}><Icon size={20} strokeWidth={2.1} /></div>
      <div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{hint}</small></div>
    </article>
  );
}
