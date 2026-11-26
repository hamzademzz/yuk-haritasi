"use client";
import Link from 'next/link';
import { Box, CheckCircle2, Phone, Route, Truck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useSorgu } from '../../lib/hooks';
import { tarihYaz } from '../../lib/constants';
import { aracIcinYukler, yukIcinAraclar } from '../../lib/eslesme';
import { tumSutunlar } from '../../lib/sutunlar';
import { BosDurum, HataDurumu, Iskelet } from '../../components/ui';
import { ilanDurumu } from './Ilanlarim';

const EN_FAZLA = 5;

function Eslesme({ baslik, alt, uygun, telefon }) {
  return (
    <li className="flex items-center gap-3 border-t border-slate-100 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold break-words text-navy">{baslik}</p>
        <p className="text-xs break-words text-slate-500">{alt}</p>
        {uygun && <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-green-700"><CheckCircle2 size={13} /> Araç tipi uyuyor</span>}
      </div>
      {telefon && <a href={`tel:${telefon}`} className="btn btn-call !min-h-11 shrink-0 !px-4"><Phone size={16} /> Ara</a>}
    </li>
  );
}

function Grup({ Ikon, baslik, adet, tumuHref, children }) {
  return (
    <section className="card p-4">
      <h2 className="flex items-start gap-2 pb-3 font-bold text-navy"><Ikon size={19} className="mt-0.5 shrink-0 text-brand" /><span>{baslik}</span></h2>
      {adet ? <ul>{children}</ul> : <p className="border-t border-slate-100 pt-3 text-sm text-slate-500">Şu an uygun eşleşme yok.</p>}
      {adet > EN_FAZLA && <Link href={tumuHref} className="btn btn-ghost w-full">Tümünü gör ({adet})</Link>}
    </section>
  );
}

export default function Eslesmeler({ userId, yukler, araclar }) {
  const benimYuklerim = yukler.filter((y) => ilanDurumu('yuk', y) === 'Yayında');
  const benimAraclarim = araclar.filter((a) => ilanDurumu('arac', a) === 'Yayında');

  const { veri, hata, yukleniyor, yenile } = useSorgu(`eslesme-${userId}`, async () => {
    // Başkalarının yayındaki ilanları; sahipsiz eski kayıtlar da dahil
    const baskalarinin = (tablo) => supabase.from(tablo).select(tumSutunlar(tablo)).eq('is_active', true)
      .or(`user_id.is.null,user_id.neq.${userId}`).order('olusturulma_tarihi', { ascending: false }).limit(500);
    const [y, a] = await Promise.all([baskalarinin('yuk_ilanlari'), baskalarinin('araclar')]);
    return { data: [{ yukler: y.data || [], araclar: a.data || [] }], error: y.error || a.error };
  });

  if (!benimYuklerim.length && !benimAraclarim.length) {
    return (
      <BosDurum Ikon={Route} mesaj="Eşleşme görmek için yayında bir yük veya araç ilanınız olmalı.">
        <Link href="/ilan-ver" className="btn btn-brand">İlan Ver</Link>
      </BosDurum>
    );
  }
  if (yukleniyor) return <div className="grid gap-3"><Iskelet adet={2} className="h-32" /></div>;
  if (hata) return <HataDurumu onTekrar={yenile} />;

  const diger = veri[0];

  return (
    <>
      <p className="mb-3 text-sm text-slate-500">Çıkış şehri ile aracın bulunduğu şehir aynı olan ilanlar. Araç tipi uyanlar önce gösterilir.</p>
      <div className="grid items-start gap-3 md:grid-cols-2">
        {benimAraclarim.map((arac) => {
          const liste = aracIcinYukler(arac, diger.yukler);
          return (
            <Grup key={`a-${arac.id}`} Ikon={Truck} baslik={`${arac.mevcut_konum_sehir} konumundaki ${arac.arac_tipi} aracınız için yükler`} adet={liste.length} tumuHref={`/yukler?nereden=${encodeURIComponent(arac.mevcut_konum_sehir)}`}>
              {liste.slice(0, EN_FAZLA).map((y) => (
                <Eslesme key={y.id} baslik={`${y.nereden} → ${y.nereye}`} alt={[y.yuk_turu, y.agirlik_ton != null && `${y.agirlik_ton} ton`, tarihYaz(y.yukleme_tarihi), y.ilan_sahibi_ad_soyad].filter(Boolean).join(' · ')} uygun={y.uygun} telefon={y.telefon_numarasi} />
              ))}
            </Grup>
          );
        })}
        {benimYuklerim.map((yuk) => {
          const liste = yukIcinAraclar(yuk, diger.araclar);
          return (
            <Grup key={`y-${yuk.id}`} Ikon={Box} baslik={`${yuk.nereden} → ${yuk.nereye} yükünüz için araçlar`} adet={liste.length} tumuHref={`/araclar?konum=${encodeURIComponent(yuk.nereden)}`}>
              {liste.slice(0, EN_FAZLA).map((a) => (
                <Eslesme key={a.id} baslik={`${a.arac_tipi} · ${a.mevcut_konum_sehir}`} alt={[a.ilan_sahibi, a.aciklama].filter(Boolean).join(' · ')} uygun={a.uygun} telefon={a.iletisim} />
              ))}
            </Grup>
          );
        })}
      </div>
    </>
  );
}
