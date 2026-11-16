import { Leaf } from 'lucide-react';

export default function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand-compact' : ''}`}>
      <span className="brand-mark"><Leaf size={21} strokeWidth={2.6} /></span>
      <span className="brand-word">daily<span>diet</span></span>
    </div>
  );
}
