"use client";
import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cikisYap } from '../../components/AppShell';
import { Alan } from '../../components/ui';
import SifreFormu from '../../components/SifreFormu';

export const ROLLER = [
  ['Firma / Yük Sahibi', 'Firma / Yük Sahibi'],
  ['Bireysel Nakliyeci', 'Bireysel Nakliyeci / Sürücü'],
  ['Lojistik Şirketi', 'Lojistik Şirketi (Araç & Filo Sahibi)'],
];

export default function Hesap({ user, profil, onSonuc }) {
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const kaydet = async (e) => {
    e.preventDefault();
    const degisiklik = Object.fromEntries(new FormData(e.currentTarget));
    setKaydediliyor(true);
    let { data, error } = await supabase.from('profiles').update(degisiklik).eq('id', user.id).select('id');
    // Profil satırı hiç oluşmamışsa oluştur
    if (!error && !data.length) ({ error } = await supabase.from('profiles').insert([{ id: user.id, ...degisiklik }]));
    setKaydediliyor(false);
    if (error) onSonuc('hata', `Profil kaydedilemedi: ${error.message}`);
    else onSonuc('basari', 'Profil bilgileriniz kaydedildi.', true);
  };

  return (
    <div className="grid items-start gap-3 lg:grid-cols-2">
      <section className="card p-4 lg:p-6">
        <h2 className="mb-1 font-bold text-navy">Profil Bilgileri</h2>
        <p className="mb-4 text-sm text-slate-500">Ad ve telefonunuz yeni ilan formlarına otomatik yazılır.</p>
        <form onSubmit={kaydet} className="grid grid-cols-2 gap-3">
          <Alan etiket="Adınız"><input className="input" name="first_name" required defaultValue={profil.first_name || ''} autoComplete="given-name" /></Alan>
          <Alan etiket="Soyadınız"><input className="input" name="last_name" required defaultValue={profil.last_name || ''} autoComplete="family-name" /></Alan>
          <Alan etiket="Telefon Numarası" className="col-span-2"><input className="input" name="phone" type="tel" required defaultValue={profil.phone || ''} autoComplete="tel" /></Alan>
          <Alan etiket="Platform Rolü" className="col-span-2">
            {/* Veritabanı varsayılanı 'user' seçeneklerde yok; ilk seçeneği göster */}
            <select className="input" name="rol" defaultValue={ROLLER.some(([v]) => v === profil.rol) ? profil.rol : ROLLER[0][0]}>
              {ROLLER.map(([v, ad]) => <option key={v} value={v}>{ad}</option>)}
            </select>
          </Alan>
          <button type="submit" disabled={kaydediliyor} className="btn btn-navy col-span-2">{kaydediliyor ? 'Kaydediliyor…' : 'Bilgileri Kaydet'}</button>
        </form>
      </section>

      <div className="grid gap-3">
        <section className="card p-4 lg:p-6">
          <h2 className="mb-4 font-bold text-navy">Şifre Değiştir</h2>
          <SifreFormu />
        </section>
        <section className="card p-4 lg:p-6">
          <p className="mb-3 text-sm break-words text-slate-500">Giriş yapılan hesap: <strong className="text-navy">{user.email}</strong></p>
          <button onClick={cikisYap} className="btn btn-danger w-full"><LogOut size={16} /> Çıkış Yap</button>
        </section>
      </div>
    </div>
  );
}
