"use client";
import { useState } from 'react';
import { Check, Lock, Search, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { HIZMETLER, SEHIRLER } from '../../lib/constants';
import { Alan, HizmetIkonu } from '../../components/ui';

function SehirSecici({ secili, onDegistir }) {
  const [arama, setArama] = useState('');
  const ara = arama.toLocaleLowerCase('tr');
  const liste = SEHIRLER.filter((s) => s.toLocaleLowerCase('tr').includes(ara));
  const degistir = (sehir) => onDegistir(secili.includes(sehir) ? secili.filter((s) => s !== sehir) : [...secili, sehir]);

  return (
    <fieldset>
      <legend className="label">Hizmet Verdiği Şehirler * {secili.length > 0 && `(${secili.length} seçili)`}</legend>
      {secili.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {secili.map((s) => (
            <button key={s} type="button" onClick={() => degistir(s)} aria-label={`${s} şehrini kaldır`} className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-navy px-3 py-1.5 text-xs font-bold text-white">{s} <X size={12} /></button>
          ))}
        </div>
      )}
      <div className="relative">
        <Search size={16} className="absolute top-4 left-3.5 text-slate-400" />
        <input className="input !pl-10" value={arama} onChange={(e) => setArama(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} placeholder="Şehir ara" aria-label="Şehir ara" />
      </div>
      <div className="mt-2 flex max-h-36 flex-wrap gap-1.5 overflow-y-auto rounded-xl border border-slate-200 p-2">
        {liste.map((s) => (
          <button key={s} type="button" aria-pressed={secili.includes(s)} onClick={() => degistir(s)} className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold ${secili.includes(s) ? 'bg-orange-100 text-brand-dark' : 'bg-slate-100 text-slate-600'}`}>{s}</button>
        ))}
        {liste.length === 0 && <span className="p-2 text-xs text-slate-400">Şehir bulunamadı.</span>}
      </div>
    </fieldset>
  );
}

// firma verilirse düzenleme, verilmezse yeni kayıt
export default function FirmaFormu({ firma, onKaydedildi, onGirisGerekli }) {
  const [sehirler, setSehirler] = useState(() => (firma?.hizmet_bolgeleri || '').split(',').map((s) => s.trim()).filter(Boolean));
  const [hizmetler, setHizmetler] = useState(() => HIZMETLER.filter((h) => firma?.[h.anahtar]).map((h) => h.anahtar));
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');

  const kaydet = async (e) => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.currentTarget));
    setHata('');
    if (sehirler.length === 0) {
      setHata('Lütfen hizmet verdiğiniz en az bir şehir seçin.');
      return;
    }
    setKaydediliyor(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return onGirisGerekli();
      const alanlar = {
        ...form,
        ...Object.fromEntries(HIZMETLER.map((h) => [h.anahtar, hizmetler.includes(h.anahtar)])),
        hizmet_bolgeleri: sehirler.join(', '),
      };
      // Sahip bilgisi (user_id) veritabanında otomatik atanır
      const { data, error } = firma
        ? await supabase.from('firmalar').update(alanlar).eq('id', firma.id).select('id')
        : await supabase.from('firmalar').insert([{ ...alanlar, uye_no: `YH-${Math.floor(1000000 + Math.random() * 9000000)}`, is_active: true }]);
      if (error) throw error;
      if (firma && !data.length) throw new Error('Bu firmayı düzenleme izniniz yok.');
      onKaydedildi();
    } catch (err) {
      setHata(`Firma kaydedilemedi: ${err.message}`);
    } finally {
      setKaydediliyor(false);
    }
  };

  return (
    <form onSubmit={kaydet} className="grid grid-cols-2 gap-3">
      <Alan etiket="Firma Ticari Unvanı *" className="col-span-2"><input className="input" name="firma_adi" defaultValue={firma?.firma_adi ?? ''} required placeholder="Örn: Aydın Lojistik Ltd." /></Alan>
      <Alan etiket="Tanıtım Yazısı *" className="col-span-2"><textarea className="input" name="hakkimizda" defaultValue={firma?.hakkimizda ?? ''} required rows={3} placeholder="Hizmet ağınız ve araç filonuz hakkında bilgi" /></Alan>
      <Alan etiket="Telefon *"><input className="input" name="telefon" defaultValue={firma?.telefon ?? ''} required type="tel" placeholder="0532 123 45 67" /></Alan>
      <Alan etiket="WhatsApp"><input className="input" name="whatsapp" defaultValue={firma?.whatsapp ?? ''} type="tel" placeholder="0532 123 45 67" /></Alan>
      <Alan etiket="E-posta" className="col-span-2 sm:col-span-1"><input className="input" name="eposta" defaultValue={firma?.eposta ?? ''} type="email" placeholder="destek@firma.com" /></Alan>
      <Alan etiket="Merkez Şehir *" className="col-span-2 sm:col-span-1">
        <select className="input" name="merkez_konum" required defaultValue={firma?.merkez_konum ?? ''}>
          <option value="" disabled>Şehir seçiniz</option>
          {firma?.merkez_konum && !SEHIRLER.includes(firma.merkez_konum) && <option>{firma.merkez_konum}</option>}
          {SEHIRLER.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Alan>

      <div className="col-span-2"><SehirSecici secili={sehirler} onDegistir={setSehirler} /></div>

      <fieldset className="col-span-2">
        <legend className="label">Verilen Hizmetler</legend>
        <div className="grid grid-cols-2 gap-2">
          {HIZMETLER.map((h) => {
            const aktif = hizmetler.includes(h.anahtar);
            return (
              <button key={h.anahtar} type="button" aria-pressed={aktif} onClick={() => setHizmetler((l) => (aktif ? l.filter((x) => x !== h.anahtar) : [...l, h.anahtar]))} className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border-2 p-2 text-left text-xs font-bold ${aktif ? 'border-brand bg-orange-50 text-navy' : 'border-slate-200 text-slate-600'}`}>
                <HizmetIkonu Ikon={h.Ikon} className="size-9" boyut={18} />
                <span className="flex-1">{h.ad}</span>
                {aktif && <Check size={16} className="shrink-0 text-brand" />}
              </button>
            );
          })}
        </div>
      </fieldset>

      <Alan etiket="Logo Görsel Linki (URL)" className="col-span-2"><input className="input" name="logo_url" defaultValue={firma?.logo_url ?? ''} type="url" placeholder="https://site.com/logo.png" /></Alan>

      {!firma && <div className="col-span-2 rounded-xl bg-slate-50 p-3">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-navy"><Lock size={13} className="text-brand" /> Resmi doğrulama bilgileri</p>
        <div className="grid grid-cols-2 gap-3">
          <Alan etiket="TC Kimlik No"><input className="input" name="tc_kimlik_no" inputMode="numeric" maxLength={11} placeholder="11 hane" /></Alan>
          <Alan etiket="Vergi No"><input className="input" name="vergi_no" inputMode="numeric" maxLength={10} placeholder="10 hane" /></Alan>
        </div>
      </div>}

      {hata && <p role="alert" className="col-span-2 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{hata}</p>}
      <button type="submit" disabled={kaydediliyor} className="btn btn-brand col-span-2">{kaydediliyor ? 'Kaydediliyor…' : firma ? 'Değişiklikleri Kaydet' : 'Kaydı Tamamla'}</button>
    </form>
  );
}
