"use client";
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, MapPin, Plus, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adresDegistir, useEklePaneli, useIlanSahibi, useOturum, useSorgu } from '../../lib/hooks';
import { sutunlar } from '../../lib/sutunlar';
import { ARAC_TIPLERI, SEHIRLER, tarihYaz } from '../../lib/constants';
import { Alan, BosDurum, GirisPaneli, HataDurumu, Iskelet, Panel, SayfaBasligi } from '../../components/ui';
import { Bilgi, IletisimSatiri } from '../../components/IlanKarti';

const FILTRELER = ['nereden', 'nereye', 'aracTipi', 'tarih'];

function Filtre({ ilk }) {
  const [alanlar, setAlanlar] = useState(ilk);
  const bagla = (ad) => ({ value: alanlar[ad], onChange: (e) => setAlanlar((a) => ({ ...a, [ad]: e.target.value })) });

  const ara = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(Object.entries(alanlar).filter(([, v]) => v));
    adresDegistir(params.size ? `/yukler?${params}` : '/yukler');
  };

  return (
    <form onSubmit={ara} className="card grid grid-cols-2 gap-2 p-3 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end lg:gap-3 lg:p-4">
      <Alan etiket="Nereden"><input className="input" list="sehirler" placeholder="Şehir" {...bagla('nereden')} /></Alan>
      <Alan etiket="Nereye"><input className="input" list="sehirler" placeholder="Şehir" {...bagla('nereye')} /></Alan>
      <Alan etiket="Araç Tipi"><input className="input" list="arac-tipleri" placeholder="Tümü" {...bagla('aracTipi')} /></Alan>
      <Alan etiket="Yükleme Tarihi"><input className="input" type="date" {...bagla('tarih')} /></Alan>
      <button type="submit" className="btn btn-navy col-span-2 lg:col-span-1"><Search size={17} /> Bul</button>
    </form>
  );
}

function YukFormu({ onKaydedildi, onGirisGerekli }) {
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const sahip = useIlanSahibi();

  const kaydet = async (e) => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.currentTarget));
    setHata('');
    setKaydediliyor(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return onGirisGerekli();
      const { error } = await supabase.from('yuk_ilanlari').insert([{
        ...form,
        agirlik_ton: parseFloat(form.agirlik_ton),
        bosaltma_tarihi: form.bosaltma_tarihi || null,
        user_id: session.user.id,
        is_active: true,
        olusturulma_tarihi: new Date().toISOString(),
      }]);
      if (error) throw error;
      onKaydedildi();
    } catch (err) {
      setHata(`İlan yayınlanamadı: ${err.message}`);
    } finally {
      setKaydediliyor(false);
    }
  };

  if (!sahip) return <p className="py-10 text-center text-sm text-slate-500">Form hazırlanıyor…</p>;

  return (
    <form onSubmit={kaydet} className="grid grid-cols-2 gap-3">
      <Alan etiket="Yükün Cinsi *" className="col-span-2"><input className="input" name="yuk_turu" required placeholder="Örn: Demir, Paletli" /></Alan>
      <Alan etiket="Ağırlık (Ton) *"><input className="input" name="agirlik_ton" required type="number" step="any" min="0" inputMode="decimal" placeholder="0" /></Alan>
      <Alan etiket="Gereken Araç"><input className="input" name="arac_tipi_gereksinimi" list="arac-tipleri" placeholder="Tır, Kamyon" /></Alan>
      <Alan etiket="Nereden *"><input className="input" name="nereden" list="sehirler" required placeholder="Şehir" /></Alan>
      <Alan etiket="Nereye *"><input className="input" name="nereye" list="sehirler" required placeholder="Şehir" /></Alan>
      <Alan etiket="Yükleme Tarihi *"><input className="input" name="yukleme_tarihi" required type="date" /></Alan>
      <Alan etiket="Boşaltma Tarihi"><input className="input" name="bosaltma_tarihi" type="date" /></Alan>
      <Alan etiket="Ad Soyad *" className="col-span-2 sm:col-span-1"><input className="input" name="ilan_sahibi_ad_soyad" defaultValue={sahip.ad} required autoComplete="name" /></Alan>
      <Alan etiket="Telefon *" className="col-span-2 sm:col-span-1"><input className="input" name="telefon_numarasi" defaultValue={sahip.telefon} required type="tel" autoComplete="tel" placeholder="05XX XXX XX XX" /></Alan>
      {hata && <p role="alert" className="col-span-2 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{hata}</p>}
      <button type="submit" disabled={kaydediliyor} className="btn btn-brand col-span-2">{kaydediliyor ? 'Kaydediliyor…' : 'İlanı Yayınla'}</button>
    </form>
  );
}

