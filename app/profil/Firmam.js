"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Building2, Edit3, Eye, EyeOff, MapPin, Plus, Trash2 } from 'lucide-react';
import { BosDurum, Panel } from '../../components/ui';
import FirmaFormu from '../firmalar/FirmaFormu';
import { VARSAYILAN_LOGO } from '../firmalar/FirmaDetay';

export default function Firmam({ firmalar, kullanilamiyor, onKaydedildi, onGorunurluk, onSil, onGirisGerekli }) {
  const [form, setForm] = useState(null); // null | { firma? }

  if (kullanilamiyor) return <BosDurum Ikon={Building2} mesaj="Firma yönetimi şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin." />;

  return (
    <div className="space-y-3">
      {firmalar.length === 0 ? (
        <BosDurum Ikon={Building2} mesaj="Henüz bir firma eklemediniz. Firmanızı rehbere ekleyerek müşterilere ulaşın.">
          <button onClick={() => setForm({})} className="btn btn-brand"><Plus size={17} /> Firmamı Ekle</button>
        </BosDurum>
      ) : (
        <>
          {firmalar.map((firma) => (
            <article key={firma.id} className="card p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={firma.logo_url || VARSAYILAN_LOGO} alt="" className="max-h-full max-w-full object-contain" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold break-words text-navy">{firma.firma_adi}</p>
                  <p className="flex items-center gap-1 text-sm text-slate-500"><MapPin size={13} /> {firma.merkez_konum}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${firma.is_active ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{firma.is_active ? 'Yayında' : 'Gizli'}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button onClick={() => setForm({ firma })} className="btn btn-navy !min-h-11"><Edit3 size={15} /> Düzenle</button>
                <button onClick={() => onGorunurluk(firma)} className="btn btn-ghost !min-h-11">{firma.is_active ? <><EyeOff size={15} /> Gizle</> : <><Eye size={15} /> Yayınla</>}</button>
                {firma.is_active
                  ? <Link href={`/firmalar?id=${firma.id}`} className="btn btn-ghost !min-h-11"><Eye size={15} /> Görüntüle</Link>
                  : <span aria-disabled="true" className="btn btn-ghost !min-h-11 opacity-40">Görüntüle</span>}
                <button onClick={() => onSil(firma)} className="btn btn-danger !min-h-11"><Trash2 size={15} /> Sil</button>
              </div>
            </article>
          ))}
          <button onClick={() => setForm({})} className="btn btn-ghost w-full sm:w-auto"><Plus size={16} /> Başka firma ekle</button>
        </>
      )}

      {form && (
        <Panel baslik={form.firma ? 'Firmayı Düzenle' : 'Rehbere Firma Kaydet'} onKapat={() => setForm(null)}>
          <FirmaFormu firma={form.firma} onGirisGerekli={onGirisGerekli} onKaydedildi={() => { setForm(null); onKaydedildi(); }} />
        </Panel>
      )}
    </div>
  );
}
