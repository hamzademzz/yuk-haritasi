"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Box, CheckCircle2, Edit3, Plus, RotateCcw, Trash2, Truck } from 'lucide-react';
import { tarihYaz } from '../../lib/constants';
import { suresiDoldu } from '../../lib/eslesme';
import { BosDurum } from '../../components/ui';

const DURUM_STILI = {
  Yayında: 'bg-green-50 text-green-700',
  'Süresi doldu': 'bg-amber-50 text-amber-800',
  Kapalı: 'bg-slate-100 text-slate-500',
};

export const ilanDurumu = (tip, ilan) =>
  !ilan.is_active ? 'Kapalı' : tip === 'yuk' && suresiDoldu(ilan) ? 'Süresi doldu' : 'Yayında';

function IlanSatiri({ kayit, onDuzenle, onTamamla, onYeniden, onSil }) {
  const { tip, ilan, durum } = kayit;
  const yuk = tip === 'yuk';
  const Ikon = yuk ? Box : Truck;

  return (
    <article className="card p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy/[0.06] text-navy"><Ikon size={19} /></span>
        <div className="min-w-0 flex-1">
          <p className="font-bold break-words text-navy">{yuk ? `${ilan.nereden} → ${ilan.nereye}` : `${ilan.arac_tipi} · ${ilan.mevcut_konum_sehir}`}</p>
          <p className="mt-0.5 text-sm break-words text-slate-500">
            {yuk
              ? [ilan.yuk_turu, ilan.agirlik_ton != null && `${ilan.agirlik_ton} ton`, tarihYaz(ilan.yukleme_tarihi)].filter(Boolean).join(' · ')
              : ilan.aciklama || 'Açıklama yok'}
          </p>
          <span className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-bold ${DURUM_STILI[durum]}`}>{durum}</span>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        {durum === 'Yayında'
          ? <button onClick={() => onTamamla(kayit)} className="btn btn-ghost !min-h-11 flex-1 !px-3"><CheckCircle2 size={16} /> {yuk ? 'Tamamlandı' : 'Yayından Kaldır'}</button>
          : <button onClick={() => onYeniden(kayit)} className="btn btn-navy !min-h-11 flex-1 !px-3"><RotateCcw size={15} /> Yeniden Yayınla</button>}
        <button onClick={() => onDuzenle(kayit)} aria-label="Düzenle" className="btn btn-ghost !min-h-11 !px-3.5"><Edit3 size={16} /></button>
        <button onClick={() => onSil(kayit)} aria-label="Sil" className="btn btn-danger !min-h-11 !px-3.5"><Trash2 size={16} /></button>
      </div>
    </article>
  );
}

export default function Ilanlarim({ yukler, araclar, ...islemler }) {
  const [gorunum, setGorunum] = useState('aktif');
  const kayitlar = [
    ...yukler.map((ilan) => ({ tip: 'yuk', ilan, durum: ilanDurumu('yuk', ilan) })),
    ...araclar.map((ilan) => ({ tip: 'arac', ilan, durum: ilanDurumu('arac', ilan) })),
  ];
  const aktif = kayitlar.filter((k) => k.durum === 'Yayında');
  const gecmis = kayitlar.filter((k) => k.durum !== 'Yayında');
  const liste = gorunum === 'aktif' ? aktif : gecmis;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {[['aktif', `Yayında (${aktif.length})`], ['gecmis', `Geçmiş (${gecmis.length})`]].map(([id, etiket]) => (
            <button key={id} aria-pressed={gorunum === id} onClick={() => setGorunum(id)} className={`min-h-10 cursor-pointer rounded-full px-4 text-sm font-bold ${gorunum === id ? 'bg-navy text-white' : 'border border-slate-300 bg-white text-slate-600'}`}>{etiket}</button>
          ))}
        </div>
        <Link href="/ilan-ver" className="btn btn-brand"><Plus size={17} /> Yeni İlan</Link>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {liste.length
          ? liste.map((k) => <IlanSatiri key={`${k.tip}-${k.ilan.id}`} kayit={k} {...islemler} />)
          : <BosDurum Ikon={Box} mesaj={gorunum === 'aktif' ? 'Yayında ilanınız yok.' : 'Geçmiş ilanınız yok.'} />}
      </div>
    </div>
  );
}
