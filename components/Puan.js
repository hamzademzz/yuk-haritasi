import { Star } from 'lucide-react';

// Yorumu olmayan firmaya puan gösterilmez
export default function Puan({ firma, className = '' }) {
  if (!firma.puan || !Number(firma.yorum_sayisi)) return null;
  return (
    <span className={`flex items-center gap-1 font-bold ${className}`}>
      <Star size={13} fill="currentColor" aria-hidden="true" /> {firma.puan} ({firma.yorum_sayisi})
    </span>
  );
}
