"use client";
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Lock, X } from 'lucide-react';
import { Kelimeler } from './Hareket';

// Telefonda alttan açılan panel, geniş ekranda ortalanmış pencere.
// <dialog> odak yönetimini ve Esc ile kapatmayı kendisi sağlar.
export function Panel({ baslik, onKapat, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={baslik}
      data-lenis-prevent
      onCancel={(e) => { e.preventDefault(); onKapat(); }}
      className="panel"
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
        <h2 className="text-lg font-extrabold text-navy">{baslik}</h2>
        <button type="button" onClick={onKapat} aria-label="Kapat" className="-mr-2 grid size-10 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-slate-100">
          <X size={20} />
        </button>
      </div>
      <div className="overflow-y-auto overscroll-contain px-5 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">{children}</div>
    </dialog>
  );
}

export function GirisPaneli({ aciklama, onKapat }) {
  return (
    <Panel baslik="Giriş yapmanız gerekli" onKapat={onKapat}>
      <div className="text-center">
        <span className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-orange-50 text-brand"><Lock size={24} /></span>
        <p className="mb-6 text-sm text-slate-500">{aciklama}</p>
        <div className="grid gap-2">
          <Link href="/login" className="btn btn-navy">Giriş Yap</Link>
          <Link href="/register" className="btn btn-ghost">Ücretsiz Üye Ol</Link>
        </div>
      </div>
    </Panel>
  );
}

export function HizmetIkonu({ Ikon, className = 'size-10', boyut = 20 }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-xl bg-navy/[0.06] text-navy ${className}`}>
      <Ikon size={boyut} strokeWidth={1.75} aria-hidden="true" />
    </span>
  );
}

export function Alan({ etiket, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{etiket}</span>
      {children}
    </label>
  );
}

export function SayfaBasligi({ baslik, aciklama, children }) {
  return (
    <section className="hero-desen bg-navy px-4 pt-2 pb-14 text-white lg:pt-12 lg:pb-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl"><Kelimeler satirlar={[baslik]} /></h1>
          <p className="mt-1 text-sm text-slate-300">{aciklama}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

export function Iskelet({ adet = 4, className = 'h-44' }) {
  return Array.from({ length: adet }, (_, i) => <div key={i} className={`card animate-pulse bg-slate-100 ${className}`} />);
}

export function BosDurum({ Ikon, mesaj, children }) {
  return (
    <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      {Ikon && <Ikon size={30} className="mx-auto mb-3 text-slate-300" />}
      <p className="text-sm font-medium text-slate-500">{mesaj}</p>
      {children && <div className="mt-4 flex justify-center">{children}</div>}
    </div>
  );
}

export function HataDurumu({ onTekrar }) {
  return (
    <BosDurum mesaj="Veriler yüklenemedi. İnternet bağlantınızı kontrol edip tekrar deneyin.">
      <button onClick={onTekrar} className="btn btn-navy">Tekrar Dene</button>
    </BosDurum>
  );
}
