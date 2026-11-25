"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BadgeCheck, Box, Building2, CalendarDays, ChevronRight, Handshake, Headset, MapPin, MessageCircle, Search, SearchCheck, ShieldCheck, Truck, UserPlus, Users, Weight, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useOturum, useSorgu } from '../lib/hooks';
import { ARAC_TIPLERI, DESTEK_WHATSAPP, HIZMETLER, SEHIRLER, tarihYaz } from '../lib/constants';
import { oneCikanFirmalar } from '../lib/oneCikanFirmalar';
import { Alan, BosDurum, HataDurumu, HizmetIkonu, Iskelet } from '../components/ui';

const DESTEK_LINKI = `https://wa.me/${DESTEK_WHATSAPP}`;

const ARAMA_SEKMELERI = [
  { id: 'yuk', etiket: 'Yük Ara', Ikon: Box, dugme: 'Yük Bul' },
  { id: 'arac', etiket: 'Araç Ara', Ikon: Truck, dugme: 'Araç Bul' },
  { id: 'firma', etiket: 'Firma Bul', Ikon: Building2, dugme: 'Firma Bul' },
];

const GUVEN = [
  { Ikon: Users, baslik: '10.000+', alt: 'Aktif üye' },
  { Ikon: ShieldCheck, baslik: 'Güvenli', alt: 'Doğrulanmış üyeler' },
  { Ikon: Zap, baslik: 'Hızlı Eşleşme', alt: 'Doğru yük ve araç' },
  { Ikon: Headset, baslik: '7/24 Destek', alt: 'Her zaman yanınızda' },
];

const ADIMLAR = [
  { Ikon: UserPlus, baslik: 'Üye olun', tanim: 'Ücretsiz hesabınızı açın ve profilinizi oluşturun.' },
  { Ikon: SearchCheck, baslik: 'İlan bulun veya yayınlayın', tanim: 'Güncel ilanları inceleyin ya da kendi ilanınızı dakikalar içinde yayınlayın.' },
  { Ikon: Handshake, baslik: 'Anlaşın ve taşıyın', tanim: 'İlan sahibiyle doğrudan görüşün, anlaşın ve taşımayı gerçekleştirin.' },
];

function Ikonlu({ Ikon, children }) {
  return (
    <div className="relative">
      <Ikon size={18} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400" />
      {children}
    </div>
  );
}

function AramaKutusu() {
  const router = useRouter();
  const [sekme, setSekme] = useState('yuk');
  const [alanlar, setAlanlar] = useState({ nereden: '', nereye: '', aracTipi: '', firmaAdi: '' });

  const bagla = (ad) => ({ value: alanlar[ad], onChange: (e) => setAlanlar((a) => ({ ...a, [ad]: e.target.value })) });
  const { dugme } = ARAMA_SEKMELERI.find((s) => s.id === sekme);

  const ara = (e) => {
    e.preventDefault();
    const { nereden, nereye, aracTipi, firmaAdi } = alanlar;
    const [yol, degerler] =
      sekme === 'firma' ? ['/firmalar', { arama: firmaAdi, sehir: nereden }]
      : sekme === 'arac' ? ['/araclar', { konum: nereden, tip: aracTipi }]
      : ['/yukler', { nereden, nereye, aracTipi }];
    const params = new URLSearchParams(Object.entries(degerler).filter(([, v]) => v));
    router.push(params.size ? `${yol}?${params}` : yol);
  };

  return (
    <form onSubmit={ara} className="w-full overflow-hidden rounded-2xl bg-white text-left text-slate-900 shadow-2xl shadow-black/30 lg:max-w-lg">
      <div className="grid grid-cols-3 border-b border-slate-200">
        {ARAMA_SEKMELERI.map(({ id, etiket, Ikon }) => (
          <button key={id} type="button" aria-pressed={sekme === id} onClick={() => setSekme(id)} className={`flex min-h-14 cursor-pointer items-center justify-center gap-1.5 border-b-2 text-[13px] font-semibold transition sm:text-sm ${sekme === id ? 'border-brand bg-white text-navy' : 'border-transparent bg-slate-50 text-slate-500 hover:text-navy'}`}>
            <Ikon size={16} aria-hidden="true" className={`max-[359px]:hidden ${sekme === id ? 'text-brand' : ''}`} /> {etiket}
          </button>
        ))}
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:p-6">
        {sekme === 'firma' && (
          <Alan etiket="Firma adı" className="sm:col-span-2">
            <Ikonlu Ikon={Building2}><input className="input !pl-11" placeholder="Firma ismi yazın" {...bagla('firmaAdi')} /></Ikonlu>
          </Alan>
        )}
        <Alan etiket={sekme === 'yuk' ? 'Nereden' : sekme === 'arac' ? 'Bulunduğu şehir' : 'Şehir'} className={sekme === 'yuk' ? '' : 'sm:col-span-2'}>
          <Ikonlu Ikon={MapPin}><input className="input !pl-11" list="sehirler" placeholder="Şehir seçin" {...bagla('nereden')} /></Ikonlu>
        </Alan>
        {sekme === 'yuk' && (
          <Alan etiket="Nereye">
            <Ikonlu Ikon={MapPin}><input className="input !pl-11" list="sehirler" placeholder="Şehir seçin" {...bagla('nereye')} /></Ikonlu>
          </Alan>
        )}
        {sekme !== 'firma' && (
          <Alan etiket="Araç tipi" className="sm:col-span-2">
            <Ikonlu Ikon={Truck}><input className="input !pl-11" list="arac-tipleri" placeholder="Tüm araç tipleri" {...bagla('aracTipi')} /></Ikonlu>
          </Alan>
        )}
        <button type="submit" className="btn btn-brand mt-1 !min-h-13 !text-base sm:col-span-2"><Search size={18} /> {dugme}</button>
      </div>

      <datalist id="sehirler">{SEHIRLER.map((s) => <option key={s} value={s} />)}</datalist>
      <datalist id="arac-tipleri">{ARAC_TIPLERI.map((t) => <option key={t} value={t} />)}</datalist>
    </form>
  );
}

