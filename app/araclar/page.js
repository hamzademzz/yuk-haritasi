"use client";
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Camera, Loader2, MapPin, Plus, Search, Truck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adresDegistir, useEklePaneli, useIlanSahibi, useOturum, useSorgu } from '../../lib/hooks';
import { sutunlar } from '../../lib/sutunlar';
import { ARAC_TIPLERI, SEHIRLER } from '../../lib/constants';
import { Alan, BosDurum, GirisPaneli, HataDurumu, Iskelet, Panel, SayfaBasligi } from '../../components/ui';
import { IletisimSatiri } from '../../components/IlanKarti';

const VARSAYILAN_RESIM = 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800';
const EN_BUYUK_RESIM_MB = 10;

function Filtre({ ilk }) {
  const [alanlar, setAlanlar] = useState(ilk);
  const bagla = (ad) => ({ value: alanlar[ad], onChange: (e) => setAlanlar((a) => ({ ...a, [ad]: e.target.value })) });

  const ara = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(Object.entries(alanlar).filter(([, v]) => v));
    adresDegistir(params.size ? `/araclar?${params}` : '/araclar');
  };

  return (
    <form onSubmit={ara} className="card grid grid-cols-2 gap-2 p-3 lg:grid-cols-[1fr_1fr_auto] lg:items-end lg:gap-3 lg:p-4">
      <Alan etiket="Bulunduğu Şehir"><input className="input" list="sehirler" placeholder="Şehir" {...bagla('konum')} /></Alan>
      <Alan etiket="Araç Tipi"><input className="input" list="arac-tipleri" placeholder="Tümü" {...bagla('tip')} /></Alan>
      <button type="submit" className="btn btn-navy col-span-2 lg:col-span-1"><Search size={17} /> Bul</button>
    </form>
  );
}