function YukListesi() {
  const searchParams = useSearchParams();
  const secim = Object.fromEntries(FILTRELER.map((f) => [f, searchParams.get(f) || '']));
  const anahtar = JSON.stringify(secim);
  const filtreVar = Object.values(secim).some(Boolean);
  const { panel, ac, kapat, girisIste } = useEklePaneli();
  const { user, hazir } = useOturum();

  const { veri, hata, yukleniyor, yenile } = useSorgu(`${anahtar}|${user?.id ?? ''}`, async () => {
    let sorgu = supabase.from('yuk_ilanlari').select(await sutunlar('yuk_ilanlari')).eq('is_active', true);
    if (secim.nereden) sorgu = sorgu.ilike('nereden', `%${secim.nereden}%`);
    if (secim.nereye) sorgu = sorgu.ilike('nereye', `%${secim.nereye}%`);
    if (secim.aracTipi) sorgu = sorgu.ilike('arac_tipi_gereksinimi', `%${secim.aracTipi}%`);
    if (secim.tarih) sorgu = sorgu.eq('yukleme_tarihi', secim.tarih);
    return sorgu.order('olusturulma_tarihi', { ascending: false });
  });

  return (
    <>
      <SayfaBasligi baslik="Yük İlanları" aciklama={yukleniyor ? 'İlanlar yükleniyor…' : `${veri.length} aktif ilan`}>
        <button onClick={ac} className="btn btn-brand"><Plus size={18} /> Yük İlanı Ver</button>
      </SayfaBasligi>

      <div className="mx-auto -mt-8 max-w-6xl px-4 lg:-mt-10">
        <Filtre key={anahtar} ilk={secim} />

        <div className="sirali mt-4 grid gap-3 md:grid-cols-2 lg:mt-6 lg:gap-4 xl:grid-cols-3">
          {yukleniyor ? <Iskelet />
            : hata ? <HataDurumu onTekrar={yenile} />
            : veri.length === 0 ? (
              <BosDurum Ikon={Box} mesaj={filtreVar ? 'Aradığınız kriterlere uygun ilan bulunamadı.' : 'Henüz aktif yük ilanı yok.'}>
                {filtreVar && <button onClick={() => adresDegistir('/yukler')} className="btn btn-ghost">Tüm ilanları göster</button>}
              </BosDurum>
            )
            : veri.map((yuk) => (
              <article key={yuk.id} className="card flex flex-col overflow-hidden">
                <div className="p-4">
                  <span className="inline-block rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-brand-dark">{yuk.yuk_turu || 'Genel Yük'}</span>
                  <div className="mt-3 space-y-1">
                    <p className="flex items-center gap-2 text-lg font-extrabold text-navy"><span className="size-2.5 shrink-0 rounded-full border-2 border-navy" /><span className="min-w-0 break-words">{yuk.nereden}</span></p>
                    <p className="flex items-center gap-2 text-lg font-extrabold text-navy"><MapPin size={14} className="-mx-0.5 shrink-0 text-brand" /><span className="min-w-0 break-words">{yuk.nereye}</span></p>
                  </div>
                  <dl className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3">
                    <Bilgi etiket="Ağırlık">{yuk.agirlik_ton} Ton</Bilgi>
                    <Bilgi etiket="Araç">{yuk.arac_tipi_gereksinimi || 'Standart'}</Bilgi>
                    <Bilgi etiket="Yükleme">{tarihYaz(yuk.yukleme_tarihi) || 'Acil'}</Bilgi>
                  </dl>
                </div>
                <IletisimSatiri ad={yuk.ilan_sahibi_ad_soyad || 'İsimsiz'} girisGerekli={hazir && !user} altYazi="Doğrulanmış ilan sahibi" telefon={yuk.telefon_numarasi} />
              </article>
            ))}
        </div>
      </div>

      {panel === 'giris' && <GirisPaneli aciklama="Yük ilanı eklemek için lütfen hesabınıza giriş yapın." onKapat={kapat} />}
      {panel === 'form' && (
        <Panel baslik="Yeni Yük İlanı" onKapat={kapat}>
          <YukFormu onKaydedildi={() => { kapat(); yenile(); }} onGirisGerekli={girisIste} />
        </Panel>
      )}

      <datalist id="sehirler">{SEHIRLER.map((s) => <option key={s} value={s} />)}</datalist>
      <datalist id="arac-tipleri">{ARAC_TIPLERI.map((t) => <option key={t} value={t} />)}</datalist>
    </>
  );
}

export default function YuklerPage() {
  return (
    <Suspense fallback={<p className="p-20 text-center text-slate-500">Yükleniyor…</p>}>
      <YukListesi />
    </Suspense>
  );
}
