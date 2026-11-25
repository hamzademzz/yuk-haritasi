import { Phone, User } from 'lucide-react';

export function Bilgi({ etiket, children }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-slate-400">{etiket}</dt>
      <dd className="text-sm font-bold break-words">{children}</dd>
    </div>
  );
}

export function IletisimSatiri({ ad, altYazi, telefon }) {
  return (
    <div className="mt-auto flex items-center gap-3 border-t border-slate-100 p-3 pl-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-100 text-navy"><User size={18} /></span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{ad}</p>
        <p className="truncate text-xs text-slate-400">{altYazi}</p>
      </div>
      {telefon && (
        <a href={`tel:${telefon}`} className="btn btn-call shrink-0 !px-4"><Phone size={17} /> Ara</a>
      )}
    </div>
  );
}
