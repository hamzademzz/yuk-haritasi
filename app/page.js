"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Box, Building2, Handshake, Headset, MapPin, MessageCircle, Search, SearchCode, ShieldCheck, Truck, User, UserPlus, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useOturum, useSorgu } from '../lib/hooks';
import { ARAC_TIPLERI, DESTEK_WHATSAPP, HIZMETLER, SEHIRLER } from '../lib/constants';
import { oneCikanFirmalar } from '../lib/oneCikanFirmalar';
import { Alan, BosDurum, HataDurumu, Iskelet } from '../components/ui';

const ARAMA_SEKMELERI = [
  { id: 'yuk', etiket: 'Yük Ara', Ikon: Box },
  { id: 'arac', etiket: 'Araç Ara', Ikon: Truck },
  { id: 'firma', etiket: 'Firma Bul', Ikon: Building2 },
];

const GUVEN = [
  { Ikon: User, baslik: '10.000+', alt: 'Aktif Üye' },
  { Ikon: ShieldCheck, baslik: 'Güvenli', alt: 'Doğrulanmış Üyeler' },
  { Ikon: Zap, baslik: 'Hızlı Eşleşme', alt: 'Doğru Yük & Araç' },
  { Ikon: Headset, baslik: '7/24 Destek', alt: 'Yanınızdayız' },
];

const ADIMLAR = [
  { Ikon: UserPlus, baslik: 'Üye Ol', tanim: 'Ücretsiz üye olun, profilinizi oluşturun.' },
  { Ikon: SearchCode, baslik: 'İlan Bul / Yayınla', tanim: 'Yük ilanlarını inceleyin veya kendi ilanınızı yayınlayın.' },
  { Ikon: Handshake, baslik: 'Anlaş ve Taşı', tanim: 'Doğru eşleşmeyi bulun, anlaşın ve taşımayı gerçekleştirin.' },
];

const DUYURU = "🚛 TÜRKİYE'NİN EN BÜYÜK LOJİSTİK AĞINA HOŞ GELDİNİZ • GÜNLÜK 500+ YENİ YÜK İLANI YAYINLANIYOR • HEMEN ÜYE OLUN, KOMİSYONSUZ İŞ ALIN • YÜKHARİTASI İLE ROTANI ÇİZ, İŞİNİ BÜYÜT • 7/24 DESTEK HATTIMIZ AKTİF: +44 7400 221777 • ";

function AramaKutusu() {
  const router = useRouter();
  const [sekme, setSekme] = useState('yuk');
  const [alanlar, setAlanlar] = useState({ nereden: '', nereye: '', aracTipi: '', firmaAdi: '' });

  const bagla = (ad) => ({ value: alanlar[ad], onChange: (e) => setAlanlar((a) => ({ ...a, [ad]: e.target.value })) });

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
    <form onSubmit={ara} className="w-full rounded-3xl bg-white p-3 text-slate-900 shadow-2xl lg:max-w-lg lg:p-4">
      <div className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1">
        {ARAMA_SEKMELERI.map(({ id, etiket, Ikon }) => (
          <button key={id} type="button" aria-pressed={sekme === id} onClick={() => setSekme(id)} className={`flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition sm:text-sm ${sekme === id ? 'bg-white text-brand shadow-sm' : 'text-slate-500'}`}>
            <Ikon size={15} /> {etiket}
          </button>
        ))}
      </div>

      <div className="grid gap-3 pt-3 sm:grid-cols-2">
        {sekme === 'firma' && (
          <Alan etiket="Firma Adı" className="sm:col-span-2">
            <input className="input" placeholder="Firma ismi yazın" {...bagla('firmaAdi')} />
          </Alan>
        )}
        <Alan etiket={sekme === 'yuk' ? 'Nereden?' : sekme === 'arac' ? 'Bulunduğu Şehir' : 'Şehir'} className={sekme === 'firma' ? 'sm:col-span-2' : ''}>
          <input className="input" list="sehirler" placeholder="Şehir seçin" {...bagla('nereden')} />
        </Alan>
        {sekme === 'yuk' && (
          <Alan etiket="Nereye?">
            <input className="input" list="sehirler" placeholder="Şehir seçin" {...bagla('nereye')} />
          </Alan>
        )}
        {sekme !== 'firma' && (
          <Alan etiket="Araç Tipi" className={sekme === 'yuk' ? 'sm:col-span-2' : ''}>
            <input className="input" list="arac-tipleri" placeholder="Tümü" {...bagla('aracTipi')} />
          </Alan>
        )}
        <button type="submit" className="btn btn-brand sm:col-span-2"><Search size={18} /> Bul</button>
      </div>

      <datalist id="sehirler">{SEHIRLER.map((s) => <option key={s} value={s} />)}</datalist>
      <datalist id="arac-tipleri">{ARAC_TIPLERI.map((t) => <option key={t} value={t} />)}</datalist>
    </form>
  );
}

