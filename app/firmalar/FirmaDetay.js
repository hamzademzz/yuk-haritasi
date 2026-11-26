"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Lock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useOturum } from '../../lib/hooks';
import { HIZMETLER, whatsappLinki } from '../../lib/constants';
import Puan from '../../components/Puan';
import { HizmetIkonu } from '../../components/ui';

export const VARSAYILAN_LOGO = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300';

function Kutu({ baslik, children }) {
  return (
    <section className="card p-4 lg:p-6">
      <h2 className="mb-3 font-extrabold text-navy">{baslik}</h2>
      {children}
    </section>
  );
}

function Satir({ Ikon, children, ...baglanti }) {
  const Etiket = baglanti.href ? 'a' : 'div';
  return (
    <Etiket {...baglanti} className="flex min-h-11 items-center gap-3 text-sm font-semibold text-slate-700">
      <Ikon size={18} className="shrink-0 text-navy" />
      <span className="min-w-0 break-words">{children}</span>
    </Etiket>
  );
}

export default function FirmaDetay({ firma, onGeri }) {
  const { user, hazir } = useOturum();
  const [uzun, setUzun] = useState(false);
  const [tumSehirler, setTumSehirler] = useState(false);

  const bolgeler = (firma.hizmet_bolgeleri || '').split(',').map((s) => s.trim()).filter(Boolean);
  const hakkimizda = firma.hakkimizda || 'Firma hakkında detaylı bilgi girilmemiştir.';
  const kisaltilabilir = hakkimizda.length > 160;
  const verilenHizmetler = HIZMETLER.filter((h) => firma[h.anahtar]);

  return (
    <>
      <section className="hero-desen bg-navy px-4 pt-2 pb-6 text-white lg:py-10">
        <div className="mx-auto max-w-4xl">
          <button onClick={onGeri} className="mb-4 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold hover:bg-white/20">
            <ArrowLeft size={16} /> Rehbere Dön
          </button>
          <div className="flex items-center gap-4">
            <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={firma.logo_url || VARSAYILAN_LOGO} alt="" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-extrabold break-words lg:text-3xl">{firma.firma_adi}</h1>
              <Puan firma={firma} className="mt-1 text-sm text-amber-300" />
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-600 px-2.5 py-1 text-xs font-bold"><CheckCircle2 size={12} /> Doğrulanmış Üye</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-4xl gap-3 px-4 pt-4 md:grid-cols-2 lg:gap-4 lg:pt-6">
        <Kutu baslik="İletişim">
          {!hazir ? <div className="h-24 animate-pulse rounded-xl bg-slate-100" /> : user ? (
            <>
              <div className="mb-3 grid grid-cols-2 gap-2">
                {firma.telefon && <a href={`tel:${firma.telefon}`} className="btn btn-navy"><Phone size={17} /> Ara</a>}
                {firma.whatsapp && <a href={whatsappLinki(firma.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn btn-call"><MessageCircle size={17} /> WhatsApp</a>}
              </div>
              <Satir Ikon={Phone} href={firma.telefon ? `tel:${firma.telefon}` : undefined}>{firma.telefon || 'Belirtilmedi'}</Satir>
              {firma.eposta && <Satir Ikon={Mail} href={`mailto:${firma.eposta}`}>{firma.eposta}</Satir>}
              <Satir Ikon={MapPin}>{firma.merkez_konum || 'Belirtilmedi'}</Satir>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
              <Lock size={22} className="mx-auto mb-2 text-slate-400" />
              <p className="mb-3 text-sm text-slate-600">Telefon ve e-posta bilgilerini görmek için giriş yapın.</p>
              <Link href="/login" className="btn btn-navy w-full">Giriş Yap</Link>
            </div>
          )}
        </Kutu>

        <Kutu baslik="Hakkımızda">
          <p className="text-sm leading-relaxed break-words text-slate-600">{kisaltilabilir && !uzun ? `${hakkimizda.slice(0, 160)}…` : hakkimizda}</p>
          {kisaltilabilir && <button onClick={() => setUzun(!uzun)} className="mt-2 cursor-pointer py-1 text-sm font-bold text-brand">{uzun ? 'Kapat' : 'Devamını Gör'}</button>}
        </Kutu>

        <Kutu baslik="Hizmetler">
          {verilenHizmetler.length ? (
            <ul className="grid grid-cols-2 gap-2">
              {verilenHizmetler.map((h) => (
                <li key={h.anahtar} className="flex items-center gap-2.5 rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-navy"><HizmetIkonu Ikon={h.Ikon} className="size-9" boyut={18} />{h.ad}</li>
              ))}
            </ul>
          ) : <p className="text-sm text-slate-500">Hizmet bilgisi girilmemiştir.</p>}
        </Kutu>

        <Kutu baslik="Hizmet Bölgeleri">
          {bolgeler.length ? (
            <div className="flex flex-wrap gap-1.5">
              {(tumSehirler ? bolgeler : bolgeler.slice(0, 8)).map((s) => <span key={s} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{s}</span>)}
              {bolgeler.length > 8 && <button onClick={() => setTumSehirler(!tumSehirler)} className="cursor-pointer px-2 py-1.5 text-xs font-bold text-brand">{tumSehirler ? 'Daha az göster' : `+${bolgeler.length - 8} şehir`}</button>}
            </div>
          ) : <p className="text-sm text-slate-500">Tüm Türkiye</p>}
        </Kutu>

        <p className="px-1 text-xs text-slate-400 md:col-span-2">Üyelik kodu: {firma.uye_no || '—'}</p>
      </div>
    </>
  );
}