function Bolum({ ustBaslik, baslik, aciklama, href, baglanti, children }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 lg:py-16">
      <div className="mb-5 flex items-end justify-between gap-4 lg:mb-8">
        <div>
          <p className="text-xs font-bold tracking-widest text-brand-dark uppercase">{ustBaslik}</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-navy lg:text-3xl">{baslik}</h2>
          {aciklama && <p className="mt-2 max-w-xl text-sm text-slate-500 lg:text-base">{aciklama}</p>}
        </div>
        {href && (
          <Link href={href} className="hidden shrink-0 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-navy transition hover:border-navy sm:flex">
            {baglanti} <ArrowRight size={15} />
          </Link>
        )}
      </div>
      {children}
      {href && <Link href={href} className="btn mt-4 w-full border border-slate-300 bg-white text-navy sm:hidden">{baglanti} <ArrowRight size={16} /></Link>}
    </section>
  );
}

function Durak({ son, children }) {
  return (
    <p className="flex items-center gap-3">
      <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-full ${son ? 'bg-brand' : 'border-2 border-navy'}`} />
      <span className="min-w-0 truncate font-bold text-navy">{children}</span>
    </p>
  );
}

function GuncelIlanlar() {
  const { veri, hata, yukleniyor, yenile } = useSorgu('son-yukler', () =>
    supabase.from('yuk_ilanlari').select('*').eq('is_active', true).order('olusturulma_tarihi', { ascending: false }).limit(4)
  );

  return (
    <Bolum ustBaslik="Yeni eklenenler" baslik="Güncel Yük İlanları" href="/yukler" baglanti="Tüm yük ilanları">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {yukleniyor ? <Iskelet adet={4} className="h-48" />
          : hata ? <HataDurumu onTekrar={yenile} />
          : veri.length === 0 ? <BosDurum Ikon={Box} mesaj="Henüz aktif yük ilanı yok." />
          : veri.map((ilan) => (
            <Link key={ilan.id} href="/yukler" className="card group flex flex-col p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg active:scale-[0.99] lg:p-5">
              <Durak>{ilan.nereden}</Durak>
              <span aria-hidden="true" className="ml-[4.5px] h-4 border-l border-dashed border-slate-300" />
              <Durak son>{ilan.nereye}</Durak>

              <p className="mt-4 truncate text-sm font-semibold text-slate-700">{ilan.yuk_turu || 'Genel Yük'}</p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-slate-500">
                <li className="flex items-center gap-1.5"><Truck size={14} aria-hidden="true" /> {ilan.arac_tipi_gereksinimi || 'Standart'}</li>
                {ilan.agirlik_ton != null && <li className="flex items-center gap-1.5"><Weight size={14} aria-hidden="true" /> {ilan.agirlik_ton} ton</li>}
                <li className="flex items-center gap-1.5"><CalendarDays size={14} aria-hidden="true" /> {tarihYaz(ilan.yukleme_tarihi) || 'Acil'}</li>
              </ul>

              <span className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm font-semibold text-navy group-hover:text-brand-dark">
                İlanları incele <ChevronRight size={16} />
              </span>
            </Link>
          ))}
      </div>
    </Bolum>
  );
}

export default function HomePage() {
  const { user, hazir } = useOturum();

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-dark px-4 pt-8 pb-20 text-white lg:pt-20 lg:pb-32">
        <div aria-hidden="true" className="hero-desen absolute inset-0 -z-10" />
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 lg:flex-row lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-200">
              <MapPin size={13} aria-hidden="true" className="text-brand" /> Türkiye&apos;nin Lojistik Platformu
            </p>
            <h1 className="mt-4 text-4xl leading-[1.1] font-bold tracking-tight lg:text-6xl">Lojistik Dünyası <span className="block text-brand">Tek Platformda</span></h1>
            <p className="mx-auto mt-4 max-w-md text-base text-slate-300 lg:mx-0 lg:text-lg">Doğru yük, doğru araç ve güvenilir firmalarla hemen buluşun.</p>
            <ul className="mt-6 hidden flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-200 lg:flex">
              {['Ücretsiz üyelik', 'Komisyonsuz iş', 'Doğrudan iletişim'].map((m) => (
                <li key={m} className="flex items-center gap-2"><BadgeCheck size={17} aria-hidden="true" className="text-brand" /> {m}</li>
              ))}
            </ul>
          </div>
          <AramaKutusu />
        </div>
      </section>

      <div className="relative mx-auto -mt-10 max-w-6xl px-4 lg:-mt-14">
        <ul className="card grid grid-cols-2 gap-px overflow-hidden !bg-slate-200 shadow-lg shadow-slate-900/5 lg:grid-cols-4">
          {GUVEN.map(({ Ikon, baslik, alt }) => (
            <li key={baslik} className="flex flex-col items-center gap-2 bg-white p-4 text-center sm:flex-row sm:gap-3 sm:text-left lg:p-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-orange-50 text-brand-dark"><Ikon size={22} strokeWidth={1.75} aria-hidden="true" /></span>
              <span><span className="block text-sm font-bold text-navy lg:text-base">{baslik}</span><span className="block text-xs text-slate-500">{alt}</span></span>
            </li>
          ))}
        </ul>
      </div>

      <GuncelIlanlar />

      <div className="border-y border-slate-200 bg-white">
        <Bolum ustBaslik="Hizmetler" baslik="Lojistik Hizmetler" aciklama="İhtiyacınız olan hizmeti veren firmalara tek dokunuşla ulaşın." href="/firmalar" baglanti="Tüm firmalar">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {HIZMETLER.map((h) => (
              <Link key={h.anahtar} href={`/firmalar?hizmet=${h.anahtar}`} className="card group flex flex-col gap-3 p-4 transition hover:-translate-y-0.5 hover:border-brand/60 hover:shadow-lg active:scale-[0.98] lg:p-5">
                <HizmetIkonu Ikon={h.Ikon} className="size-12 transition group-hover:!bg-brand group-hover:text-white" boyut={24} />
                <span>
                  <span className="block text-sm leading-snug font-bold text-navy lg:text-base">{h.ad}</span>
                  <span className="mt-0.5 block text-xs text-slate-500 lg:text-sm">{h.alt}</span>
                </span>
              </Link>
            ))}
          </div>
        </Bolum>
      </div>

      <Bolum ustBaslik="İş ortakları" baslik="Öne Çıkan Firmalar" href="/firmalar" baglanti="Firma rehberi">
        <div className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0">
          {oneCikanFirmalar.map((f) => (
            <Link key={f.ad} href="/firmalar" className="card flex w-40 shrink-0 snap-start flex-col items-center p-4 text-center transition hover:border-slate-300 hover:shadow-lg lg:w-auto">
              <span className="flex h-20 w-full items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.logo} alt="" className="max-h-14 max-w-full object-contain" />
              </span>
              <span className="mt-2 w-full border-t border-slate-100 pt-3 text-sm font-bold text-navy">{f.ad}</span>
              <span className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><MapPin size={12} aria-hidden="true" /> {f.sehir}</span>
            </Link>
          ))}
        </div>
      </Bolum>

      <div className="border-t border-slate-200 bg-white">
        <Bolum ustBaslik="3 kolay adım" baslik="Nasıl Çalışır?">
          <ol className="grid gap-3 lg:grid-cols-3 lg:gap-4">
            {ADIMLAR.map(({ Ikon, baslik, tanim }, i) => (
              <li key={baslik} className="relative flex gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:flex-col lg:p-7">
                <span aria-hidden="true" className="absolute top-2 right-4 text-5xl font-bold text-slate-200">{i + 1}</span>
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-navy text-white"><Ikon size={22} strokeWidth={1.75} aria-hidden="true" /></span>
                <div className="relative pr-6 lg:pr-0"><h3 className="font-bold text-navy lg:text-lg">{baslik}</h3><p className="mt-1 text-sm leading-relaxed text-slate-500">{tanim}</p></div>
              </li>
            ))}
          </ol>
        </Bolum>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-10 lg:py-16">
        <div className="relative isolate overflow-hidden rounded-3xl bg-navy px-6 py-8 text-white lg:flex lg:items-center lg:justify-between lg:gap-8 lg:px-12 lg:py-12">
          <Truck aria-hidden="true" size={220} strokeWidth={1} className="absolute -right-8 -bottom-12 -z-10 text-white/[0.06]" />
          <div>
            <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">{user ? 'Yeni bir ilan yayınlayın' : 'İşinizi büyütmeye bugün başlayın'}</h2>
            <p className="mt-2 max-w-lg text-sm text-slate-300 lg:text-base">{user ? 'Yükünüzü, boş aracınızı veya firmanızı birkaç adımda ekleyin.' : 'Ücretsiz üye olun, ilan yayınlayın ve firma iletişim bilgilerine ulaşın.'}</p>
          </div>
          <div className="mt-6 grid shrink-0 gap-2 sm:flex lg:mt-0">
            {hazir && (user
              ? <Link href="/ilan-ver" className="btn btn-brand">İlan Ver <ArrowRight size={16} /></Link>
              : <Link href="/register" className="btn btn-brand">Ücretsiz Üye Ol <ArrowRight size={16} /></Link>)}
            <a href={DESTEK_LINKI} target="_blank" rel="noopener noreferrer" className="btn border border-white/25 text-white hover:bg-white/10">
              <MessageCircle size={17} /> WhatsApp Destek
            </a>
          </div>
        </div>
      </section>

      <footer className="-mb-[calc(5.5rem+env(safe-area-inset-bottom))] bg-navy-dark px-4 pt-10 pb-[calc(7rem+env(safe-area-inset-bottom))] text-sm text-slate-400 lg:-mb-16 lg:pt-14 lg:pb-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 lg:grid-cols-[2fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <p className="text-xl font-extrabold text-white">Yük<span className="text-brand">Haritası</span></p>
            <p className="mt-3 max-w-sm leading-relaxed">Doğru yük, doğru araç ve güvenilir hizmetin buluşma noktası.</p>
          </div>
          <nav aria-label="Hızlı erişim" className="flex flex-col items-start gap-3">
            <p className="font-bold text-white">Hızlı Erişim</p>
            <Link href="/yukler" className="hover:text-white">Yük İlanları</Link>
            <Link href="/araclar" className="hover:text-white">Araç İlanları</Link>
            <Link href="/firmalar" className="hover:text-white">Firma Rehberi</Link>
          </nav>
          <div className="flex flex-col items-start gap-3">
            <p className="font-bold text-white">Destek</p>
            <a href={DESTEK_LINKI} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white"><MessageCircle size={15} /> WhatsApp</a>
            <a href={`tel:+${DESTEK_WHATSAPP}`} className="flex items-center gap-2 hover:text-white"><Headset size={15} /> +44 7400 221777</a>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-xs">© {new Date().getFullYear()} YükHaritası. Tüm hakları saklıdır.</p>
      </footer>
    </>
  );
}