function BolumBasligi({ baslik, href, baglanti }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3 lg:mb-6">
      <h2 className="text-lg font-extrabold tracking-tight text-navy lg:text-2xl">{baslik}</h2>
      {href && <Link href={href} className="flex shrink-0 items-center gap-1 py-1 text-sm font-bold text-brand">{baglanti} <ArrowRight size={14} /></Link>}
    </div>
  );
}

function GuncelIlanlar() {
  const { veri, hata, yukleniyor, yenile } = useSorgu('son-yukler', () =>
    supabase.from('yuk_ilanlari').select('*').eq('is_active', true).order('olusturulma_tarihi', { ascending: false }).limit(4)
  );

  return (
    <section className="mx-auto max-w-6xl px-4 pt-8 lg:pt-14">
      <BolumBasligi baslik="Güncel Yük İlanları" href="/yukler" baglanti="Tümü" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {yukleniyor ? <Iskelet adet={4} className="h-32" />
          : hata ? <HataDurumu onTekrar={yenile} />
          : veri.length === 0 ? <BosDurum Ikon={Box} mesaj="Henüz aktif yük ilanı yok." />
          : veri.map((ilan) => (
            <Link key={ilan.id} href="/yukler" className="card block p-4 transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]">
              <p className="flex items-center gap-1.5 font-extrabold text-navy">
                <MapPin size={15} className="shrink-0 text-brand" />
                <span className="min-w-0 break-words">{ilan.nereden} → {ilan.nereye}</span>
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="min-w-0"><dt className="text-xs text-slate-400">Yük</dt><dd className="truncate font-semibold">{ilan.yuk_turu || 'Genel Yük'}</dd></div>
                <div className="min-w-0"><dt className="text-xs text-slate-400">Araç</dt><dd className="truncate font-semibold">{ilan.arac_tipi_gereksinimi || 'Standart'}</dd></div>
              </dl>
            </Link>
          ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { user, hazir } = useOturum();

  return (
    <>
      <div className="overflow-hidden bg-brand py-2 text-white">
        <p className="sr-only">{DUYURU}</p>
        <div aria-hidden="true" className="kayan flex w-max whitespace-nowrap text-xs font-bold">
          <span className="px-4">{DUYURU}</span><span className="px-4">{DUYURU}</span>
        </div>
      </div>

      <section className="bg-gradient-to-b from-navy to-navy-dark px-4 pt-6 pb-8 text-white lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 lg:flex-row lg:gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight lg:text-6xl">Lojistik Dünyası <br /><span className="text-brand">Tek Platformda</span></h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 lg:mx-0 lg:text-lg">Doğru yük, doğru araç ve güvenilir firmalarla hemen buluşun.</p>
          </div>
          <AramaKutusu />
        </div>
      </section>

      <GuncelIlanlar />

      <section className="mx-auto max-w-6xl px-4 pt-10 lg:pt-14">
        <BolumBasligi baslik="Lojistik Hizmetler" href="/firmalar" baglanti="Tümü" />
        <div className="grid grid-cols-4 gap-2 lg:grid-cols-8 lg:gap-3">
          {HIZMETLER.map((h) => (
            <Link key={h.anahtar} href={`/firmalar?hizmet=${h.anahtar}`} className="card flex flex-col items-center gap-2 px-1 py-3 text-center transition hover:border-brand active:scale-95">
              <span className="text-3xl" aria-hidden="true">{h.ikon}</span>
              <span className="text-[11px] leading-tight font-bold text-navy sm:text-xs">{h.ad}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-10 lg:pt-14">
        <BolumBasligi baslik="Öne Çıkan Firmalar" href="/firmalar" baglanti="Tümü" />
        <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 scroll-px-4">
          {oneCikanFirmalar.map((f) => (
            <Link key={f.ad} href="/firmalar" className="card flex w-40 shrink-0 snap-start flex-col items-center p-4 text-center transition hover:border-brand lg:w-52">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.logo} alt="" className="mb-3 h-14 w-full object-contain" />
              <span className="text-sm font-bold text-navy">{f.ad}</span>
              <span className="text-xs text-slate-400">{f.sehir}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-10 lg:pt-14">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 text-white lg:grid-cols-4">
          {GUVEN.map(({ Ikon, baslik, alt }) => (
            <div key={baslik} className="flex items-center gap-3 bg-navy p-4">
              <Ikon size={20} className="shrink-0 text-brand" />
              <div><p className="text-sm font-bold">{baslik}</p><p className="text-xs text-slate-300">{alt}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
        <BolumBasligi baslik="Nasıl Çalışır?" />
        <ol className="grid gap-3 lg:grid-cols-3">
          {ADIMLAR.map(({ Ikon, baslik, tanim }, i) => (
            <li key={baslik} className="card flex items-start gap-4 p-4 lg:flex-col lg:p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-orange-50 text-brand"><Ikon size={22} /></span>
              <div><h3 className="font-bold text-navy">{i + 1}. {baslik}</h3><p className="mt-1 text-sm text-slate-500">{tanim}</p></div>
            </li>
          ))}
        </ol>
        {hazir && !user && (
          <div className="mt-4 rounded-2xl bg-navy p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <h3 className="text-lg font-extrabold">Daha fazlası için üye olun</h3>
              <p className="mt-1 text-sm text-slate-300">İlan yayınlayın, firma iletişim bilgilerini görüntüleyin.</p>
            </div>
            <Link href="/register" className="btn btn-brand mt-4 w-full shrink-0 sm:mt-0 sm:w-auto">Ücretsiz Üye Ol</Link>
          </div>
        )}
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-8 lg:hidden">
        <a href={`https://wa.me/${DESTEK_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn btn-call w-full"><MessageCircle size={18} /> WhatsApp Destek Hattı</a>
      </div>

      <footer className="-mb-[calc(5.5rem+env(safe-area-inset-bottom))] bg-navy-dark px-4 pt-10 pb-[calc(7rem+env(safe-area-inset-bottom))] text-center text-sm text-slate-400 lg:-mb-16 lg:pb-10">
        <p className="text-xl font-black text-white">Yük<span className="text-brand">Haritası</span></p>
        <p className="mx-auto mt-2 max-w-md">Doğru yük, doğru araç ve güvenilir hizmetin buluşma noktası.</p>
        <nav className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-3 font-semibold">
          <Link href="/yukler" className="hover:text-white">Yük İlanları</Link>
          <Link href="/araclar" className="hover:text-white">Araç İlanları</Link>
          <Link href="/firmalar" className="hover:text-white">Firma Rehberi</Link>
          <a href={`https://wa.me/${DESTEK_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">Destek / İletişim</a>
        </nav>
        <p className="mt-6 text-xs">© {new Date().getFullYear()} YükHaritası. Tüm hakları saklıdır.</p>
      </footer>

      <a href={`https://wa.me/${DESTEK_WHATSAPP}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp destek hattı" className="fixed right-8 bottom-8 z-30 hidden size-14 place-items-center rounded-full bg-green-500 text-white shadow-xl transition hover:scale-105 lg:grid">
        <MessageCircle size={26} />
      </a>
    </>
  );
}
