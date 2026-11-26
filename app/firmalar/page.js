"use client";
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Building2, MapPin, Plus, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adresDegistir, useEklePaneli, useOturum, useSorgu } from '../../lib/hooks';
import { sutunlar } from '../../lib/sutunlar';
import { HIZMETLER, SEHIRLER } from '../../lib/constants';
import Puan from '../../components/Puan';
import { Alan, BosDurum, GirisPaneli, HataDurumu, Iskelet, Panel, SayfaBasligi } from '../../components/ui';
import FirmaDetay, { VARSAYILAN_LOGO } from './FirmaDetay';
import FirmaFormu from './FirmaFormu';

function Filtre({ ilk }) {
  const [alanlar, setAlanlar] = useState(ilk);
  const bagla = (ad) => ({ value: alanlar[ad], onChange: (e) => setAlanlar((a) => ({ ...a, [ad]: e.target.value })) });

  const ara = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(Object.entries(alanlar).filter(([, v]) => v));
    adresDegistir(params.size ? `/firmalar?${params}` : '/firmalar');
  };

  return (
    <form onSubmit={ara} className="card grid grid-cols-2 gap-2 p-3 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end lg:gap-3 lg:p-4">
      <Alan etiket="Firma Adı" className="col-span-2 lg:col-span-1"><input className="input" placeholder="Firma adı ile ara" {...bagla('arama')} /></Alan>
      <Alan etiket="Şehir"><input className="input" list="sehirler" placeholder="Tümü" {...bagla('sehir')} /></Alan>
      <Alan etiket="Hizmet">
        <select className="input" {...bagla('hizmet')}>
          <option value="">Tümü</option>
          {HIZMETLER.map((h) => <option key={h.anahtar} value={h.anahtar}>{h.ad}</option>)}
        </select>
      </Alan>
      <button type="submit" className="btn btn-navy col-span-2 lg:col-span-1"><Search size={17} /> Bul</button>
    </form>
  );
}

function FirmaRehberi() {
  const searchParams = useSearchParams();
  const hizmet = searchParams.get('hizmet') || '';
  const secim = {
    arama: searchParams.get('arama') || '',
    sehir: searchParams.get('sehir') || searchParams.get('merkez_konum') || '',
    hizmet: HIZMETLER.some((h) => h.anahtar === hizmet) ? hizmet : '',
  };
  const anahtar = JSON.stringify(secim);
  const filtreVar = Object.values(secim).some(Boolean);
  const seciliId = searchParams.get('id');
  const { panel, ac, kapat, girisIste } = useEklePaneli();
  const { user } = useOturum();

  const { veri, hata, yukleniyor, yenile } = useSorgu(`${anahtar}|${user?.id ?? ''}`, async () => {
    let sorgu = supabase.from('firmalar').select(await sutunlar('firmalar')).eq('is_active', true);
    if (secim.arama) sorgu = sorgu.ilike('firma_adi', `%${secim.arama}%`);
    if (secim.sehir) sorgu = sorgu.ilike('merkez_konum', `%${secim.sehir}%`);
    if (secim.hizmet) sorgu = sorgu.eq(secim.hizmet, true);
    return sorgu.order('firma_adi', { ascending: true });
  });

  // Seçili firma adresten okunur; telefonun geri tuşu listeye döndürür
  const seciliFirma = seciliId ? veri.find((f) => String(f.id) === seciliId) : null;

  const adres = (id) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) params.set('id', id);
    else params.delete('id');
    return params.size ? `/firmalar?${params}` : '/firmalar';
  };

  if (seciliFirma) {
    return <FirmaDetay key={seciliFirma.id} firma={seciliFirma} onGeri={() => adresDegistir(adres(null))} />;
  }

  return (
    <>
      <SayfaBasligi baslik="Firma Rehberi" aciklama={yukleniyor ? 'Firmalar yükleniyor…' : `${veri.length} firma`}>
        <button onClick={ac} className="btn btn-brand"><Plus size={18} /> Firma Ekle</button>
      </SayfaBasligi>

      <div className="mx-auto -mt-8 max-w-6xl px-4 lg:-mt-10">
        <Filtre key={anahtar} ilk={secim} />

        <div className="sirali mt-4 grid gap-3 sm:grid-cols-2 lg:mt-6 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4">
          {yukleniyor ? <Iskelet className="h-24 sm:h-44" />
            : hata ? <HataDurumu onTekrar={yenile} />
            : veri.length === 0 ? (
              <BosDurum Ikon={Building2} mesaj={filtreVar ? 'Arama kriterlerine uygun firma bulunamadı.' : 'Henüz kayıtlı firma yok.'}>
                {filtreVar && <button onClick={() => adresDegistir('/firmalar')} className="btn btn-ghost">Tüm firmaları göster</button>}
              </BosDurum>
            )
            : veri.map((firma) => (
              <button key={firma.id} onClick={() => { adresDegistir(adres(firma.id)); window.scrollTo(0, 0); }} className="card flex cursor-pointer items-center gap-4 p-4 text-left transition hover:border-brand hover:shadow-md active:scale-[0.99] sm:flex-col sm:text-center">
                <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={firma.logo_url || VARSAYILAN_LOGO} alt="" loading="lazy" className="resim-gir max-h-full max-w-full object-contain" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-extrabold break-words text-navy">{firma.firma_adi}</span>
                  <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500 sm:justify-center"><MapPin size={12} className="text-brand" /> {firma.merkez_konum || 'Türkiye'}</span>
                  <Puan firma={firma} className="mt-1 text-xs text-amber-500 sm:justify-center" />
                </span>
              </button>
            ))}
        </div>
      </div>

      {panel === 'giris' && <GirisPaneli aciklama="Rehbere firma eklemek için lütfen hesabınıza giriş yapın." onKapat={kapat} />}
      {panel === 'form' && (
        <Panel baslik="Rehbere Firma Kaydet" onKapat={kapat}>
          <FirmaFormu onKaydedildi={() => { kapat(); yenile(); }} onGirisGerekli={girisIste} />
        </Panel>
      )}

      <datalist id="sehirler">{SEHIRLER.map((s) => <option key={s} value={s} />)}</datalist>
    </>
  );
}

export default function FirmalarPage() {
  return (
    <Suspense fallback={<p className="p-20 text-center text-slate-500">Yükleniyor…</p>}>
      <FirmaRehberi />
    </Suspense>
  );
}
