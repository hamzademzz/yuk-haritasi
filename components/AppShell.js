"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Building2, ChevronLeft, Home, LogOut, Plus, Truck, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useOturum } from '../lib/hooks';

const MENU = [
  { href: '/yukler', etiket: 'Yük İlanları' },
  { href: '/araclar', etiket: 'Araç İlanları' },
  { href: '/firmalar', etiket: 'Firma Rehberi' },
];

const SEKMELER = [
  { href: '/', etiket: 'Ana Sayfa', Ikon: Home },
  { href: '/yukler', etiket: 'Yükler', Ikon: Box },
  { href: '/ilan-ver', etiket: 'İlan Ver', Ikon: Plus, vurgulu: true },
  { href: '/araclar', etiket: 'Araçlar', Ikon: Truck },
  { href: '/firmalar', etiket: 'Firmalar', Ikon: Building2 },
];

export async function cikisYap() {
  await supabase.auth.signOut();
  window.location.assign('/');
}

function Logo() {
  return (
    <Link href="/" className="text-xl font-black tracking-tight text-white lg:text-2xl lg:text-navy">
      Yük<span className="text-brand">Haritası</span>
    </Link>
  );
}

function UstBar() {
  const pathname = usePathname();
  const { user, hazir } = useOturum();

  return (
    <header className="sticky top-0 z-40 bg-navy pt-[env(safe-area-inset-top)] lg:border-b lg:border-slate-200 lg:bg-white/90 lg:backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 lg:h-[4.5rem]">
        <div className="flex items-center gap-2 lg:gap-10">
          {pathname !== '/' && (
            <Link href="/" aria-label="Ana sayfaya dön" className="-ml-2 grid size-10 place-items-center rounded-full text-white active:bg-white/10 lg:hidden">
              <ChevronLeft size={24} />
            </Link>
          )}
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {MENU.map((m) => (
              <Link key={m.href} href={m.href} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${pathname === m.href ? 'bg-slate-100 text-navy' : 'text-slate-500 hover:text-navy'}`}>
                {m.etiket}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/ilan-ver" className="btn btn-brand hidden !min-h-10 !py-2 lg:inline-flex">
            <Plus size={16} /> İlan Ver
          </Link>
          {hazir && !user && (
            <>
              <Link href="/login" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white lg:bg-transparent lg:text-navy lg:hover:bg-slate-100">Giriş Yap</Link>
              <Link href="/register" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-navy ring-1 ring-slate-200 hover:bg-slate-50 lg:block">Üye Ol</Link>
            </>
          )}
          {user && (
            <>
              <Link href="/profil" aria-label="Profilim" className="grid size-10 place-items-center rounded-full bg-white/10 text-white lg:bg-slate-100 lg:text-navy">
                <User size={19} />
              </Link>
              <button onClick={cikisYap} aria-label="Çıkış yap" className="hidden size-10 place-items-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 lg:grid">
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function AltSekmeler() {
  const pathname = usePathname();

  return (
    <nav aria-label="Alt menü" className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <div className="mx-auto grid h-16 max-w-lg grid-cols-5">
        {SEKMELER.map(({ href, etiket, Ikon, vurgulu }) => {
          const aktif = pathname === href;
          return (
            <Link key={href} href={href} aria-current={aktif ? 'page' : undefined} className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold ${aktif ? 'text-brand' : 'text-slate-400'}`}>
              {vurgulu ? (
                <span className="-mt-6 grid size-12 place-items-center rounded-full bg-brand text-white shadow-lg shadow-orange-500/30 ring-4 ring-white">
                  <Ikon size={24} />
                </span>
              ) : (
                <Ikon size={21} strokeWidth={aktif ? 2.5 : 2} />
              )}
              <span>{etiket}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function AppShell({ children }) {
  const pathname = usePathname();
  const sade = pathname === '/login' || pathname === '/register';

  if (sade) return <main>{children}</main>;

  return (
    <>
      <UstBar />
      <main className="min-h-[70vh] pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-16">{children}</main>
      <AltSekmeler />
    </>
  );
}
