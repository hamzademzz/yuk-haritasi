"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Alan, Panel } from '../../components/ui';

const ALANLAR = {
  yuk: [
    { ad: 'nereden', etiket: 'Nereden', required: true },
    { ad: 'nereye', etiket: 'Nereye', required: true },
    { ad: 'yuk_turu', etiket: 'Yük Tipi', required: true },
    { ad: 'agirlik_ton', etiket: 'Ağırlık (Ton)', type: 'number', step: 'any', min: '0', required: true },
    { ad: 'yukleme_tarihi', etiket: 'Yükleme Tarihi', type: 'date', required: true },
    { ad: 'bosaltma_tarihi', etiket: 'Boşaltma Tarihi', type: 'date', bosIseNull: true },
    { ad: 'ilan_sahibi_ad_soyad', etiket: 'Ad Soyad', required: true },
    { ad: 'telefon_numarasi', etiket: 'Telefon', type: 'tel', required: true },
    { ad: 'arac_tipi_gereksinimi', etiket: 'Gereken Araç', genis: true },
  ],
  arac: [
    { ad: 'arac_tipi', etiket: 'Araç Tipi', required: true },
    { ad: 'mevcut_konum_sehir', etiket: 'Bulunduğu Şehir', required: true },
    { ad: 'ilan_sahibi', etiket: 'Ad Soyad / Firma', required: true },
    { ad: 'iletisim', etiket: 'İletişim Numarası', type: 'tel', required: true },
    { ad: 'aciklama', etiket: 'Açıklama', genis: true },
  ],
};

export default function IlanDuzenle({ ilan, tip, onKapat, onKaydet }) {
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');

  const kaydet = async (e) => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.currentTarget));
    const degisiklik = { ...form, is_active: form.is_active === 'true' };
    for (const alan of ALANLAR[tip]) {
      if (alan.bosIseNull && !degisiklik[alan.ad]) degisiklik[alan.ad] = null;
    }
    setHata('');
    setKaydediliyor(true);
    // select() olmadan, izin kuralı güncellemeyi engellese de hata dönmez
    const { data, error } = await supabase.from(tip === 'yuk' ? 'yuk_ilanlari' : 'araclar').update(degisiklik).eq('id', ilan.id).select('id');
    setKaydediliyor(false);
    if (error) setHata(`İlan güncellenemedi: ${error.message}`);
    else if (!data.length) setHata('İlan güncellenemedi. Bu ilan için düzenleme izniniz olmayabilir.');
    else onKaydet();
  };

  return (
    <Panel baslik="İlanı Düzenle" onKapat={onKapat}>
      <form onSubmit={kaydet} className="grid grid-cols-2 gap-3">
        {ALANLAR[tip].map(({ ad, etiket, genis, type, step, min, required }) => (
          <Alan key={ad} etiket={etiket} className={genis ? 'col-span-2' : ''}>
            <input className="input" name={ad} defaultValue={ilan[ad] ?? ''} type={type} step={step} min={min} required={required} />
          </Alan>
        ))}
        <Alan etiket="İlan Durumu" className="col-span-2">
          <select className="input" name="is_active" defaultValue={String(!!ilan.is_active)}>
            <option value="true">Aktif / Yayında</option>
            <option value="false">Pasif / Kapatılmış</option>
          </select>
        </Alan>
        {hata && <p role="alert" className="col-span-2 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{hata}</p>}
        <button type="submit" disabled={kaydediliyor} className="btn btn-navy col-span-2">{kaydediliyor ? 'Kaydediliyor…' : 'Değişiklikleri Kaydet'}</button>
      </form>
    </Panel>
  );
}
