import Link from 'next/link';
import { Building2, ChevronRight, Package, Truck } from 'lucide-react';
import { SayfaBasligi } from '../../components/ui';

const TURLER = [
  { href: '/yukler?ekle=true', Ikon: Package, baslik: 'Yük İlanı', aciklama: 'Taşınacak yükünüz için araç bulun' },
  { href: '/araclar?ekle=true', Ikon: Truck, baslik: 'Araç İlanı', aciklama: 'Boş aracınız için yük bulun' },
  { href: '/firmalar?ekle=true', Ikon: Building2, baslik: 'Firma Kaydı', aciklama: 'Lojistik şirketinizi tanıtın' },
];

export default function IlanVerPage() {
  return (
    <>
      <SayfaBasligi baslik="İlan Ver" aciklama="Yayınlamak istediğiniz ilan türünü seçin." />
      <div className="sirali mx-auto -mt-8 grid max-w-6xl gap-3 px-4 lg:-mt-10 lg:grid-cols-3 lg:gap-4">
        {TURLER.map(({ href, Ikon, baslik, aciklama }) => (
          <Link key={href} href={href} className="card flex items-center gap-4 p-4 transition hover:border-brand hover:shadow-md active:scale-[0.99] lg:flex-col lg:p-8 lg:text-center">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand text-white"><Ikon size={28} /></span>
            <span className="flex-1">
              <span className="block text-lg font-extrabold text-navy">{baslik}</span>
              <span className="block text-sm text-slate-500">{aciklama}</span>
            </span>
            <ChevronRight size={20} className="text-slate-300 lg:hidden" />
          </Link>
        ))}
      </div>
    </>
  );
}