function AracFormu({ onKaydedildi, onGirisGerekli }) {
  const [resim, setResim] = useState('');
  const [resimYukleniyor, setResimYukleniyor] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const sahip = useIlanSahibi();

  const resimSec = async (e) => {
    const dosya = e.target.files[0];
    if (!dosya) return;
    setHata('');
    if (dosya.size > EN_BUYUK_RESIM_MB * 1024 * 1024) {
      setHata(`Fotoğraf en fazla ${EN_BUYUK_RESIM_MB} MB olabilir.`);
      return;
    }

    setResimYukleniyor(true);
    const uzanti = dosya.name.split('.').pop();
    const yol = `araclar/${crypto.getRandomValues(new Uint32Array(2)).join('-')}.${uzanti}`;
    const { error } = await supabase.storage.from('arac-resimleri').upload(yol, dosya);
    if (error) setHata(`Fotoğraf yüklenemedi: ${error.message}`);
    else setResim(supabase.storage.from('arac-resimleri').getPublicUrl(yol).data.publicUrl);
    setResimYukleniyor(false);
  };

  const kaydet = async (e) => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.currentTarget));
    setHata('');
    setKaydediliyor(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return onGirisGerekli();
      const { error } = await supabase.from('araclar').insert([{
        ...form,
        resim_url: resim || VARSAYILAN_RESIM,
        user_id: session.user.id,
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
      <Alan etiket="Araç Tipi *"><input className="input" name="arac_tipi" list="arac-tipleri" required placeholder="Tır" /></Alan>
      <Alan etiket="Bulunduğu Şehir *"><input className="input" name="mevcut_konum_sehir" list="sehirler" required placeholder="Şehir" /></Alan>
      <Alan etiket="Ad Soyad / Firma Adı *" className="col-span-2 sm:col-span-1"><input className="input" name="ilan_sahibi" defaultValue={sahip.ad} required autoComplete="name" /></Alan>
      <Alan etiket="İletişim Numarası *" className="col-span-2 sm:col-span-1"><input className="input" name="iletisim" defaultValue={sahip.telefon} required type="tel" autoComplete="tel" placeholder="05XX XXX XX XX" /></Alan>
      <Alan etiket="Açıklama" className="col-span-2"><textarea className="input" name="aciklama" rows={3} placeholder="Aracınız hakkında kısa bilgi" /></Alan>

      <label className="col-span-2 flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-slate-300 text-sm font-semibold text-slate-500 focus-within:border-brand">
        <input type="file" accept="image/*" onChange={resimSec} className="sr-only" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {resim && !resimYukleniyor && <img src={resim} alt="Seçilen fotoğraf" className="h-40 w-full object-cover" />}
        <span className="flex items-center gap-2 py-2">
          {resimYukleniyor ? <><Loader2 size={20} className="animate-spin" /> Yükleniyor…</> : <><Camera size={20} /> {resim ? 'Fotoğrafı değiştir' : 'Fotoğraf ekle'}</>}
        </span>
      </label>

      {hata && <p role="alert" className="col-span-2 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{hata}</p>}
      <button type="submit" disabled={kaydediliyor || resimYukleniyor} className="btn btn-brand col-span-2">{kaydediliyor ? 'Kaydediliyor…' : 'İlanı Yayınla'}</button>
    </form>
  );
}

function AracListesi() {
  const searchParams = useSearchParams();
  const secim = { konum: searchParams.get('konum') || '', tip: searchParams.get('tip') || '' };
  const anahtar = JSON.stringify(secim);
  const filtreVar = Object.values(secim).some(Boolean);
  const { panel, ac, kapat, girisIste } = useEklePaneli();
  const { user, hazir } = useOturum();

  const { veri, hata, yukleniyor, yenile } = useSorgu(`${anahtar}|${user?.id ?? ''}`, async () => {
    let sorgu = supabase.from('araclar').select(await sutunlar('araclar')).eq('is_active', true);
    if (secim.konum) sorgu = sorgu.ilike('mevcut_konum_sehir', `%${secim.konum}%`);
    if (secim.tip) sorgu = sorgu.ilike('arac_tipi', `%${secim.tip}%`);
    return sorgu.order('olusturulma_tarihi', { ascending: false });
  });

  return (
    <>
      <SayfaBasligi baslik="Araç İlanları" aciklama={yukleniyor ? 'İlanlar yükleniyor…' : `${veri.length} aktif araç`}>
        <button onClick={ac} className="btn btn-brand"><Plus size={18} /> Araç İlanı Ver</button>
      </SayfaBasligi>

      <div className="mx-auto -mt-8 max-w-6xl px-4 lg:-mt-10">
        <Filtre key={anahtar} ilk={secim} />

        <div className="sirali mt-4 grid gap-3 md:grid-cols-2 lg:mt-6 lg:gap-4 xl:grid-cols-3">
          {yukleniyor ? <Iskelet className="h-72" />
            : hata ? <HataDurumu onTekrar={yenile} />
            : veri.length === 0 ? (
              <BosDurum Ikon={Truck} mesaj={filtreVar ? 'Aradığınız kriterlere uygun araç bulunamadı.' : 'Henüz aktif araç ilanı yok.'}>
                {filtreVar && <button onClick={() => adresDegistir('/araclar')} className="btn btn-ghost">Tüm araçları göster</button>}
              </BosDurum>
            )
            : veri.map((arac) => (
              <article key={arac.id} className="card group flex flex-col overflow-hidden">
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={arac.resim_url || VARSAYILAN_RESIM} alt={arac.arac_tipi} loading="lazy" className="resim-gir size-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-navy shadow">{arac.arac_tipi}</span>
                  <span className="absolute top-3 right-3 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow">Müsait</span>
                </div>
                <div className="p-4">
                  <p className="flex items-center gap-2 text-lg font-extrabold text-navy"><MapPin size={18} className="shrink-0 text-brand" /><span className="min-w-0 break-words">{arac.mevcut_konum_sehir}</span></p>
                  {arac.aciklama && <p className="mt-2 line-clamp-3 text-sm break-words text-slate-600">{arac.aciklama}</p>}
                </div>
                <IletisimSatiri ad={arac.ilan_sahibi || 'Firma Yetkilisi'} girisGerekli={hazir && !user} altYazi="Doğrulanmış araç sahibi" telefon={arac.iletisim} />
              </article>
            ))}
        </div>
      </div>

      {panel === 'giris' && <GirisPaneli aciklama="Araç ilanı eklemek için lütfen hesabınıza giriş yapın." onKapat={kapat} />}
      {panel === 'form' && (
        <Panel baslik="Yeni Araç İlanı" onKapat={kapat}>
          <AracFormu onKaydedildi={() => { kapat(); yenile(); }} onGirisGerekli={girisIste} />
        </Panel>
      )}

      <datalist id="sehirler">{SEHIRLER.map((s) => <option key={s} value={s} />)}</datalist>
      <datalist id="arac-tipleri">{ARAC_TIPLERI.map((t) => <option key={t} value={t} />)}</datalist>
    </>
  );
}

export default function AraclarPage() {
  return (
    <Suspense fallback={<p className="p-20 text-center text-slate-500">Yükleniyor…</p>}>
      <AracListesi />
    </Suspense>
  );
}
