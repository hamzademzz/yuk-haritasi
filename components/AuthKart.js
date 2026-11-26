import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthKart({ baslik, aciklama, children }) {
  return (
    <div className="hero-desen flex min-h-dvh flex-col bg-navy sm:items-center sm:justify-center sm:p-6">
      <div className="px-6 pt-[calc(1rem+env(safe-area-inset-top))] pb-8 text-white sm:w-full sm:max-w-md sm:px-0 sm:pt-0">
        <Link href="/" className="-ml-1 inline-flex items-center gap-1 py-2 text-sm font-semibold text-slate-300 hover:text-white">
          <ArrowLeft size={16} /> Ana Sayfa
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold">{baslik}</h1>
        <p className="mt-1 text-sm text-slate-300">{aciklama}</p>
      </div>
      <div className="flex-1 rounded-t-3xl bg-white px-6 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:w-full sm:max-w-md sm:flex-none sm:rounded-3xl sm:p-8">
        {children}
      </div>
    </div>
  );
}
